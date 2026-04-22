import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Coupons | Admin" };

export default function AdminCouponsPage() {
  const coupons = [
    { code: "WELCOME10", type: "percentage", value: 10, minOrder: 500, maxDiscount: 200, usageLimit: 500, used: 47, active: true, validUntil: "Oct 2026" },
    { code: "FLAT100", type: "fixed", value: 100, minOrder: 999, maxDiscount: null, usageLimit: 200, used: 23, active: true, validUntil: "Jul 2026" },
    { code: "LAUNCH20", type: "percentage", value: 20, minOrder: 1500, maxDiscount: 500, usageLimit: 100, used: 68, active: true, validUntil: "May 2026" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">Coupons</h1>
        <button className="btn btn-primary"><Plus className="w-4 h-4" /> Create Coupon</button>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Code</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Discount</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Min Order</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Usage</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Valid Until</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Status</th>
              <th className="text-left p-4 font-medium text-[var(--color-text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {coupons.map((coupon) => (
              <tr key={coupon.code} className="hover:bg-[var(--color-surface-muted)]">
                <td className="p-4 font-mono font-bold text-[var(--color-accent)]">{coupon.code}</td>
                <td className="p-4">{coupon.type === "percentage" ? `${coupon.value}%` : formatPrice(coupon.value)}</td>
                <td className="p-4">{formatPrice(coupon.minOrder)}</td>
                <td className="p-4">{coupon.used}/{coupon.usageLimit}</td>
                <td className="p-4 text-[var(--color-text-muted)]">{coupon.validUntil}</td>
                <td className="p-4"><span className={`status-pill ${coupon.active ? "status-confirmed" : "status-cancelled"}`}>{coupon.active ? "Active" : "Inactive"}</span></td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-sm btn-icon"><Pencil className="w-4 h-4" /></button>
                    <button className="btn btn-ghost btn-sm btn-icon text-[var(--color-error)]"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
