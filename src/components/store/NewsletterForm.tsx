"use client";

import { useState } from "react";

export default function NewsletterForm({ id = "newsletter-form" }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-[var(--color-warm-300)] text-sm text-center py-3">
        ✓ You&apos;re in! Check your inbox for 10% off.
      </p>
    );
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="flex gap-3 max-w-sm mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        required
        className="flex-1 px-4 py-3 bg-[var(--color-warm-900)] border border-[var(--color-warm-700)] rounded-lg text-white text-sm placeholder:text-[var(--color-warm-500)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
      />
      <button type="submit" className="btn btn-primary whitespace-nowrap">
        Subscribe
      </button>
    </form>
  );
}
