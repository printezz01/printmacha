"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, User, Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data } = await supabase
          .from("user_profiles")
          .select("full_name, phone")
          .eq("user_id", user.id)
          .single();
        if (data) {
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
        }
      }
      setIsLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user.id,
          full_name: fullName,
          phone,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (error) throw error;
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-wide py-8 md:py-12">
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide py-8 md:py-12">
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/account" className="hover:text-[var(--color-text-primary)]">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text-primary)] font-medium">Profile</span>
      </nav>
      <h1 className="text-2xl font-bold font-heading mb-6">My Profile</h1>
      <div className="max-w-xl space-y-6 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Full Name</label>
          <input
            type="text"
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            disabled
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Email is linked to your login and cannot be changed
          </p>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Phone</label>
          <input
            type="tel"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
