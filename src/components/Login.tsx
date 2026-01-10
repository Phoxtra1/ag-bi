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
import phoxtraLogo from "@/assets/phoxtra-logo.png";
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
  const [phoxtraDialogOpen, setPhoxtraDialogOpen] = useState(false);
  const [phoxtraId, setPhoxtraId] = useState('');
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

  // Check for OAuth errors / success redirect on mount
  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'oauth_failed') {
      toast({
        title: "Social Login Failed",
        description: "Unable to complete social login. Please try again or use email/password.",
        variant: "destructive"
      });
    }

    // If user is already authenticated (e.g. after OAuth redirect), route them accordingly.
    const checkExistingSession = async () => {
      const result = await checkOAuthSession();
      if (result.success && result.user) {
        const { isAdmin } = await checkAdminRedirect();
        navigate(isAdmin ? "/admin" : "/dashboard");
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

        // Ensure the session is actually established before routing (avoids redirect loops
        // in environments where cookies can be delayed/blocked).
        let currentUser: any = null;
        for (let i = 0; i < 6; i++) {
          try {
            // Importing account here keeps the auth source consistent with the rest of the app.
            const { account } = await import("@/lib/appwrite");
            currentUser = await account.get();
            break;
          } catch {
            await new Promise((r) => setTimeout(r, 200));
          }
        }

        if (!currentUser) {
          toast({
            title: "Sign-in incomplete",
            description:
              "We couldn't confirm your session after sign-in. If you're in a strict browser or embedded preview, allow third‑party cookies for Appwrite or use a custom domain.",
            variant: "destructive",
          });
          return;
        }

        // Check if user is admin and redirect accordingly
        const { isAdmin } = await checkAdminRedirect();

        // If the designated admin email is logging in but role isn't found, show a clear setup hint.
        const designatedAdminEmail = String(import.meta.env.VITE_ADMIN_EMAIL || "")
          .trim()
          .toLowerCase();
        const currentEmail = String(currentUser?.email || "").trim().toLowerCase();

        if (!isAdmin && designatedAdminEmail && currentEmail === designatedAdminEmail) {
          toast({
            title: "Admin role record not linked",
            description:
              `You're signed in as the designated admin email, but no 'admin' role is linked to this account. In Appwrite, create a document in user_roles with user_id = ${currentUser.$id} and role = admin (and ensure users can read their own role).`,
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        navigate(isAdmin ? "/admin" : "/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to connect to the server.",
        variant: "destructive",
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

                <div className="grid grid-cols-4 gap-3">
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
                  <Dialog open={phoxtraDialogOpen} onOpenChange={setPhoxtraDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full p-1"
                      >
                        <img src={phoxtraLogo} alt="Phoxtra" className="h-5 w-5 rounded-full object-cover" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <img src={phoxtraLogo} alt="Phoxtra" className="h-10 w-10 rounded-full" />
                          <DialogTitle>Enter Your PhoxtraID</DialogTitle>
                        </div>
                        <DialogDescription>
                          Sign in using your unified PhoxtraID.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="phoxtra-id">PhoxtraID</Label>
                          <Input
                            id="phoxtra-id"
                            type="text"
                            placeholder="PID-**************"
                            value={phoxtraId}
                            onChange={(e) => {
                              let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
                              // Auto-format with dashes: PID-XXXXX-IND/BIZ-XXXX
                              if (!value.startsWith('PID') && value.length > 0) {
                                value = 'PID-' + value.replace('PID', '');
                              }
                              if (value.length === 3 && !value.includes('-')) {
                                value = value + '-';
                              }
                              if (value.length > 4 && value.charAt(3) !== '-') {
                                value = value.slice(0, 3) + '-' + value.slice(3);
                              }
                              if (value.length === 9 && value.split('-').length === 2) {
                                value = value + '-';
                              }
                              if (value.length > 10 && value.split('-').length === 2) {
                                const parts = value.split('-');
                                value = parts[0] + '-' + parts[1].slice(0, 5) + '-' + parts[1].slice(5);
                              }
                              if (value.length > 13 && value.split('-').length === 3) {
                                const parts = value.split('-');
                                if (parts[2].length > 3 && !['IND', 'BIZ'].includes(parts[2].slice(0, 3))) {
                                  // Keep as is
                                } else if (parts[2].length === 3) {
                                  value = value + '-';
                                }
                              }
                              if (value.length > 17 && value.split('-').length === 3) {
                                const parts = value.split('-');
                                value = parts[0] + '-' + parts[1] + '-' + parts[2].slice(0, 3) + '-' + parts[2].slice(3);
                              }
                              // Limit total length
                              if (value.length > 19) {
                                value = value.slice(0, 19);
                              }
                              setPhoxtraId(value);
                            }}
                          />
                        </div>
                        <Button 
                          className="w-full" 
                          disabled
                          onClick={() => {
                            toast({
                              title: "Phoxtra Integration Pending",
                              description: "PhoxtraID login will be available once the Phoxtra API is integrated.",
                            });
                          }}
                        >
                          Sign In with PhoxtraID
                        </Button>
                        <div className="text-center pt-2">
                          <a 
                            href="https://www.phoxtra.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            Sign Up for PhoxtraID →
                          </a>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
