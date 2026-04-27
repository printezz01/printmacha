"use client";

import { useState } from "react";
import { XCircle, RotateCcw, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const RETURN_REASONS = [
  "Product damaged during delivery",
  "Wrong item received",
  "Product quality not as expected",
  "Item does not match description",
  "Product defective/not working",
  "Other",
];

const CANCEL_REASONS = [
  "Changed my mind",
  "Found a better price",
  "Ordered by mistake",
  "Delivery time too long",
  "Other",
];

export default function OrderActions({
  orderNumber,
  canCancel,
  returnEligible,
  status,
}: {
  orderNumber: string;
  canCancel: boolean;
  returnEligible: boolean;
  status: string;
}) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderNumber,
          type: "cancel",
          reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message || "Order cancelled");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderNumber,
          type: "return",
          reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(data.message || "Return request submitted");
      setShowReturnModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canCancel && !returnEligible) return null;

  return (
    <>
      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {canCancel && (
          <button
            onClick={() => { setShowCancelModal(true); setReason(""); }}
            className="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50"
          >
            <XCircle className="w-4 h-4" /> Cancel Order
          </button>
        )}
        {returnEligible && (
          <button
            onClick={() => { setShowReturnModal(true); setReason(""); }}
            className="btn btn-outline btn-sm"
          >
            <RotateCcw className="w-4 h-4" /> Return / Exchange
          </button>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold">Cancel Order</h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <label className="text-sm font-medium block mb-2">Reason for cancellation</label>
            <select
              className="input mb-4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn btn-ghost flex-1"
                disabled={isLoading}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                className="btn flex-1 bg-red-600 text-white hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="w-6 h-6 text-[var(--color-accent)]" />
              <h3 className="text-lg font-bold">Return / Exchange</h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              You have <strong>7 days</strong> from delivery to request a return.
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Our team will review your request and reach out within 24 hours.
            </p>
            <label className="text-sm font-medium block mb-2">Reason for return</label>
            <select
              className="input mb-4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReturnModal(false)}
                className="btn btn-ghost flex-1"
                disabled={isLoading}
              >
                Close
              </button>
              <button
                onClick={handleReturn}
                className="btn btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
