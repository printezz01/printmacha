import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Coupons | Admin" };

export default async function AdminCouponsPage() {
  const supabase = await createServiceRoleClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });


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
            {coupons?.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-[var(--color-surface-muted)]">
                <td className="p-4 font-mono font-bold text-[var(--color-accent)]">{coupon.code}</td>
                <td className="p-4">{coupon.type === "percentage" ? `${coupon.value}%` : formatPrice(coupon.value)}</td>
                <td className="p-4">{formatPrice(coupon.min_order_amount)}</td>
                <td className="p-4">{coupon.used_count}/{coupon.usage_limit || "∞"}</td>
                <td className="p-4 text-[var(--color-text-muted)]">{coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : "Never"}</td>
                <td className="p-4"><span className={`status-pill ${coupon.is_active ? "status-confirmed" : "status-cancelled"}`}>{coupon.is_active ? "Active" : "Inactive"}</span></td>

                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-sm btn-icon"><Pencil className="w-4 h-4" /></button>
                    <button className="btn btn-ghost btn-sm btn-icon text-[var(--color-error)]"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {(!coupons || coupons.length === 0) && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-[var(--color-text-muted)]">
                  No coupons found. Create your first discount code!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
