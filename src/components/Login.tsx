import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, User, Loader2 } from "lucide-react";
import { handleLogin, handleSignup } from "@/lib/apiHandlers";
import { sendPasswordRecovery } from "@/lib/auth";
import { checkAdminRedirect } from "@/lib/adminAuth";
import { useToast } from "@/hooks/use-toast";
import { loginWithFacebook, loginWithGithub, loginWithMicrosoft, checkOAuthSession } from "@/lib/socialAuth";
import { FaFacebook, FaGithub, FaMicrosoft } from "react-icons/fa";
interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'individual' | 'organization';
  organizationName?: string;
  organizationWebsite?: string;
}

export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const loginForm = useForm<LoginFormData>();
  const registerForm = useForm<RegisterFormData>({
    defaultValues: {
      userType: 'individual'
    }
  });

  const userType = registerForm.watch('userType');

  // Check for OAuth errors on mount
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      toast({
        title: "Social Login Failed",
        description: "Unable to complete social login. Please try again or use email/password.",
        variant: "destructive"
      });
    }

    // Check if user is already authenticated (OAuth redirect success)
    const checkExistingSession = async () => {
      const result = await checkOAuthSession();
      if (result.success && result.user) {
        const { isAdmin } = await checkAdminRedirect();
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    };
    checkExistingSession();
  }, [searchParams, navigate, toast]);

  // Social login handlers
  const handleSocialLogin = async (provider: 'facebook' | 'github' | 'microsoft') => {
    setIsSocialLoading(provider);
    try {
      let result;
      switch (provider) {
        case 'facebook':
          result = await loginWithFacebook();
          break;
        case 'github':
          result = await loginWithGithub();
          break;
        case 'microsoft':
          result = await loginWithMicrosoft();
          break;
      }
      // OAuth redirects, so we shouldn't reach here unless there's an error
      if (!result?.success) {
        toast({
          title: "Login Failed",
          description: result?.error || `Unable to connect to ${provider}`,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Social login failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSocialLoading(null);
    }
  };

  const onLogin = async (data: LoginFormData) => {
    try {
      const result = await handleLogin(data.email, data.password);
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "Checking your access level...",
        });
        
        // Check if user is admin and redirect accordingly
        const { isAdmin } = await checkAdminRedirect();
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid email or password.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to connect to the server.",
        variant: "destructive"
      });
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await handleSignup(data.name, data.email, data.password);
      
      if (result.success) {
        // Store user type and organization info (would typically go to database)
        console.log('User registration data:', {
          name: data.name,
          email: data.email,
          userType: data.userType,
          organizationName: data.organizationName,
          organizationWebsite: data.organizationWebsite
        });

        toast({
          title: "Account Created Successfully!",
          description: "Welcome to Amniva. You have been automatically logged in.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "An error occurred during registration.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to connect to the server.",
        variant: "destructive"
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setIsResetting(true);
    try {
      const result = await sendPasswordRecovery(resetEmail);
      if (result.success) {
        toast({
          title: "Reset Email Sent",
          description: "Check your inbox for password reset instructions.",
        });
        setForgotPasswordOpen(false);
        setResetEmail('');
      } else {
        toast({
          title: "Failed to Send Reset Email",
          description: result.error || "Please try again.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-between items-start mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              ← Back to Home
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold">Amniva</CardTitle>
          <CardDescription>Welcome! Please sign in or create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    {...loginForm.register("email", { required: "Email is required" })}
                  />
                  {loginForm.formState.errors.email && (
                    <span className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    {...loginForm.register("password", { required: "Password is required" })}
                  />
                  {loginForm.formState.errors.password && (
                    <span className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</span>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Sign In
                </Button>

                <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="w-full text-sm">
                      Forgot Password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reset Your Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you instructions to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email Address</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isResetting}>
                        {isResetting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Social Login Section */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={isSocialLoading !== null}
                    className="w-full"
                  >
                    {isSocialLoading === 'facebook' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FaFacebook className="h-5 w-5 text-blue-600" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('github')}
                    disabled={isSocialLoading !== null}
                    className="w-full"
                  >
                    {isSocialLoading === 'github' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FaGithub className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('microsoft')}
                    disabled={isSocialLoading !== null}
                    className="w-full"
                  >
                    {isSocialLoading === 'microsoft' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FaMicrosoft className="h-5 w-5 text-blue-500" />
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Enter your full name"
                    {...registerForm.register("name", { required: "Name is required" })}
                  />
                  {registerForm.formState.errors.name && (
                    <span className="text-red-500 text-sm">{registerForm.formState.errors.name.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    {...registerForm.register("email", { required: "Email is required" })}
                  />
                  {registerForm.formState.errors.email && (
                    <span className="text-red-500 text-sm">{registerForm.formState.errors.email.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    {...registerForm.register("password", { required: "Password is required" })}
                  />
                  {registerForm.formState.errors.password && (
                    <span className="text-red-500 text-sm">{registerForm.formState.errors.password.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    {...registerForm.register("confirmPassword", { required: "Please confirm your password" })}
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <span className="text-red-500 text-sm">{registerForm.formState.errors.confirmPassword.message}</span>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Account Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      userType === 'individual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        value="individual"
                        {...registerForm.register("userType")}
                        className="sr-only"
                      />
                      <User className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">Individual</div>
                        <div className="text-xs text-gray-500">Personal use</div>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                      userType === 'organization' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        value="organization"
                        {...registerForm.register("userType")}
                        className="sr-only"
                      />
                      <Building className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">Organization</div>
                        <div className="text-xs text-gray-500">Business use</div>
                      </div>
                    </label>
                  </div>
                </div>

                {userType === 'organization' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="organization-name">Organization Name</Label>
                      <Input
                        id="organization-name"
                        type="text"
                        placeholder="Enter organization name"
                        {...registerForm.register("organizationName", { 
                          required: userType === 'organization' ? "Organization name is required" : false 
                        })}
                      />
                      {registerForm.formState.errors.organizationName && (
                        <span className="text-red-500 text-sm">{registerForm.formState.errors.organizationName.message}</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization-website">Organization Website (Optional)</Label>
                      <Input
                        id="organization-website"
                        type="url"
                        placeholder="https://www.organization.com"
                        {...registerForm.register("organizationWebsite")}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Organization accounts may be eligible for API access. 
                        You can apply for institutional access after registration.
                      </p>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
