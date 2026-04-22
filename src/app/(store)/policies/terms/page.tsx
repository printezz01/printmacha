import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="container-wide py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold font-[var(--font-heading)] mb-2">Terms & Conditions</h1>
        <p className="text-lg text-[var(--color-text-secondary)] mb-8">Last updated: April 2026</p>
        <div className="space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">General</h2>
            <p>By accessing and using the PrintMacha website (printmacha.com), you agree to be bound by these terms and conditions. If you do not agree, please do not use our website.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Products</h2>
            <p>We strive to display accurate product colors and details. Due to monitor variations, actual colors may differ slightly. Product images are for illustration purposes.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Pricing & Payment</h2>
            <p>All prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to modify prices without prior notice. Orders are charged at the price displayed at the time of purchase.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Intellectual Property</h2>
            <p>All content on this website, including designs, text, images, and logos, is the property of PrintMacha and protected by intellectual property laws.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Limitation of Liability</h2>
            <p>PrintMacha shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
