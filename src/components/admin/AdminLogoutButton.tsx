"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminLogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  return (
    <button onClick={handleLogout} className="admin-nav-item w-full text-left text-[var(--color-error)]">
      <LogOut className="w-4 h-4" />
      Log Out
    </button>
  );
}
