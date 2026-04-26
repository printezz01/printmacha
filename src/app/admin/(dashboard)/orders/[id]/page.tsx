import type { Metadata } from "next";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Order Details | Admin" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Order {id}</h1>
          <p className="text-sm text-[var(--color-text-muted)]">April 15, 2026</p>
        </div>
        <div className="flex gap-3">
          <select className="input w-auto text-sm">
            <option>Update Status</option>
            <option>Confirmed</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
          <button className="btn btn-primary btn-sm">Save</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-4">Items</h2>
            <div className="space-y-3">
              {[
                { title: "Midnight Bloom Abstract", sku: "PM-POST-001", qty: 1, price: 449 },
                { title: "Geodesic Pen Holder", sku: "PM-DESK-001", qty: 2, price: 549 },
              ].map((item) => (
                <div key={item.sku} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.sku} × {item.qty}</p>
                  </div>
                  <p className="font-bold text-sm">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-border)] mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(1547)}</span></div>
              <div className="flex justify-between text-sm"><span>Shipping</span><span className="text-[var(--color-success)]">Free</span></div>
              <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>{formatPrice(1547)}</span></div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-4">Shipping & Tracking</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tracking Number</label>
                <input type="text" className="input" placeholder="Enter tracking number" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tracking URL</label>
                <input type="url" className="input" placeholder="https://tracking.example.com/..." />
              </div>
            </div>
            <button className="btn btn-outline btn-sm mt-4">Update Tracking</button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-3">Customer</h2>
            <p className="text-sm font-medium">Ananya S.</p>
            <p className="text-sm text-[var(--color-text-muted)]">ananya@example.com</p>
            <p className="text-sm text-[var(--color-text-muted)]">+91 98765 43210</p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-3">Payment</h2>
            <p className="text-sm"><span className="text-[var(--color-text-muted)]">Method:</span> Prepaid (UPI)</p>
            <p className="text-sm"><span className="text-[var(--color-text-muted)]">Status:</span> <span className="status-pill status-paid">Paid</span></p>
            <p className="text-sm mt-2"><span className="text-[var(--color-text-muted)]">Amount:</span> <strong>{formatPrice(1547)}</strong></p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-3">Shipping Address</h2>
            <p className="text-sm">Ananya S.</p>
            <p className="text-sm text-[var(--color-text-secondary)]">123 Example Street, Koramangala</p>
            <p className="text-sm text-[var(--color-text-secondary)]">Bangalore, Karnataka 560034</p>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="font-bold mb-3">Admin Notes</h2>
            <textarea className="input" rows={3} placeholder="Internal notes about this order..." />
          </div>
        </div>
      </div>
    </div>
  );
}
