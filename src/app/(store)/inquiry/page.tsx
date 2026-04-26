"use client";

import { useState } from "react";
import { Upload, Send } from "lucide-react";
import { toast } from "sonner";

export default function InquiryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Inquiry submitted! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
    setIsSubmitting(false);
  };

  return (
    <div className="container-wide py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-heading mb-3">Bulk & Custom Orders</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Have a custom project in mind? Need products in bulk? Let&apos;s make it happen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name <span className="text-[var(--color-error)]">*</span></label>
                <input type="text" name="name" className="input" placeholder="Your name" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email <span className="text-[var(--color-error)]">*</span></label>
                <input type="email" name="email" className="input" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone</label>
              <input type="tel" name="phone" className="input" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Inquiry Type <span className="text-[var(--color-error)]">*</span></label>
              <select name="inquiry_type" className="input" required>
                <option>Custom Product</option>
                <option>Bulk Order</option>
                <option>Corporate Gifting</option>
                <option>Collaboration</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tell us about your project <span className="text-[var(--color-error)]">*</span></label>
              <textarea name="message" className="input" rows={6} placeholder="Describe what you're looking for — quantity, design ideas, timeline, budget range..." required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Reference Files (optional)</label>
              <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center hover:border-[var(--color-accent)] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--color-text-muted)]" />
                <p className="text-sm text-[var(--color-text-secondary)]">Drag & drop files or click to upload</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" id="submit-inquiry-btn" disabled={isSubmitting}>
              <Send className="w-4 h-4" />
              {isSubmitting ? "Sending..." : "Send Inquiry"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-[var(--color-text-muted)] mt-6">
          We typically respond within 24 hours. For urgent requests,{" "}
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">
            chat with us on WhatsApp
          </a>.
        </p>
      </div>
    </div>
  );
}
