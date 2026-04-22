"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function CustomerLogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  return (
    <button onClick={handleLogout} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-error)] transition-colors text-left group w-full">
      <LogOut className="w-5 h-5 text-[var(--color-error)] mb-3" />
      <h3 className="font-semibold mb-1 group-hover:text-[var(--color-error)] transition-colors">Log Out</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">Sign out of your account</p>
    </button>
  );
}
