// @ts-nocheck
/**
 * AuthForm.tsx — AGStock authentication form (Supabase).
 *
 * NOTE: This file targets the AGStock project (Supabase + `shops` / `employees`
 * tables). It is stored here only so it can be copied into the AGStock
 * codebase. It is NOT wired into this Amniva project.
 *
 * Copy to: src/components/AuthForm.tsx in the AGStock project.
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Building2, Mail, Lock, Globe, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const countries = [
  { code: "GH", name: "Ghana", currency: "GHS" },
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "KE", name: "Kenya", currency: "KES" },
  { code: "ZA", name: "South Africa", currency: "ZAR" },
  { code: "FC", name: "Francophone Africa (CFA)", currency: "XOF" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "EU", name: "Europe (Eurozone)", currency: "EUR" },
  { code: "US", name: "United States", currency: "USD" },
  { code: "CN", name: "China", currency: "CNY" },
  { code: "KR", name: "South Korea", currency: "KRW" },
  { code: "IL", name: "Israel", currency: "ILS" },
  { code: "UAE", name: "United Arab Emirates", currency: "AED" },
  { code: "Default", name: "Other / Not Listed", currency: "USD" },
];

type AuthMode = "login" | "signup";

const normalizeEmail = (v: string) => v.trim().toLowerCase();

/**
 * Safe wrapper for an active-employee lookup. Returns true if the given user
 * is an active employee. Never throws — RLS / network errors resolve to false
 * so they cannot block sign-in.
 */
const isActiveEmployee = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (error) {
      console.warn("[AuthForm] employees lookup failed:", error.message);
      return false;
    }
    return !!data;
  } catch (e: any) {
    console.warn("[AuthForm] employees lookup threw:", e?.message);
    return false;
  }
};

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const { toast } = useToast();

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    email: "",
    password: "",
    country: "",
    currency: "",
  });

  // -------------------------------------------------------------------------
  // Initial session check + auth listener
  // -------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    // Hard timeout so the UI never gets stuck on "checking session".
    const safety = setTimeout(() => {
      if (!cancelled) setCheckingSession(false);
    }, 3000);

    const checkExistingSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) return;
        if (!session) {
          setCheckingSession(false);
          return;
        }

        // Employee guard — kicks them out of the owner login flow.
        if (await isActiveEmployee(session.user.id)) {
          if (cancelled) return;
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Employee Account Detected",
            description:
              "Employees must access AGStock through their workspace invite link. Contact your shop owner.",
          });
          setCheckingSession(false);
          return;
        }

        // Shop owner check — never let RLS errors block UI.
        try {
          const { data: shop, error: shopErr } = await supabase
            .from("shops")
            .select("id")
            .eq("owner_id", session.user.id)
            .maybeSingle();

          if (cancelled) return;
          if (shopErr) {
            console.warn("[AuthForm] shops lookup failed:", shopErr.message);
            setCheckingSession(false);
            return;
          }
          if (shop) {
            window.location.href = "/shop";
            return;
          }
        } catch (e: any) {
          console.warn("[AuthForm] shop check threw:", e?.message);
        }

        setCheckingSession(false);
      } catch (e: any) {
        console.warn("[AuthForm] session check failed:", e?.message);
        if (!cancelled) setCheckingSession(false);
      }
    };

    checkExistingSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;
      if (event === "SIGNED_IN" && session) {
        if (await isActiveEmployee(session.user.id)) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Employee Account Detected",
            description:
              "Employees must access AGStock through their workspace invite link.",
          });
        }
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(safety);
      subscription.unsubscribe();
    };
  }, []);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    const assignedCurrency = country?.currency || "USD";
    setFormData((prev) => ({
      ...prev,
      country: countryCode,
      currency: assignedCurrency,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Required Fields",
        description: "Email and Password are required.",
      });
      return;
    }

    setLoading(true);
    try {
      const email = normalizeEmail(formData.email);

      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });

        if (error) throw error;
        if (!data?.session || !data?.user) {
          throw new Error("Login failed — no session returned.");
        }

        // Employee guard
        if (await isActiveEmployee(data.user.id)) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Employee Account Detected",
            description:
              "Employees must access AGStock through their workspace invite link. Contact your shop owner.",
          });
          return;
        }

        // Ensure a shop record exists for this owner. Failures here are
        // non-fatal — we still redirect so the dashboard can recover.
        try {
          const { data: existingShop, error: shopErr } = await supabase
            .from("shops")
            .select("id")
            .eq("owner_id", data.user.id)
            .maybeSingle();

          if (shopErr) {
            console.warn("[AuthForm] shop lookup failed:", shopErr.message);
          } else if (!existingShop) {
            const meta = data.user.user_metadata || {};
            const shopName =
              meta.name || meta.businessName || email.split("@")[0];
            const { error: insertErr } = await supabase.from("shops").insert({
              owner_id: data.user.id,
              name: shopName,
              email: data.user.email ?? email,
              country: meta.country || "",
              currency: meta.currency || "",
              status: "trial",
            });
            if (insertErr) {
              console.warn(
                "[AuthForm] auto-create shop failed:",
                insertErr.message
              );
            }
          }
        } catch (e: any) {
          console.warn("[AuthForm] shop bootstrap threw:", e?.message);
        }

        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard…",
        });
        window.location.href = "/shop";
        return;
      }

      // ----------------------------- SIGNUP -----------------------------
      if (
        !formData.businessName ||
        !formData.businessType ||
        !formData.country ||
        !formData.currency
      ) {
        toast({
          variant: "destructive",
          title: "Required Fields",
          description: "Please fill all required fields.",
        });
        return;
      }

      // Pre-signup employee email guard. Wrapped so RLS denies cannot block.
      try {
        const { data: existingEmp, error: empErr } = await supabase
          .from("employees")
          .select("id")
          .eq("invited_email", email)
          .maybeSingle();

        if (!empErr && existingEmp) {
          toast({
            variant: "destructive",
            title: "Employee Email Detected",
            description:
              "This email is registered as an employee. Employees must access AGStock through their workspace invite link from their shop owner.",
          });
          return;
        }
      } catch (e: any) {
        console.warn("[AuthForm] pre-signup employee check skipped:", e?.message);
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: formData.businessName,
            business_type: formData.businessType,
            country: formData.country,
            currency: formData.currency,
            industry_type: formData.businessType,
          },
        },
      });

      if (error) throw error;
      if (!data?.user) throw new Error("Signup failed — no user returned.");

      if (data.session) {
        // Email confirmation disabled — user is already authenticated.
        try {
          const { error: upsertErr } = await supabase.from("shops").upsert(
            {
              owner_id: data.user.id,
              name: formData.businessName.trim(),
              email,
              country: formData.country,
              currency: formData.currency,
              status: "trial",
              industry_type: formData.businessType,
            },
            { onConflict: "owner_id" }
          );
          if (upsertErr) {
            console.warn(
              "[AuthForm] shop upsert after signup failed:",
              upsertErr.message
            );
          }
        } catch (e: any) {
          console.warn("[AuthForm] shop upsert threw:", e?.message);
        }

        toast({
          title: "Account Created",
          description: "Welcome to AGStock!",
        });
        window.location.href = "/shop";
      } else {
        // Email confirmation required.
        localStorage.setItem(
          "agstock_pending_shop",
          JSON.stringify({
            name: formData.businessName.trim(),
            country: formData.country,
            currency: formData.currency,
            industryType: formData.businessType,
          })
        );
        toast({
          title: "Account Created",
          description:
            "Check your email for a confirmation link, then sign in.",
        });
        setMode("login");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error?.message || "A network error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = normalizeEmail(forgotEmail);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }
    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setForgotSent(true);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description:
          err?.message || "Could not send reset email. Please try again.",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <>
      <div className="w-full max-w-md mx-auto">
        {checkingSession && (
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-2" />
            <span className="text-xs text-muted-foreground">
              Checking session…
            </span>
          </div>
        )}

        <div className="flex bg-secondary rounded-lg p-1 mb-8">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all ${
              mode === "login"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all ${
              mode === "signup"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {mode === "signup" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium">
                  Business Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your Business Name"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        businessName: e.target.value,
                      }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType" className="text-sm font-medium">
                  Type of Business
                </Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, businessType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type of Business" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">🛒 Retail</SelectItem>
                    <SelectItem value="wholesale">📦 Wholesale</SelectItem>
                    <SelectItem value="warehouse">🏭 Warehouse</SelectItem>
                    <SelectItem value="hospitality">🏨 Hospitality</SelectItem>
                    <SelectItem value="school">🎓 School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="pl-10"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Select
                    value={formData.country}
                    onValueChange={handleCountryChange}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">
                  Currency
                </Label>
                <Input
                  id="currency"
                  type="text"
                  value={formData.currency}
                  readOnly
                  placeholder="Auto-assigned based on country"
                />
                <p className="text-xs text-muted-foreground">
                  Currency is automatically set based on your country
                </p>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-gold hover:bg-gold-dark text-gold-foreground font-semibold py-6"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {mode === "login" ? "Signing In…" : "Creating Account…"}
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>

          {mode === "login" && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setForgotSent(false);
                  setForgotEmail("");
                }}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </form>
      </div>

      <Dialog
        open={showForgot}
        onOpenChange={(open) => {
          setShowForgot(open);
          if (!open) {
            setForgotSent(false);
            setForgotEmail("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter your shop owner email address. We'll send you a link to
              reset your password.
            </DialogDescription>
          </DialogHeader>

          {forgotSent ? (
            <div className="py-4 text-center space-y-3">
              <div className="text-4xl">📧</div>
              <p className="font-semibold text-foreground">Reset link sent!</p>
              <p className="text-sm text-muted-foreground">
                Check your inbox at <strong>{forgotEmail}</strong> and follow
                the link to set a new password.
              </p>
              <Button
                className="w-full mt-2"
                onClick={() => setShowForgot(false)}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@business.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
              >
                {forgotLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Note: This is for Shop Owners only. Employees must contact
                their shop owner for a password reset.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthForm;
