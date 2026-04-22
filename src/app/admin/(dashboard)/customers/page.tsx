import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customers | Admin" };

export default function AdminCustomersPage() {
  const customers = [
    { name: "Ananya S.", email: "ananya@example.com", phone: "+91 98765 43210", orders: 3, total: 4945, joined: "Mar 2026" },
    { name: "Rahul M.", email: "rahul@example.com", phone: "+91 98765 43211", orders: 2, total: 3598, joined: "Mar 2026" },
    { name: "Priya K.", email: "priya@example.com", phone: "+91 98765 43212", orders: 1, total: 1999, joined: "Apr 2026" },
    { name: "Vikram J.", email: "vikram@example.com", phone: "+91 98765 43213", orders: 2, total: 5497, joined: "Feb 2026" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-6">Customers</h1>
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
        <input type="text" className="input pl-10" placeholder="Search customers..." />
      </div>
      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Customer</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Phone</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Orders</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Total Spent</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {customers.map((c) => (
              <tr key={c.email} className="hover:bg-[var(--color-surface-muted)]">
                <td className="p-4"><p className="font-medium">{c.name}</p><p className="text-xs text-[var(--color-text-muted)]">{c.email}</p></td>
                <td className="p-4 text-[var(--color-text-muted)]">{c.phone}</td>
                <td className="p-4">{c.orders}</td>
                <td className="p-4 font-medium">₹{c.total.toLocaleString("en-IN")}</td>
                <td className="p-4 text-[var(--color-text-muted)]">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
