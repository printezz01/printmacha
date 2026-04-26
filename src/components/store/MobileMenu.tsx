"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="btn-icon btn-ghost lg:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        id="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* Slide-in Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-[var(--color-surface-elevated)] z-50 lg:hidden shadow-xl animate-slide-right">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <span className="text-base font-bold font-label tracking-tight">printmacha</span>
              <button onClick={() => setIsOpen(false)} className="btn-icon btn-ghost" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-0.5" role="navigation" aria-label="Mobile navigation">
              <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Menu</p>
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  id={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <p className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">Categories</p>
              {[
                { href: "/category/3d-textured-posters", label: "3D Wall Art" },
                { href: "/category/f1-collection", label: "F1 Collection" },
                { href: "/category/desk-accessories", label: "Desk Objects" },
                { href: "/shop?sort=best-selling", label: "Bestsellers" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-[var(--color-border)] space-y-2">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                My Account
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                Wishlist
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
