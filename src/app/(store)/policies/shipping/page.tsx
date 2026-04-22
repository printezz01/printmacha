import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <div className="container-wide py-12 md:py-20">
      <div className="max-w-3xl mx-auto prose prose-warm">
        <h1 className="text-4xl font-bold font-[var(--font-heading)]">Shipping Policy</h1>
        <p className="text-lg text-[var(--color-text-secondary)]">Last updated: April 2026</p>

        <h2 className="text-xl font-bold mt-8 mb-3">Shipping Coverage</h2>
        <p className="text-[var(--color-text-secondary)]">We currently ship to all serviceable pin codes across India. International shipping is not available at this time.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">Shipping Charges</h2>
        <ul className="space-y-2 text-[var(--color-text-secondary)]">
          <li>• <strong>Free shipping</strong> on all orders above ₹999</li>
          <li>• Flat rate of <strong>₹99</strong> for orders below ₹999</li>
          <li>• COD fee of <strong>₹49</strong> applies for cash on delivery orders</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">Delivery Timelines</h2>
        <ul className="space-y-2 text-[var(--color-text-secondary)]">
          <li>• <strong>Posters:</strong> 5-7 business days</li>
          <li>• <strong>3D Printed Products:</strong> 7-10 business days</li>
          <li>• <strong>Desk Accessories:</strong> 5-7 business days</li>
          <li>• <strong>Custom Orders:</strong> 10-15 business days</li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-3">Order Tracking</h2>
        <p className="text-[var(--color-text-secondary)]">Once shipped, you will receive tracking details via email and SMS. You can also track your order through your account dashboard.</p>

        <h2 className="text-xl font-bold mt-8 mb-3">Packaging</h2>
        <p className="text-[var(--color-text-secondary)]">All products are carefully packaged to ensure safe delivery. We use protective packaging materials suitable for each product type.</p>
      </div>
    </div>
  );
}
