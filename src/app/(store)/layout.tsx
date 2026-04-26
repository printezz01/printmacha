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
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto" id="footer-newsletter">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 px-4 py-3 bg-[var(--color-warm-900)] border border-[var(--color-warm-700)] rounded-lg text-white text-sm placeholder:text-[var(--color-warm-500)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
      />
      <button type="submit" className="btn btn-primary whitespace-nowrap">
        Get 10% off
      </button>
    </form>
  );
}

function StoreFooter() {
  return (
    <footer className="bg-[var(--color-text-primary)] text-[var(--color-warm-300)]">
      {/* Newsletter */}
      <div className="border-b border-[var(--color-warm-800)]">
        <div className="container-wide py-14">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-heading)]">
              Join the studio
            </h3>
            <p className="text-[var(--color-warm-400)] text-sm">
              Early access to new drops + 10% off your first order.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-bold text-white font-[var(--font-label)]">printmacha</span>
            </div>
            <p className="text-sm text-[var(--color-warm-400)] mb-4 max-w-[220px] leading-relaxed">
              Sculptural 3D-printed art and decor. Quietly precise. Made slow. Made in India.
            </p>
          </div>

          {/* Studio */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-[0.12em] font-[var(--font-label)]">Studio</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">Our Process</Link></li>
              <li><Link href="/about#sustainability" className="text-sm hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="/inquiry" className="text-sm hover:text-white transition-colors">Custom Orders</Link></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-[0.12em] font-[var(--font-label)]">Shop</h4>
            <ul className="space-y-2.5">
              <li><Link href="/shop" className="text-sm hover:text-white transition-colors">All Collections</Link></li>
              <li><Link href="/shop?sort=best-selling" className="text-sm hover:text-white transition-colors">Bestsellers</Link></li>
              <li><Link href="/category/f1-collection" className="text-sm hover:text-white transition-colors">F1 Collection</Link></li>
              <li><Link href="/category/desk-accessories" className="text-sm hover:text-white transition-colors">Desk Objects</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold text-white mb-4 uppercase tracking-[0.12em] font-[var(--font-label)]">Help</h4>
            <ul className="space-y-2.5">
              <li><Link href="/policies/shipping" className="text-sm hover:text-white transition-colors">Shipping</Link></li>
              <li><Link href="/policies/returns" className="text-sm hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-warm-800)]">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-warm-500)]">
            © {new Date().getFullYear()} PrintMacha. Made with ♥ in India.
          </p>
          <div className="flex items-center gap-3 text-xs text-[var(--color-warm-500)]">
            <Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/policies/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>·</span>
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
