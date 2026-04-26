"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, ArrowRight, User as UserIcon, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Name, Email and Password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      if (data.user) {
        toast.success("Account created successfully! Welcome to PrintMacha.");
        router.push("/account");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-wide py-16 md:py-24">
      <div className="max-w-md mx-auto">
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
            Create your account
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Join PrintMacha for a premium shopping experience
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input 
                  type="text" 
                  className="input pl-10" 
                  placeholder="Your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input 
                  type="email" 
                  className="input pl-10" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input 
                  type="password" 
                  className="input pl-10" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone Number (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input 
                  type="tel" 
                  className="input pl-10" 
                  placeholder="+91 98765 43210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full btn btn-primary btn-lg flex justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

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
