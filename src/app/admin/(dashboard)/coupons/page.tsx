"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch coupons: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Coupon deleted");
        fetchCoupons();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error("Failed to delete coupon: " + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      code: formData.get("code"),
      type: formData.get("type"),
      value: Number(formData.get("value")),
      min_order_amount: Number(formData.get("min_order_amount")),
      max_discount_amount: formData.get("max_discount_amount") ? Number(formData.get("max_discount_amount")) : null,
      usage_limit: formData.get("usage_limit") ? Number(formData.get("usage_limit")) : null,
      valid_until: formData.get("valid_until") || null,
      is_active: formData.get("is_active") === "on",
    };

    try {
      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon.id}` : "/api/admin/coupons";
      const method = editingCoupon ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingCoupon ? "Coupon updated" : "Coupon created");
        setIsModalOpen(false);
        setEditingCoupon(null);
        fetchCoupons();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error("Failed to save coupon: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[var(--font-heading)]">Coupons</h1>
        <button 
          onClick={() => { setEditingCoupon(null); setIsModalOpen(true); }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-accent)]" />
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-[var(--color-text-muted)]">
                  No coupons found. Create your first discount code!
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[var(--color-surface-muted)]">
                  <td className="p-4 font-mono font-bold text-[var(--color-accent)]">{coupon.code}</td>
                  <td className="p-4">{coupon.type === "percentage" ? `${coupon.value}%` : formatPrice(coupon.value)}</td>
                  <td className="p-4">{formatPrice(coupon.min_order_amount)}</td>
                  <td className="p-4">{coupon.used_count}/{coupon.usage_limit || "∞"}</td>
                  <td className="p-4 text-[var(--color-text-muted)]">
                    {coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-4">
                    <span className={`status-pill ${coupon.is_active ? "status-confirmed" : "status-cancelled"}`}>
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => { setEditingCoupon(coupon); setIsModalOpen(true); }}
                        className="btn btn-ghost btn-sm btn-icon"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon.id)}
                        className="btn btn-ghost btn-sm btn-icon text-[var(--color-error)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-xl font-bold font-[var(--font-heading)]">
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-text-muted)] hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Coupon Code</label>
                <input 
                  type="text" 
                  name="code" 
                  defaultValue={editingCoupon?.code} 
                  className="input uppercase" 
                  placeholder="E.G. SAVE20" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Type</label>
                  <select name="type" defaultValue={editingCoupon?.type || "percentage"} className="input">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Value</label>
                  <input 
                    type="number" 
                    name="value" 
                    defaultValue={editingCoupon?.value} 
                    className="input" 
                    placeholder="20" 
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Min Order (₹)</label>
                  <input 
                    type="number" 
                    name="min_order_amount" 
                    defaultValue={editingCoupon?.min_order_amount || 0} 
                    className="input" 
                    placeholder="500" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Usage Limit</label>
                  <input 
                    type="number" 
                    name="usage_limit" 
                    defaultValue={editingCoupon?.usage_limit} 
                    className="input" 
                    placeholder="100" 
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Valid Until</label>
                <input 
                  type="date" 
                  name="valid_until" 
                  defaultValue={editingCoupon?.valid_until ? new Date(editingCoupon.valid_until).toISOString().split('T')[0] : ""} 
                  className="input" 
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_active" 
                  defaultChecked={editingCoupon ? editingCoupon.is_active : true} 
                  className="accent-[var(--color-accent)]" 
                />
                Active and redeemable
              </label>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="btn btn-primary flex-1"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
