import Link from "next/link";
import { ArrowRight, Star, RotateCcw, Truck } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import NewsletterForm from "@/components/store/NewsletterForm";
import { getBestSellers, getNewArrivals, getCategories } from "@/lib/data";
import { sampleReviews } from "@/lib/sample-data";

// ─── Category bento config ────────────────────────────────────────────────────
const BENTO_CATEGORIES = [
  {
    slug: "3d-textured-posters",
    name: "3D Wall Art",
    pieces: "24 pieces",
    large: true,
    bg: "#E4D5C1",
    emoji: "🏔️",
  },
  {
    slug: "f1-collection",
    name: "F1 Collection",
    pieces: "12 pieces",
    large: false,
    bg: "#2A2420",
    light: true,
    emoji: "🏎️",
  },
  {
    slug: "desk-accessories",
    name: "Desk Lamps",
    pieces: "8 pieces",
    large: false,
    bg: "#EDE0CC",
    emoji: "💡",
  },
];

export default async function HomePage() {
  const bestSellers = await getBestSellers();
  const newArrivals = await getNewArrivals();
  const categories = await getCategories();

  return (
    <>
      {/* ================================================================
          HERO — "Art that stands out. out. Literally."
          Matches reference: split layout, trust badges, product photo panel
      ================================================================ */}
      <section className="relative bg-[var(--color-surface)] min-h-[90vh] flex items-center overflow-hidden">
        <div className="container-wide py-16 md:py-24 w-full">
          <div className="grid lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center">

            {/* Left: headline */}
            <div className="animate-fade-in-up">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)] leading-[1.05] tracking-tight mb-6">
                Art that stands{" "}
                <span className="text-[var(--color-accent)]">out.</span>
                <br />
                <span className="text-[var(--color-text-primary)]">Literally.</span>
              </h1>

              <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-sm mb-10 leading-relaxed">
                Sculptural 3D-printed wall art and desk objects.
                Quietly precise. Made slow. Made in India.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
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

              {/* Trust badges row — matches reference exactly */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  Free shipping over ₹999
                </span>
                <span className="hidden sm:inline text-[var(--color-border-strong)]">•</span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  7-day returns
                </span>
                <span className="hidden sm:inline text-[var(--color-border-strong)]">•</span>
                <span>Made-to-order</span>
              </div>
            </div>

            {/* Right: product photo panel with overlays */}
            <div className="hidden lg:block relative h-[540px]">
              {/* Main photo card */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden bg-[#E8DDD0] flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <div className="w-56 h-72 mx-auto rounded-2xl bg-gradient-to-br from-[var(--color-accent)] via-[#D4652A] to-[#C05520] flex items-center justify-center shadow-2xl opacity-90">
                    <span className="text-7xl">🏔️</span>
                  </div>
                </div>

                {/* "TOPOGRAPHY NO. 04" bottom right */}
                <div className="absolute bottom-5 right-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-warm-700)]">
                    Topography No. 04
                  </p>
                </div>

                {/* "EDITION OF 200" bottom left */}
                <div className="absolute bottom-5 left-5 px-2.5 py-1 bg-[var(--color-warm-700)]/10 backdrop-blur-sm rounded-full border border-[var(--color-warm-400)]/30">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-warm-700)]">
                    Edition of 200
                  </p>
                </div>
              </div>

              {/* "MAKE IT YOURS" floating card */}
              <div className="absolute bottom-16 left-[-16px] bg-[var(--color-text-primary)] text-white rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-warm-400)] mb-0.5">
                  Make it yours
                </p>
                <p className="text-sm font-medium">Custom size · color · finish</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================
          "FIND YOUR PIECE." — Bento grid layout
          Matches reference: 1 large left + 2 stacked right
      ================================================================ */}
      <section id="shop" className="section-gap bg-[var(--color-surface)]">
        <div className="container-wide">
          {/* Header */}
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-heading)] tracking-tight">
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

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 h-auto md:h-[520px]">

            {/* Large left card */}
            <Link
              href="/category/3d-textured-posters"
              id="category-bento-3d-wall-art"
              className="group relative rounded-2xl overflow-hidden bg-[#E4D5C1] flex flex-col justify-end p-6 min-h-[320px] md:h-full"
            >
              {/* Background emoji / placeholder */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 text-[180px]">
                🏔️
              </div>
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="label-overline text-[var(--color-warm-700)] mb-1">
                    {categories.find(c => c.slug === "3d-textured-posters")?.name
                      ? `${Math.max(categories.filter(c => c.slug === "3d-textured-posters").length * 8, bestSellers.length)} pieces`
                      : "24 pieces"}
                  </p>
                  <h3 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
                    3D Wall Art
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Right: 2 stacked cards */}
            <div className="flex flex-col gap-3 h-full">

              {/* F1 Collection — dark card */}
              <Link
                href="/category/f1-collection"
                id="category-bento-f1"
                className="group relative rounded-2xl overflow-hidden bg-[#2A2420] flex flex-col justify-end p-5 flex-1 min-h-[200px]"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-15 text-[120px]">
                  🏎️
                </div>
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <p className="label-overline text-[var(--color-warm-500)] mb-1">12 pieces</p>
                    <h3 className="text-xl font-bold font-[var(--font-heading)] text-white">
                      F1 Collection
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* Desk Lamps — warm card */}
              <Link
                href="/category/desk-accessories"
                id="category-bento-desk"
                className="group relative rounded-2xl overflow-hidden bg-[#EDE0CC] flex flex-col justify-end p-5 flex-1 min-h-[200px]"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-15 text-[120px]">
                  💡
                </div>
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <p className="label-overline text-[var(--color-warm-700)] mb-1">8 pieces</p>
                    <h3 className="text-xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)]">
                      Desk Lamps
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[var(--color-text-primary)]/10 flex items-center justify-center text-[var(--color-text-primary)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          "QUIETLY LOVED." — Best sellers product grid
      ================================================================ */}
      <section className="section-gap bg-[var(--color-surface-muted)]">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-heading)] tracking-tight">
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
                <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-heading)] tracking-tight">
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
          CRAFT SECTION — "Depth, because flat is forgettable."
          With stats block: 0.1mm / 100% / 48hr / PLA
      ================================================================ */}
      <section id="about" className="section-gap bg-[var(--color-surface)]">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: headline + stats */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-[var(--font-heading)] leading-tight mb-6">
                Depth, because
                <br />
                flat is{" "}
                <span className="text-[var(--color-accent)]">forgettable.</span>
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-sm mb-12">
                Designed in-house, printed slow on industrial machines.
                Tactile, sculptural decor that turns walls into conversations.
              </p>

              {/* Stats grid — matches reference */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--color-border)] pt-10">
                {[
                  { value: "0.1mm", label: "Print Precision" },
                  { value: "100%",  label: "Made in India" },
                  { value: "48hr",  label: "Print to Ship" },
                  { value: "PLA",   label: "Biodegradable" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)] mb-1">
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
                  <h3 className="text-xl font-bold font-[var(--font-heading)] mb-2">Layer by layer</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    Each piece prints over 12–48 hours. No moulds, no shortcuts.
                  </p>
                </div>
              </div>
              <div className="craft-step">
                <span className="craft-number">02</span>
                <div>
                  <h3 className="text-xl font-bold font-[var(--font-heading)] mb-2">Texture you can feel</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    True 3D relief — light moves across every ridge.
                  </p>
                </div>
              </div>
              <div className="craft-step">
                <span className="craft-number">03</span>
                <div>
                  <h3 className="text-xl font-bold font-[var(--font-heading)] mb-2">Plant-based PLA</h3>
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
          REVIEWS — 4.9/5
      ================================================================ */}
      <section className="section-gap bg-[var(--color-surface-muted)]">
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-5 h-5 star-filled fill-current" />
              ))}
            </div>
            <p className="text-3xl font-bold font-[var(--font-heading)] mb-1">4.9 / 5</p>
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
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${s <= review.rating ? "star-filled fill-current" : "star-empty"}`}
                    />
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
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-white mb-3">
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
