"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectUrl}`,
        },
      });

      if (error) throw error;
      
      setStep("otp");
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Logged in successfully!");
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-wide py-16 md:py-24">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold font-[var(--font-heading)]">
              Print<span className="text-[var(--color-accent)]">Macha</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-2">
            {step === "email" ? "Welcome back" : "Check your email"}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {step === "email" 
              ? "Log in with your email to continue" 
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6 md:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type="email"
                    className="input pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full btn btn-primary btn-lg flex justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                ) : (
                  <>Send OTP <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-1.5 block text-center">Enter 6-digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  className="input text-center text-2xl font-bold tracking-[0.5em] h-14"
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={isLoading}
                  autoFocus
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full btn btn-primary btn-lg flex justify-center gap-2"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                ) : (
                  <><CheckCircle2 className="w-5 h-5" /> Verify & Login</>
                )}
              </button>
              
              <p className="text-xs text-center text-[var(--color-text-muted)] mt-4">
                Didn&apos;t receive it?{" "}
                <button 
                  type="button" 
                  onClick={handleSendOtp} 
                  className="text-[var(--color-accent)] font-medium hover:underline"
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </p>
            </form>
          )}

          <p className="text-xs text-center text-[var(--color-text-muted)] mt-6">
            By continuing, you agree to our{" "}
            <Link href="/policies/terms" className="text-[var(--color-accent)] hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="/policies/privacy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        {step === "email" && (
          <p className="text-sm text-center mt-6 text-[var(--color-text-secondary)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--color-accent)] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-wide py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
