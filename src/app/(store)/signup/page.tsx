import Link from "next/link";
import { Phone, ArrowRight, User as UserIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your PrintMacha account.",
};

export default function SignupPage() {
  return (
    <div className="container-wide py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold font-[var(--font-heading)]">
              Print<span className="text-[var(--color-accent)]">Macha</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-2">Create your account</h1>
          <p className="text-[var(--color-text-secondary)]">
            Join PrintMacha for a premium shopping experience
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input type="text" className="input pl-10" placeholder="Your name" id="signup-name" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input type="tel" className="input pl-10" placeholder="+91 98765 43210" id="signup-phone" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email (optional)</label>
              <input type="email" className="input" placeholder="your@email.com" id="signup-email" />
            </div>
            <button className="w-full btn btn-primary btn-lg" id="signup-btn">
              Create Account
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-center text-[var(--color-text-muted)] mt-6">
            By creating an account, you agree to our{" "}
            <Link href="/policies/terms" className="text-[var(--color-accent)] hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="/policies/privacy" className="text-[var(--color-accent)] hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-sm text-center mt-6 text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-accent)] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
