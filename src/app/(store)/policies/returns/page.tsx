import type { Metadata } from "next";

export const metadata: Metadata = { title: "Return & Refund Policy" };

export default function ReturnsPage() {
  return (
    <div className="container-wide py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-[var(--font-heading)] mb-2">Return & Refund Policy</h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">Last updated: April 2026</p>

        <div className="space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Return Window</h2>
            <p>We accept returns within <strong>7 days</strong> of delivery for most products. Items must be unused, undamaged, and in their original packaging.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Non-Returnable Items</h2>
            <ul className="space-y-1"><li>• Custom or personalized orders</li><li>• Made-to-order products</li><li>• Items damaged by the customer</li><li>• Items without original packaging</li></ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Refund Process</h2>
            <p>Once we receive and inspect the returned item, we&apos;ll process your refund within 5-7 business days. Refunds are issued to the original payment method.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Damaged or Defective Items</h2>
            <p>If you receive a damaged or defective item, please contact us within 48 hours of delivery with photos. We&apos;ll arrange a free replacement or refund.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">How to Initiate a Return</h2>
            <p>Contact us at hello@printmacha.com or via WhatsApp with your order number and reason for return. Our team will guide you through the process.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
