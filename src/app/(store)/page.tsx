import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { getBestSellers, getNewArrivals, getCategories } from "@/lib/data";
import { sampleReviews } from "@/lib/sample-data";

// ─── Category grid data (editorial photo-style cards) ────────────────────────
const CATEGORY_VISUALS: Record<string, { bg: string; textColor: string }> = {
  "3d-textured-posters": { bg: "bg-[#E8DDD0]", textColor: "text-[var(--color-text-primary)]" },
  "f1-collection":       { bg: "bg-[var(--color-text-primary)]", textColor: "text-white" },
  "desk-accessories":    { bg: "bg-[#EDE6D6]", textColor: "text-[var(--color-text-primary)]" },
  "posters":             { bg: "bg-[#E0D5C5]", textColor: "text-[var(--color-text-primary)]" },
};

const DEFAULT_VISUAL = { bg: "bg-[var(--color-warm-200)]", textColor: "text-[var(--color-text-primary)]" };

export default async function HomePage() {
  const bestSellers  = await getBestSellers();
  const newArrivals  = await getNewArrivals();
  const categories   = await getCategories();

  return (
    <>
      {/* =====================================================================
          HERO — "Art that stands out. Literally."
          Matches reference: large serif, terracotta accent word, split layout
      ===================================================================== */}
      <section className="relative min-h-[88vh] flex items-center bg-[var(--color-surface)] overflow-hidden">
        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
             style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

        <div className="container-wide py-20 md:py-28 lg:py-32 w-full">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-20 items-center">

            {/* Left: headline + CTA */}
            <div className="max-w-2xl animate-fade-in-up">
              <p className="label-overline mb-5">Edition 01 — Bengaluru Studio</p>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-bold font-[var(--font-heading)] text-[var(--color-text-primary)] leading-[1.05] tracking-tight mb-6">
                Art that<br />
                stands{" "}
                <em className="not-italic text-[var(--color-accent)]">out.</em>
                <br />
                <span className="text-[var(--color-warm-600)]">Literally.</span>
              </h1>

              <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-md mb-10 leading-relaxed">
                Sculptural 3D-printed wall art and desk objects.
                Quietly precise. Made slow. Made in India.
              </p>

              <div className="flex flex-wrap items-center gap-4">
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

              {/* Make it yours scroll hint */}
              <div className="mt-14 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold font-[var(--font-label)] shrink-0">
                  ✦
                </div>
                <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
                  Make it yours
                </div>
              </div>
            </div>

            {/* Right: hero product image */}
            <div className="hidden lg:block w-[420px] h-[580px] relative rounded-3xl overflow-hidden shadow-2xl bg-[#EAE0D0]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-48 h-64 mx-auto rounded-2xl bg-gradient-to-br from-[var(--color-warm-300)] to-[var(--color-warm-400)] flex items-center justify-center shadow-xl">
                    <span className="text-6xl">🎨</span>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-widest text-[var(--color-warm-600)]">
                    3D Textured Wall Art
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          CATEGORIES — "Find Your Piece"
          Dynamic grid from Supabase, photo-card style matching reference
      ===================================================================== */}
      <section id="shop" className="section-gap bg-[var(--color-surface)]">
        <div className="container-wide">
          <div className="mb-10">
            <p className="label-overline mb-2">Collections</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)]">
                Find Your Piece
              </h2>
              <Link
                href="/shop"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                id="categories-view-all"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {categories.slice(0, 4).map((category) => {
                const visual = CATEGORY_VISUALS[category.slug] || DEFAULT_VISUAL;
                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group block"
                    id={`category-${category.slug}`}
                  >
                    <div className={`${visual.bg} rounded-2xl aspect-[3/4] p-5 flex flex-col justify-between transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 overflow-hidden relative`}>
                      {/* Category image placeholder — will show product image if available */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-[var(--color-text-primary)] transition-opacity" />

                      <p className={`label-overline ${visual.textColor} opacity-60`}>
                        {category.name}
                      </p>

                      <div>
                        <h3 className={`text-lg font-bold font-[var(--font-heading)] ${visual.textColor} mb-1.5 leading-tight`}>
                          {category.name}
                        </h3>
                        <div className={`flex items-center gap-1 text-sm font-medium ${visual.textColor} opacity-60 group-hover:opacity-100 group-hover:gap-2 transition-all`}>
                          Explore <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Fallback hardcoded grid */
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { name: "3D Wall Art",      slug: "3d-textured-posters", bg: "bg-[#E8DDD0]", text: "text-[var(--color-text-primary)]" },
                { name: "F1 Collection",    slug: "f1-collection",       bg: "bg-[var(--color-text-primary)]", text: "text-white" },
                { name: "Desk Objects",     slug: "desk-accessories",    bg: "bg-[#EDE6D6]", text: "text-[var(--color-text-primary)]" },
                { name: "Desk Lamps",       slug: "posters",             bg: "bg-[#E0D5C5]", text: "text-[var(--color-text-primary)]" },
              ].map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="group block" id={`category-fallback-${cat.slug}`}>
                  <div className={`${cat.bg} rounded-2xl aspect-[3/4] p-5 flex flex-col justify-between transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
                    <p className={`label-overline ${cat.text} opacity-60`}>{cat.name}</p>
                    <div>
                      <h3 className={`text-lg font-bold font-[var(--font-heading)] ${cat.text} mb-1.5`}>{cat.name}</h3>
                      <span className={`flex items-center gap-1 text-sm font-medium ${cat.text} opacity-60 group-hover:opacity-100 group-hover:gap-2 transition-all`}>
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          BEST SELLERS — "Quietly loved."
          Dynamic from Supabase, product cards with category label + pricing
      ===================================================================== */}
      <section className="section-gap bg-[var(--color-surface-muted)]">
        <div className="container-wide">
          <div className="mb-10">
            <p className="label-overline mb-2">Best Sellers</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)]">
                Quietly loved.
              </h2>
              <Link
                href="/shop?sort=best-selling"
                id="bestsellers-view-all"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
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

      {/* =====================================================================
          NEW ARRIVALS — Dynamic section
      ===================================================================== */}
      {newArrivals.length > 0 && (
        <section className="section-gap bg-[var(--color-surface)]">
          <div className="container-wide">
            <div className="mb-10">
              <p className="label-overline mb-2">Just In</p>
              <div className="flex items-end justify-between">
                <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)]">
                  New arrivals
                </h2>
                <Link
                  href="/shop?sort=newest"
                  id="new-arrivals-view-all"
                  className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="product-grid">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} listName="New Arrivals" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          OUR CRAFT — "Depth, because flat is forgettable."
          Matches reference exactly: editorial headline + numbered steps
      ===================================================================== */}
      <section id="about" className="section-gap bg-[var(--color-surface)]">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: headline */}
            <div className="lg:sticky lg:top-28">
              <p className="label-overline mb-4">Our Craft</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[var(--font-heading)] leading-tight mb-6">
                Depth, because{" "}
                <em className="not-italic">flat is{" "}</em>
                <em className="not-italic text-[var(--color-accent)]">forgettable.</em>
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
                Every piece is printed to order in our Bengaluru studio using plant-based PLA. No moulds. No mass production.
              </p>
            </div>

            {/* Right: numbered craft steps */}
            <div>
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
                    Physical depth and tactile finishes that photography can&apos;t fully capture.
                  </p>
                </div>
              </div>
              <div className="craft-step">
                <span className="craft-number">03</span>
                <div>
                  <h3 className="text-xl font-bold font-[var(--font-heading)] mb-2">Plant-based PLA</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    Made from corn starch — sustainable, compostable, and built to last.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================================
          REVIEWS — 4.9/5 · 2,400+ buyers
      ===================================================================== */}
      <section className="section-gap bg-[var(--color-surface-muted)]">
        <div className="container-wide">
          {/* Aggregate rating header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-5 h-5 star-filled fill-current" />
              ))}
            </div>
            <p className="text-3xl font-bold font-[var(--font-heading)] mb-1">4.9 / 5</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              from 2,400+ verified buyers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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

      {/* =====================================================================
          NEWSLETTER CTA — 10% off strip
      ===================================================================== */}
      <section className="py-16 bg-[var(--color-text-primary)]">
        <div className="container-wide text-center">
          <p className="label-overline text-[var(--color-warm-500)] mb-4">Studio Journal</p>
          <h2 className="text-3xl md:text-4xl font-bold font-[var(--font-heading)] text-white mb-3">
            Get 10% off your first order
          </h2>
          <p className="text-[var(--color-warm-400)] text-sm mb-8 max-w-sm mx-auto">
            Behind-the-scenes process, new drops, and exclusive offers delivered to your inbox.
          </p>
          <form
            className="flex gap-3 max-w-sm mx-auto"
            id="homepage-newsletter"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 bg-[var(--color-warm-900)] border border-[var(--color-warm-700)] rounded-lg text-white text-sm placeholder:text-[var(--color-warm-500)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
