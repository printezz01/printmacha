import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about PrintMacha products, shipping, returns, and more.",
};

const faqs = [
  { q: "What materials do you use for 3D printed products?", a: "We primarily use PLA (Polylactic Acid), a biodegradable thermoplastic derived from renewable resources like corn starch. It's eco-friendly, durable, and produces beautiful finishes. Our posters are printed on 250-300gsm museum-quality art paper." },
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 business days for most products. 3D printed and custom items may take 7-10 business days as they are made to order. We ship across India via trusted courier partners." },
  { q: "Do you offer free shipping?", a: "Yes! Shipping is free on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹99 applies." },
  { q: "What is your return policy?", a: "We offer a 7-day return policy for most products. Items must be unused, undamaged, and in their original packaging. Custom or made-to-order items are non-returnable. Contact us within 7 days of delivery to initiate a return." },
  { q: "Do you accept Cash on Delivery (COD)?", a: "Yes, we offer COD for orders across India. A nominal COD fee of ₹49 applies. We recommend prepaid payment for faster processing." },
  { q: "Can I customize a product or place a bulk order?", a: "Absolutely! We love custom projects. Please reach out to us via our Bulk & Custom Inquiry page or WhatsApp with your requirements, and we'll get back to you within 24 hours." },
  { q: "Are your products eco-friendly?", a: "Yes! PLA is biodegradable and made from renewable resources. We also minimize packaging waste by using recycled and recyclable materials wherever possible." },
  { q: "Do your products come with mounting hardware?", a: "Yes, all wall art and 3D textured panels come with mounting hardware included. Posters do not include frames." },
  { q: "How do I track my order?", a: "Once your order is shipped, you'll receive a tracking number via email/SMS. You can also track your order in your account dashboard or on our Track Order page." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, wallets, and Cash on Delivery (COD). All online payments are processed securely through Cashfree." },
];

export default function FAQPage() {
  return (
    <div className="container-wide py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-[var(--font-heading)] mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Everything you need to know about PrintMacha
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
              <summary className="flex items-center justify-between cursor-pointer p-5 font-medium list-none">
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className="w-5 h-5 shrink-0 text-[var(--color-text-muted)] group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
