"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user has admin role
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      if (profile?.role === "admin") {
        toast.success("Welcome back, Admin!");
        router.push("/admin");
        router.refresh();
      } else {
        // Sign out if not admin
        await supabase.auth.signOut();
        toast.error("Unauthorized access. Admin only.");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1714] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-heading">
            Admin Dashboard
          </h1>
          <p className="text-[var(--color-warm-400)] text-sm mt-1">
            PrintMacha Store Management
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-2xl bg-[var(--color-warm-900)] border border-[var(--color-warm-800)]">
          <form onSubmit={handleLogin} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2" 
              id="admin-login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
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
