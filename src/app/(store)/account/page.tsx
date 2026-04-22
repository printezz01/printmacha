import Link from "next/link";
import { User, ShoppingBag, MapPin, Heart, LogOut, ChevronRight, Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your PrintMacha account, orders, and addresses.",
};

export default function AccountPage() {
  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="text-3xl font-bold font-[var(--font-heading)] mb-8">My Account</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-3 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xl font-bold">
            P
          </div>
          <div>
            <h2 className="font-bold text-lg">PrintMacha Customer</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">+91 98765 43210</p>
          </div>
        </div>

        {/* Quick Links */}
        {[
          { title: "Orders", desc: "Track and manage your orders", icon: ShoppingBag, href: "/account/orders", count: "3" },
          { title: "Addresses", desc: "Manage shipping addresses", icon: MapPin, href: "/account/addresses", count: "2" },
          { title: "Profile", desc: "Update your personal info", icon: User, href: "/account/profile" },
          { title: "Wishlist", desc: "Your saved items", icon: Heart, href: "/wishlist", count: "5" },
          { title: "Track Order", desc: "Real-time order tracking", icon: Package, href: "/account/track" },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <item.icon className="w-5 h-5 text-[var(--color-accent)]" />
              {item.count && (
                <span className="text-xs font-bold bg-[var(--color-brand-orange-100)] text-[var(--color-accent)] px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-[var(--color-accent)] transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
          </Link>
        ))}

        {/* Logout */}
        <button className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-error)] transition-colors text-left group">
          <LogOut className="w-5 h-5 text-[var(--color-error)] mb-3" />
          <h3 className="font-semibold mb-1 group-hover:text-[var(--color-error)] transition-colors">Log Out</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Sign out of your account</p>
        </button>
      </div>
    </div>
  );
}
