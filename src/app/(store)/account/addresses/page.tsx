import Link from "next/link";
import { ChevronRight, Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Addresses" };

export default function AddressesPage() {
  const addresses = [
    { id: "1", label: "Home", name: "PrintMacha Customer", phone: "+91 98765 43210", line1: "123 Example Street, Koramangala", city: "Bangalore", state: "Karnataka", pincode: "560034", isDefault: true },
    { id: "2", label: "Office", name: "PrintMacha Customer", phone: "+91 98765 43210", line1: "456 Work Tower, Indiranagar", city: "Bangalore", state: "Karnataka", pincode: "560038", isDefault: false },
  ];

  return (
    <div className="container-wide py-8 md:py-12">
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/account" className="hover:text-[var(--color-text-primary)]">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text-primary)] font-medium">Addresses</span>
      </nav>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">My Addresses</h1>
        <button className="btn btn-primary btn-sm"><Plus className="w-4 h-4" /> Add Address</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] relative">
            {addr.isDefault && <span className="badge badge-new absolute top-4 right-4">Default</span>}
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="font-semibold">{addr.label}</span>
            </div>
            <p className="text-sm">{addr.name}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">{addr.line1}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">{addr.city}, {addr.state} {addr.pincode}</p>
            <p className="text-sm text-[var(--color-text-secondary)]">{addr.phone}</p>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-ghost btn-sm"><Pencil className="w-3.5 h-3.5" /> Edit</button>
              {!addr.isDefault && <button className="btn btn-ghost btn-sm text-[var(--color-error)]"><Trash2 className="w-3.5 h-3.5" /> Remove</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
