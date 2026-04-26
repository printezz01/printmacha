"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Welcome back!");
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
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
            <span className="text-2xl font-bold font-heading">
              Print<span className="text-[var(--color-accent)]">Macha</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold font-heading mb-2">
            Welcome back
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Log in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="p-6 md:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <form onSubmit={handleLogin} className="space-y-4">
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

            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing In...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-wide py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
