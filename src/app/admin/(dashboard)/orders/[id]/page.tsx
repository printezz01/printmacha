"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Save,
  Copy,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_META: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-yellow-600 bg-yellow-50", label: "Pending" },
  confirmed: { icon: CheckCircle, color: "text-blue-600 bg-blue-50", label: "Confirmed" },
  processing: { icon: Package, color: "text-orange-600 bg-orange-50", label: "Processing" },
  shipped: { icon: Truck, color: "text-purple-600 bg-purple-50", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Cancelled" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function statusLabel(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setOrder(data);
          setSelectedStatus(data.status);
          setTrackingNumber(data.tracking_number || "");
          setTrackingUrl(data.tracking_url || "");
          setAdminNotes(data.notes || "");
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          tracking_number: trackingNumber,
          tracking_url: trackingUrl,
          notes: adminNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setOrder((prev: any) => ({
        ...prev,
        status: selectedStatus,
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        notes: adminNotes,
      }));

      toast.success("Order updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickStatus = async (newStatus: string) => {
    setSelectedStatus(newStatus);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setOrder((prev: any) => ({ ...prev, status: newStatus }));
      toast.success(`Status → ${STATUS_META[newStatus]?.label || newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
          <p className="font-medium">Order not found</p>
          <Link href="/admin/orders" className="btn btn-outline mt-4">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = STATUS_FLOW.indexOf(order.status);
  const nextStatus = currentStatusIndex >= 0 && currentStatusIndex < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentStatusIndex + 1]
    : null;

  const address = order.shipping_address || {};

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <h1 className="text-2xl font-bold font-heading flex items-center gap-3">
            {order.order_number}
            <span className={`status-pill status-${order.status}`}>
              {STATUS_META[order.status]?.label || order.status}
            </span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      {/* Status Progress Bar */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
        <h2 className="font-bold mb-4">Order Progress</h2>
        <div className="flex items-center justify-between mb-6">
          {STATUS_FLOW.map((status, i) => {
            const meta = STATUS_META[status];
            const Icon = meta.icon;
            const isActive = STATUS_FLOW.indexOf(order.status) >= i;
            const isCurrent = order.status === status;
            return (
              <div key={status} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isCurrent ? meta.color + " ring-2 ring-offset-2 ring-current" : isActive ? meta.color : "bg-gray-100 text-gray-400"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`text-xs font-medium ${isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}>
                  {meta.label}
                </p>
                {i < STATUS_FLOW.length - 1 && (
                  <div className={`hidden md:block absolute h-0.5 w-full ${isActive ? "bg-[var(--color-accent)]" : "bg-gray-200"}`} style={{ display: "none" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--color-border)]">
          {nextStatus && order.status !== "cancelled" && (
            <button
              onClick={() => handleQuickStatus(nextStatus)}
              disabled={isSaving}
              className="btn btn-primary btn-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Mark as {STATUS_META[nextStatus]?.label}
            </button>
          )}
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <button
              onClick={() => handleQuickStatus("cancelled")}
              disabled={isSaving}
              className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-4">Items ({order.order_items?.length || 0})</h2>
            <div className="space-y-3">
              {(order.order_items || []).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 py-2">
                  {item.product_image && (
                    <img src={item.product_image} alt="" className="w-14 h-14 rounded-xl object-cover border border-[var(--color-border)]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product_title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {item.product_sku ? `${item.product_sku} · ` : ""}Qty: {item.quantity}
                      {item.selected_size ? ` · Size: ${item.selected_size}` : ""}
                    </p>
                  </div>
                  <p className="font-bold text-sm">{formatPrice(item.total_price || item.unit_price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-border)] mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</span>
                  <span>−{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Shipping</span>
                <span>{order.shipping_amount === 0 ? <span className="text-green-600">Free</span> : formatPrice(order.shipping_amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-[var(--color-border)]">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-4">Shipping & Tracking</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tracking Number</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. AWB123456789"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tracking URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="e.g. https://shiprocket.in/tracking/..."
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                />
              </div>
            </div>
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] mt-3 hover:underline"
              >
                Open tracking page <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-4">Admin Notes</h2>
            <textarea
              className="input"
              rows={3}
              placeholder="Internal notes about this order (not visible to customer)..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-3">Customer</h2>
            <p className="text-sm font-medium">{address.full_name || "Guest"}</p>
            {order.guest_email && (
              <p className="text-sm text-[var(--color-text-muted)]">{order.guest_email}</p>
            )}
            {(order.guest_phone || address.phone) && (
              <p className="text-sm text-[var(--color-text-muted)]">{order.guest_phone || address.phone}</p>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-3">Payment</h2>
            <div className="space-y-1.5 text-sm">
              <p>
                <span className="text-[var(--color-text-muted)]">Method: </span>
                {order.payment_method === "prepaid" ? "Prepaid (Online)" : "Cash on Delivery"}
              </p>
              <p>
                <span className="text-[var(--color-text-muted)]">Status: </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${order.payment_method === 'prepaid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {order.payment_method === 'prepaid' ? 'Paid' : 'COD'}
                </span>
              </p>
              <p className="mt-2">
                <span className="text-[var(--color-text-muted)]">Amount: </span>
                <strong>{formatPrice(order.total)}</strong>
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-3">Shipping Address</h2>
            <div className="text-sm space-y-0.5">
              <p className="font-medium">{address.full_name}</p>
              {address.address_line_1 && <p className="text-[var(--color-text-secondary)]">{address.address_line_1}</p>}
              {address.address_line_2 && <p className="text-[var(--color-text-secondary)]">{address.address_line_2}</p>}
              <p className="text-[var(--color-text-secondary)]">
                {[address.city, address.state, address.postal_code].filter(Boolean).join(", ")}
              </p>
              {address.phone && <p className="text-[var(--color-text-muted)] mt-1">📞 {address.phone}</p>}
            </div>
          </div>

          {/* Manual Status Override */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-3">Manual Status</h2>
            <select
              className="input mb-3"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-4 mt-8">
        <div className="bg-[var(--color-text-primary)] text-white rounded-2xl p-4 flex items-center justify-between shadow-2xl">
          <p className="text-sm">
            Save all changes (tracking, notes, status)
          </p>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
