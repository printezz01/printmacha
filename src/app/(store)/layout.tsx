"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X, Command } from "lucide-react";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import CartBadge from "@/components/store/CartBadge";
import MobileMenu from "@/components/store/MobileMenu";

// ─── Animated Promo Ticker ────────────────────────────────────────────────────
const PROMO_ITEMS = [
  { text: "Free shipping on orders above ", highlight: "₹999", href: "/shop" },
  { text: "New drop: ", highlight: "F1 Sculpture Series", href: "/category/f1-collection", suffix: " — limited run" },
  { text: "Made-to-order in ", highlight: "Bengaluru", suffix: " · ships in 5–7 days", href: null },
  { text: "7-day easy returns · ", highlight: "handcrafted, not mass-made", href: "/policies/returns" },
  { text: "Code ", highlight: "LAUNCH20", suffix: " for 20% off ₹1,500+", href: "/shop" },
];

function PromoItem({ item }: { item: typeof PROMO_ITEMS[0] }) {
  const content = (
    <span className="flex items-center gap-1">
      {item.text && <span>{item.text}</span>}
      <strong className="font-bold">{item.highlight}</strong>
      {item.suffix && <span>{item.suffix}</span>}
    </span>
  );

  if (item.href) {
    return (
      <a href={item.href} className="flex items-center px-8">
        {content}
        <span className="mx-8 opacity-30">•</span>
      </a>
    );
  }
  return (
    <span className="flex items-center px-8">
      {content}
      <span className="mx-8 opacity-30">•</span>
    </span>
  );
}

function PromoStrip() {
  return (
    <div className="promo-strip" role="marquee" aria-label="Promotions">
      <div className="animate-marquee">
        {/* Double for seamless loop */}
        {PROMO_ITEMS.map((item, i) => <PromoItem key={i} item={item} />)}
        {PROMO_ITEMS.map((item, i) => <PromoItem key={`dup-${i}`} item={item} />)}
      </div>
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function StoreHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <PromoStrip />
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm"
            : "bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]"
        }`}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 md:h-[68px]">
            {/* Mobile menu */}
            <MobileMenu />

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" id="site-logo">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-text-primary)] flex items-center justify-center">
                <span className="text-white font-bold text-sm font-[var(--font-label)]">P</span>
              </div>
              <span className="text-lg md:text-xl font-bold font-[var(--font-label)] tracking-tight text-[var(--color-text-primary)]">
                printmacha
              </span>
            </Link>

            {/* Desktop Nav — matches reference: Home · Shop · About Us · Contact Us */}
            <nav className="hidden lg:flex items-center gap-8" role="navigation" aria-label="Main navigation">
              <Link href="/" className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors" id="nav-home">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" id="nav-shop">
                Shop
              </Link>
              <Link href="/about" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" id="nav-about">
                About Us
              </Link>
              <Link href="/contact" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors" id="nav-contact">
                Contact Us
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-1.5">
              {/* Search — styled like reference with ⌘K hint */}
              <Link
                href="/search"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] transition-all text-sm"
                id="header-search"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline text-[var(--color-text-muted)]">Search the studio</span>
                <span className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--color-surface-muted)] text-[10px] font-mono text-[var(--color-text-muted)]">
                  <Command className="w-2.5 h-2.5" />K
                </span>
              </Link>
              <Link href="/search" className="md:hidden btn-icon btn-ghost" aria-label="Search" id="header-search-mobile">
                <Search className="w-5 h-5" />
              </Link>
              <Link href="/wishlist" className="btn-icon btn-ghost hidden sm:flex" aria-label="Wishlist" id="header-wishlist">
                <Heart className="w-5 h-5" />
              </Link>
              <Link href="/account" className="btn-icon btn-ghost hidden sm:flex" aria-label="Account" id="header-account">
                <User className="w-5 h-5" />
              </Link>
              <Link href="/cart" className="btn-icon btn-ghost relative" aria-label="Cart" id="header-cart">
                <ShoppingBag className="w-5 h-5" />
                <CartBadge />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <p className="text-[var(--color-warm-300)] text-sm">
        ✓ You&apos;re in! Watch your inbox for 10% off.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm" id={id}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 px-4 py-3 bg-[var(--color-warm-900)] border border-[var(--color-warm-700)] rounded-lg text-white text-sm placeholder:text-[var(--color-warm-500)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
      />
      <button type="submit" className="btn btn-primary whitespace-nowrap">
        Subscribe
      </button>
    </form>
  );
}

function StoreFooter() {
  return (
    <footer className="bg-[var(--color-text-primary)] text-[var(--color-warm-300)]">
      {/* Newsletter strip */}
      <div className="border-b border-[var(--color-warm-800)]">
        <div className="container-wide py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white font-[var(--font-heading)] mb-1">
                Join the studio
              </h3>
              <p className="text-[var(--color-warm-400)] text-sm">
                Subscribe for early access + 10% off
              </p>
            </div>
            <NewsletterForm id="footer-newsletter" />
          </div>
        </div>
      </div>

      {/* Main 5-column grid — matches reference */}
      <div className="container-wide py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Brand + social */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                <span className="text-white font-bold text-sm font-[var(--font-label)]">P</span>
              </div>
              <span className="text-base font-bold text-white font-[var(--font-label)]">printmacha</span>
            </div>
            <p className="text-sm text-[var(--color-warm-400)] mb-6 max-w-[200px] leading-relaxed">
              Sculptural 3D-printed wall art and desk decor. Designed and made in India.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              <a href="https://instagram.com/printmacha" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-[var(--color-warm-700)] flex items-center justify-center hover:border-white hover:text-white transition-colors text-[var(--color-warm-400)]">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://twitter.com/printmacha" target="_blank" rel="noopener noreferrer" aria-label="X"
                className="w-8 h-8 rounded-full border border-[var(--color-warm-700)] flex items-center justify-center hover:border-white hover:text-white transition-colors text-[var(--color-warm-400)]">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://threads.net/@printmacha" target="_blank" rel="noopener noreferrer" aria-label="Threads"
                className="w-8 h-8 rounded-full border border-[var(--color-warm-700)] flex items-center justify-center hover:border-white hover:text-white transition-colors text-[var(--color-warm-400)]">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.267-.883-2.241-.887h-.061c-.729 0-1.775.2-2.596 1.084l-1.526-1.384c1.269-1.386 2.743-1.78 4.132-1.78h.084c3.445.016 5.478 2.173 5.571 5.963zm-4.905 2.399c.038 0 .077 0 .116-.002 1.015-.057 1.783-.425 2.282-1.094.441-.588.67-1.39.681-2.376a11.089 11.089 0 0 0-2.986-.138c-.921.055-1.669.309-2.154.716-.435.372-.627.845-.594 1.406.062 1.177 1.054 1.488 2.655 1.488z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[10px] font-semibold text-white mb-4 uppercase tracking-[0.14em] font-[var(--font-label)]">Shop</h4>
            <ul className="space-y-2.5">
              <li><Link href="/category/3d-textured-posters" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">3D Wall Art</Link></li>
              <li><Link href="/category/f1-collection" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">F1 Collection</Link></li>
              <li><Link href="/category/posters" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">Posters</Link></li>
              <li><Link href="/category/desk-accessories" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">Desk Decor</Link></li>
              <li><Link href="/shop?sort=newest" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[10px] font-semibold text-white mb-4 uppercase tracking-[0.14em] font-[var(--font-label)]">Help</h4>
            <ul className="space-y-2.5">
              <li><Link href="/contact" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/policies/shipping" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="/policies/returns" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/account/orders" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">Track order</Link></li>
              <li><Link href="/faq" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h4 className="text-[10px] font-semibold text-white mb-4 uppercase tracking-[0.14em] font-[var(--font-label)]">Studio</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">Our story</Link></li>
              <li><Link href="/about#process" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">The print process</Link></li>
              <li><Link href="/about#sustainability" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="/contact" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-semibold text-white mb-4 uppercase tracking-[0.14em] font-[var(--font-label)]">Contact</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:hello@printmacha.in" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">
                  hello@printmacha.in
                </a>
              </li>
              <li>
                <a href="tel:+919812345678" className="text-sm text-[var(--color-warm-400)] hover:text-white transition-colors">
                  +91 98 1234 5678
                </a>
              </li>
              <li>
                <span className="text-sm text-[var(--color-warm-500)]">Bengaluru, India</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar — Privacy · Terms · Cookies */}
      <div className="border-t border-[var(--color-warm-800)]">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-warm-500)]">
            © {new Date().getFullYear()} PrintMacha. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-[var(--color-warm-500)]">
            <Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Terms</Link>
            <div className="flex items-center gap-1.5 ml-2">
              <span className="px-2 py-1 bg-[var(--color-warm-800)] rounded text-[10px]">UPI</span>
              <span className="px-2 py-1 bg-[var(--color-warm-800)] rounded text-[10px]">Cards</span>
              <span className="px-2 py-1 bg-[var(--color-warm-800)] rounded text-[10px]">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <WhatsAppButton />
    </div>
  );
}
