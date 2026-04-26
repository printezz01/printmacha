import { Star, CheckCircle, XCircle } from "lucide-react";
import { sampleReviews } from "@/lib/sample-data";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reviews | Admin" };

export default function AdminReviewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Reviews</h1>
      <div className="space-y-4">
        {sampleReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-[var(--color-border)] p-5 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "star-filled fill-current" : "star-empty"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">{review.reviewer_name}</span>
                <span className="status-pill status-confirmed text-[10px]">Approved</span>
              </div>
              <p className="text-sm font-semibold">{review.title}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">{review.body}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-2">Product: {review.product_title}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button className="btn btn-ghost btn-sm btn-icon text-[var(--color-success)]" title="Approve">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button className="btn btn-ghost btn-sm btn-icon text-[var(--color-error)]" title="Reject">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
