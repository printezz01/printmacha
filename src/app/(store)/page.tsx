import Link from "next/link";
import { ArrowRight, Star, Truck, RotateCcw } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import NewsletterForm from "@/components/store/NewsletterForm";
import { getBestSellers, getNewArrivals, getCategories } from "@/lib/data";
import { sampleReviews } from "@/lib/sample-data";

export default async function HomePage() {
  const bestSellers = await getBestSellers();
  const newArrivals = await getNewArrivals();
  const categories = await getCategories();

  return (
    <>
      {/* ================================================================
          HERO — pixel-match to Lovable reference
          "EDITION 01 — BENGALURU STUDIO" label, editorial serif headline,
          real product photo right panel, trust badges
      ================================================================ */}
      <section className="relative bg-[var(--color-surface)] overflow-hidden">
        <div className="container-wide py-16 md:py-20 lg:py-0 w-full">
          <div className="grid lg:grid-cols-[1fr_480px] gap-10 lg:gap-0 items-center min-h-[calc(100vh-120px)]">

            {/* Left column */}
            <div className="animate-fade-in-up lg:py-20">
              {/* Edition label — spaced caps, exactly like reference */}
              <p className="label-overline mb-6 tracking-[0.15em]">
                Edition 01 — Bengaluru Studio
              </p>

              <h1 className="text-[3.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-bold font-heading text-[var(--color-text-primary)] leading-[1.05] tracking-tight mb-7">
                Art that stands{" "}
                <span className="text-[var(--color-accent)]">out.</span>
                <br />
                Literally.
              </h1>

              <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-[360px] mb-10 leading-relaxed">
                Sculptural 3D-printed wall art and desk objects.
                Quietly precise. Made slow. Made in India.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Link
                  href="/shop"
                  id="hero-shop-cta"
                  className="btn btn-secondary btn-lg group rounded-full"
                >
                  Shop the collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/inquiry"
                  id="hero-customize-cta"
                  className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <span className="text-[var(--color-accent)]">✦</span>
                  Customize your wall
                </Link>
              </div>

              {/* Trust badges — horizontal row like reference */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Free shipping over ₹999
                </span>
                <span className="text-[var(--color-warm-300)]">•</span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  7-day returns
                </span>
                <span className="text-[var(--color-warm-300)]">•</span>
                <span>Made-to-order</span>
              </div>
            </div>

            {/* Right column — real product photo, edge-to-edge like reference */}
            <div className="hidden lg:block relative h-full min-h-[600px]">
              <img
                src="/images/hero-wall-art.png"
                alt="3D printed terracotta wall sculpture"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* "MAKE IT YOURS" floating overlay — bottom left */}
              <div className="absolute bottom-24 left-6 bg-[var(--color-text-primary)] text-white rounded-2xl px-5 py-3.5 shadow-xl z-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-warm-400)] mb-0.5">
                  Make it yours
                </p>
                <p className="text-sm font-medium">Custom size · color · finish</p>
              </div>
              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between z-10">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] border border-[var(--color-border)] px-3 py-1 rounded-full">
                  Edition of 200
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                  Topography No. 04
                </span>
              </div>
            </div>

            {/* Mobile hero image */}
            <div className="lg:hidden rounded-2xl overflow-hidden aspect-[4/5] relative">
              <img
                src="/images/hero-wall-art.png"
                alt="3D printed terracotta wall sculpture"
                className="w-full h-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          "FIND YOUR PIECE." — Bento grid with REAL photos
          Matches reference: 1 large left + 2 stacked right, with photos
      ================================================================ */}
      <section id="shop" className="section-gap bg-[var(--color-surface)]">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
              Find your piece.
            </h2>
            <Link
              href="/shop"
              id="categories-view-all"
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 h-auto md:h-[520px]">
            {/* Large left — 3D Wall Art */}
            <Link
              href="/category/3d-textured-posters"
              id="category-bento-3d-wall-art"
              className="group relative rounded-2xl overflow-hidden min-h-[320px] md:h-full"
            >
              <img
                src="/images/category-3d-wall-art.png"
                alt="3D Wall Art Collection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <div>
                  <p className="label-overline text-white/70 mb-1">24 pieces</p>
                  <h3 className="text-2xl font-bold font-heading text-white">
                    3D Wall Art
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Right column — 2 stacked */}
            <div className="flex flex-col gap-3 h-full">
              {/* F1 Collection */}
              <Link
                href="/category/f1-collection"
                id="category-bento-f1"
                className="group relative rounded-2xl overflow-hidden flex-1 min-h-[200px]"
              >
                <img
                  src="/images/category-f1-collection.png"
                  alt="F1 Collection"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <p className="label-overline text-white/70 mb-1">12 pieces</p>
                    <h3 className="text-xl font-bold font-heading text-white">
                      F1 Collection
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Desk Lamps */}
              <Link
                href="/category/desk-accessories"
                id="category-bento-desk"
                className="group relative rounded-2xl overflow-hidden flex-1 min-h-[200px]"
              >
                <img
                  src="/images/category-desk-lamps.png"
                  alt="Desk Lamps"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <p className="label-overline text-white/70 mb-1">8 pieces</p>
                    <h3 className="text-xl font-bold font-heading text-[var(--color-surface)]">
                      Desk Lamps
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          "QUIETLY LOVED." — Best sellers
      ================================================================ */}
      <section className="section-gap bg-[var(--color-surface-muted)]">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight italic">
              Quietly loved.
            </h2>
            <Link
              href="/shop?sort=best-selling"
              id="bestsellers-view-all"
              className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="product-grid">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} listName="Best Sellers" />
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link href="/shop?sort=best-selling" className="btn btn-outline rounded-full">
              View all bestsellers
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          NEW ARRIVALS
      ================================================================ */}
      {newArrivals.length > 0 && (
        <section className="section-gap bg-[var(--color-surface)]">
          <div className="container-wide">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="label-overline mb-2">Just In</p>
                <h2 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
                  New arrivals
                </h2>
              </div>
              <Link
                href="/shop?sort=newest"
                id="new-arrivals-view-all"
                className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="product-grid">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} listName="New Arrivals" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          "DEPTH, BECAUSE FLAT IS FORGETTABLE."
          Left: headline + description + stats | Right: numbered steps
      ================================================================ */}
      <section id="about" className="section-gap bg-[var(--color-surface)]">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading leading-tight mb-6">
                Depth, because
                <br />
                flat is{" "}
                <span className="text-[var(--color-accent)]">forgettable.</span>
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-sm mb-12">
                Designed in-house, printed slow on industrial machines.
                Tactile, sculptural decor that turns walls into conversations.
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--color-border)] pt-10">
                {[
                  { value: "0.1mm", label: "Print Precision" },
                  { value: "100%", label: "Made in India" },
                  { value: "48hr", label: "Print to Ship" },
                  { value: "PLA", label: "Biodegradable" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl md:text-4xl font-bold font-heading text-[var(--color-text-primary)] mb-1">
                      {value}
                    </p>
                    <p className="label-overline">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: numbered steps */}
            <div className="mt-4 lg:mt-0">
              <div className="craft-step">
                <span className="craft-number">01</span>
                <div>
                  <h3 className="text-xl font-bold font-heading mb-2">Layer by layer</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    Each piece prints over 12–48 hours. No moulds, no shortcuts.
                  </p>
                </div>
              </div>
              <div className="craft-step">
                <span className="craft-number">02</span>
                <div>
                  <h3 className="text-xl font-bold font-heading mb-2">Texture you can feel</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    True 3D relief — light moves across every ridge.
                  </p>
                </div>
              </div>
              <div className="craft-step">
                <span className="craft-number">03</span>
                <div>
                  <h3 className="text-xl font-bold font-heading mb-2">Plant-based PLA</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    Biodegradable cornstarch filament. Premium feel, gentle footprint.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          REVIEWS
      ================================================================ */}
      <section className="section-gap bg-[var(--color-surface-muted)]">
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-5 h-5 star-filled fill-current" />
              ))}
            </div>
            <p className="text-3xl font-bold font-heading mb-1">4.9 / 5</p>
            <p className="text-sm text-[var(--color-text-muted)]">from 2,400+ verified buyers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {sampleReviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-[var(--color-surface-elevated)] rounded-2xl p-6 border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "star-filled fill-current" : "star-empty"}`} />
                  ))}
                </div>
                <p className="text-sm font-semibold mb-2">{review.title}</p>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5">
                  &ldquo;{review.body}&rdquo;
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-warm-200)] flex items-center justify-center text-[var(--color-warm-700)] text-xs font-bold">
                    {review.reviewer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.reviewer_name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          NEWSLETTER CTA
      ================================================================ */}
      <section className="py-16 bg-[var(--color-text-primary)]">
        <div className="container-wide text-center">
          <p className="label-overline text-[var(--color-warm-500)] mb-4">Studio Journal</p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-3">
            Get 10% off your first order
          </h2>
          <p className="text-[var(--color-warm-400)] text-sm mb-8 max-w-sm mx-auto">
            Behind-the-scenes process, new drops, and exclusive offers.
          </p>
          <NewsletterForm id="homepage-newsletter" />
        </div>
      </section>
    </>
  );
}
