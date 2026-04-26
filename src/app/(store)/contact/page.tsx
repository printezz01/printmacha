"use client";

import { useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending — in production this would hit an API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent! We'll get back to you within 24 hours.");
    (e.target as HTMLFormElement).reset();
    setIsSubmitting(false);
  };

  return (
    <div className="container-wide py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-heading mb-3">Get in Touch</h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            Have a question, feedback, or just want to say hi? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, title: "Email", detail: "hello@printmacha.com", sub: "We reply within 24 hours" },
            { icon: Phone, title: "Phone", detail: "+91 98765 43210", sub: "Mon-Sat, 10am-7pm IST" },
            { icon: MessageCircle, title: "WhatsApp", detail: "Chat with us", sub: "Quick responses", link: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}` },
          ].map(({ icon: Icon, title, detail, sub, link }) => (
            <div key={title} className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-center">
              <Icon className="w-6 h-6 text-[var(--color-accent)] mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{title}</h3>
              {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-accent)] hover:underline">{detail}</a>
              ) : (
                <p className="text-sm">{detail}</p>
              )}
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <h2 className="text-xl font-bold font-heading mb-6">Send us a message</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name</label>
                <input type="text" name="name" className="input" placeholder="Your name" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <input type="email" name="email" className="input" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Subject</label>
              <select name="subject" className="input">
                <option>General Inquiry</option>
                <option>Order Issue</option>
                <option>Product Question</option>
                <option>Bulk/Custom Order</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Message</label>
              <textarea name="message" className="input" rows={5} placeholder="Tell us what's on your mind..." required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
