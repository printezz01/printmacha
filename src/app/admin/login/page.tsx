import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | PrintMacha",
  description: "Login to the PrintMacha admin dashboard.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#1A1714] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-heading)]">
            Admin Dashboard
          </h1>
          <p className="text-[var(--color-warm-400)] text-sm mt-1">
            PrintMacha Store Management
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-2xl bg-[var(--color-warm-900)] border border-[var(--color-warm-800)]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-warm-300)] mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-warm-500)]" />
                <input
                  type="email"
                  className="w-full px-4 py-3 pl-10 bg-[#1A1714] border border-[var(--color-warm-700)] rounded-lg text-white text-sm placeholder:text-[var(--color-warm-600)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="admin@printmacha.com"
                  id="admin-email"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--color-warm-300)] mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-warm-500)]" />
                <input
                  type="password"
                  className="w-full px-4 py-3 pl-10 bg-[#1A1714] border border-[var(--color-warm-700)] rounded-lg text-white text-sm placeholder:text-[var(--color-warm-600)] focus:outline-none focus:border-[var(--color-accent)]"
                  placeholder="••••••••"
                  id="admin-password"
                />
              </div>
            </div>
            <button className="w-full btn btn-primary btn-lg" id="admin-login-btn">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--color-warm-600)] mt-6">
          <Link href="/" className="hover:text-[var(--color-warm-400)] transition-colors">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
