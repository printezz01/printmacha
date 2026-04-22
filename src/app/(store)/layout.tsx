import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  ChevronDown,
} from "lucide-react";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import CartBadge from "@/components/store/CartBadge";
import MobileMenu from "@/components/store/MobileMenu";

// Placeholder header component for the store
function StoreHeader() {
  return (
    <>
      {/* Promo Strip */}
      <div className="promo-strip">
        <p>
          🚀 Launch Offer: Use code <strong>LAUNCH20</strong> for 20% off
          orders above ₹1,500 | Free shipping above ₹999
        </p>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)]">
        <div className="container-wide">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Mobile Menu Toggle */}
            <MobileMenu />

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <span className="text-white font-bold text-sm font-[var(--font-heading)]">
                  P
                </span>
              </div>
              <span className="text-lg md:text-xl font-bold font-[var(--font-heading)] tracking-tight text-[var(--color-text-primary)]">
                Print<span className="text-[var(--color-accent)]">Macha</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/shop"
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Shop All
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  Categories <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="absolute top-full left-0 pt-2 hidden group-hover:block">
                  <div className="bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border)] shadow-lg py-2 min-w-[200px] animate-slide-down">
                    <Link
                      href="/category/posters"
                      className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      Posters
                    </Link>
                    <Link
                      href="/category/3d-textured-posters"
                      className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      3D Textured Posters
                    </Link>
                    <Link
                      href="/category/f1-collection"
                      className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      F1 Collection
                    </Link>
                    <Link
                      href="/category/desk-accessories"
                      className="block px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      Desk Accessories
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                href="/category/f1-collection"
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                F1 Collection
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <Link
                href="/search"
                className="btn-icon btn-ghost"
                aria-label="Search"
                id="header-search"
              >
                <Search className="w-5 h-5" />
              </Link>
              <Link
                href="/wishlist"
                className="btn-icon btn-ghost hidden sm:flex"
                aria-label="Wishlist"
                id="header-wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <Link
                href="/account"
                className="btn-icon btn-ghost hidden sm:flex"
                aria-label="Account"
                id="header-account"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/cart"
                className="btn-icon btn-ghost relative"
                aria-label="Cart"
                id="header-cart"
              >
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

// Store Footer
function StoreFooter() {
  return (
    <footer className="bg-[var(--color-text-primary)] text-[var(--color-warm-300)]">
      {/* Newsletter */}
      <div className="border-b border-[var(--color-warm-800)]">
        <div className="container-wide py-12 md:py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-heading)]">
              Stay in the loop
            </h3>
            <p className="text-[var(--color-warm-400)] mb-6 text-sm">
              Get early access to new drops, exclusive offers, and behind-the-scenes content.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-[var(--color-warm-900)] border border-[var(--color-warm-700)] rounded-lg text-white text-sm placeholder:text-[var(--color-warm-500)] focus:outline-none focus:border-[var(--color-accent)]"
              />
              <button className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-bold text-white font-[var(--font-heading)]">
                Print<span className="text-[var(--color-accent)]">Macha</span>
              </span>
            </div>
            <p className="text-sm text-[var(--color-warm-400)] mb-4 max-w-[250px]">
              Premium 3D printed art and decor, handcrafted with precision for modern Indian spaces.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-sm hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/posters" className="text-sm hover:text-white transition-colors">
                  Posters
                </Link>
              </li>
              <li>
                <Link href="/category/3d-textured-posters" className="text-sm hover:text-white transition-colors">
                  3D Textured Posters
                </Link>
              </li>
              <li>
                <Link href="/category/f1-collection" className="text-sm hover:text-white transition-colors">
                  F1 Collection
                </Link>
              </li>
              <li>
                <Link href="/category/desk-accessories" className="text-sm hover:text-white transition-colors">
                  Desk Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="text-sm hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-sm hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/inquiry" className="text-sm hover:text-white transition-colors">
                  Bulk & Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/policies/privacy" className="text-sm hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-sm hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--color-warm-800)]">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-warm-500)]">
            © {new Date().getFullYear()} PrintMacha. All rights reserved. Made with ♥ in India.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--color-warm-500)]">We accept:</span>
            <div className="flex items-center gap-2 text-xs text-[var(--color-warm-400)]">
              <span className="px-2 py-1 bg-[var(--color-warm-800)] rounded">UPI</span>
              <span className="px-2 py-1 bg-[var(--color-warm-800)] rounded">Cards</span>
              <span className="px-2 py-1 bg-[var(--color-warm-800)] rounded">NetBanking</span>
              <span className="px-2 py-1 bg-[var(--color-warm-800)] rounded">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <WhatsAppButton />
    </div>
  );
}
