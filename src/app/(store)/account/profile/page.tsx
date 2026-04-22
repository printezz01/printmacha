import Link from "next/link";
import { ChevronRight, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return (
    <div className="container-wide py-8 md:py-12">
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/account" className="hover:text-[var(--color-text-primary)]">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text-primary)] font-medium">Profile</span>
      </nav>
      <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-6">My Profile</h1>
      <div className="max-w-xl space-y-6 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Full Name</label>
          <input type="text" className="input" defaultValue="PrintMacha Customer" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Phone</label>
          <input type="tel" className="input" defaultValue="+91 98765 43210" disabled />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Phone number cannot be changed</p>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email</label>
          <input type="email" className="input" placeholder="your@email.com" />
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  );
}
