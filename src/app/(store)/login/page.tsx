import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your PrintMacha account.",
};

export default function LoginPage() {
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
          <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-2">Welcome back</h1>
          <p className="text-[var(--color-text-secondary)]">
            Log in with your phone number to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6 md:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="tel"
                  className="input pl-10"
                  placeholder="+91 98765 43210"
                  id="login-phone"
                />
              </div>
            </div>

            <button className="w-full btn btn-primary btn-lg" id="send-otp-btn">
              Send OTP
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* OTP section (hidden by default, would be toggled by JS) */}
          <div className="mt-6 pt-6 border-t border-[var(--color-border)] hidden" id="otp-section">
            <label className="text-sm font-medium mb-1.5 block">Enter OTP</label>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="input text-center text-lg font-bold w-12 h-12"
                />
              ))}
            </div>
            <button className="w-full btn btn-primary btn-lg" id="verify-otp-btn">
              Verify & Login
            </button>
            <p className="text-xs text-center text-[var(--color-text-muted)] mt-3">
              Didn&apos;t receive OTP?{" "}
              <button className="text-[var(--color-accent)] font-medium">Resend</button>
            </p>
          </div>

          <p className="text-xs text-center text-[var(--color-text-muted)] mt-6">
            By continuing, you agree to our{" "}
            <Link href="/policies/terms" className="text-[var(--color-accent)] hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="/policies/privacy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-sm text-center mt-6 text-[var(--color-text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[var(--color-accent)] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
