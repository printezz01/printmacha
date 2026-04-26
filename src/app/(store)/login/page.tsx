"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// ─── OTP Input (6 digits, auto-tab) ──────────────────────────────────────────
function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const next = [...digits];
    next[i] = char;
    const joined = next.join("");
    onChange(joined);
    if (char && i < 5) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 outline-none transition-all disabled:opacity-50"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ─── Login Form ──────────────────────────────────────────────────────────────
function LoginForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const supabase = createClient();

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      toast.success("Verification code sent! Check your inbox.");
      setStep("otp");
      setCooldown(60);
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
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
        toast.success("Welcome to PrintMacha!");
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code. Please try again.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (cooldown > 0) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      toast.success("New code sent!");
      setCooldown(60);
      setOtp("");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && step === "otp" && !isLoading) {
      handleVerifyOtp({ preventDefault: () => {} } as React.FormEvent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <div className="container-wide py-16 md:py-24">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold font-heading">
              print<span className="text-[var(--color-accent)]">macha</span>
            </span>
          </Link>

          {step === "email" ? (
            <>
              <h1 className="text-2xl font-bold font-heading mb-2">
                Sign in or create account
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                We&apos;ll send a verification code to your email
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold font-heading mb-2">
                Check your email
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-[var(--color-text-primary)]">{email}</span>
              </p>
            </>
          )}
        </div>

        {/* Card */}
        <div className="p-6 md:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">

          {/* ── Step 1: Enter email ───────────────────────────────── */}
          {step === "email" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Email Address
                </label>
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
                    autoFocus
                    id="login-email"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn btn-primary btn-lg flex justify-center gap-2"
                disabled={isLoading}
                id="login-send-otp"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sending code...</>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          {/* ── Step 2: Enter OTP ─────────────────────────────────── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />

              <button
                type="submit"
                className="w-full btn btn-primary btn-lg flex justify-center gap-2"
                disabled={isLoading || otp.length !== 6}
                id="login-verify-otp"
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Verify & Sign In</>
                )}
              </button>

              {/* Resend + Change email */}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setOtp(""); }}
                  className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || isLoading}
                  className="text-[var(--color-accent)] hover:underline disabled:text-[var(--color-text-muted)] disabled:no-underline transition-colors"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security note */}
        <div className="flex items-start gap-2 mt-6 p-4 rounded-xl bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
          <ShieldCheck className="w-4 h-4 text-[var(--color-success)] mt-0.5 shrink-0" />
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            No password needed. We&apos;ll send a secure one-time code to your email every time you log in.
            Your session stays active for 7 days.
          </p>
        </div>

        <p className="text-xs text-center text-[var(--color-text-muted)] mt-4">
          By continuing, you agree to our{" "}
          <Link href="/policies/terms" className="text-[var(--color-accent)] hover:underline">Terms</Link>
          {" "}and{" "}
          <Link href="/policies/privacy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-wide py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
