import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container-wide py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-heading mb-2">Privacy Policy</h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">Last updated: April 2026</p>
        <div className="space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Information We Collect</h2>
            <p>We collect information you provide directly: name, email, phone number, shipping address, and payment information when you make a purchase or create an account.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">How We Use Your Information</h2>
            <ul className="space-y-1"><li>• To process and fulfill your orders</li><li>• To communicate about your orders and account</li><li>• To send promotional materials (with your consent)</li><li>• To improve our products and services</li><li>• To comply with legal obligations</li></ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. Payment processing is handled by certified third-party providers (Cashfree).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Third-Party Services</h2>
            <p>We use Supabase for data management, Cashfree for payments, and Google Analytics for website analytics. These services have their own privacy policies.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Contact Us</h2>
            <p>For privacy-related inquiries, contact us at hello@printmacha.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
