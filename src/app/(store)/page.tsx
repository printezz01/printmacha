import Link from "next/link";
import {
  ArrowRight,
  Star,
  Printer,
  Leaf,
  Package,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { getBestSellers, getNewArrivals, getCategories } from "@/lib/data";
import { sampleReviews } from "@/lib/sample-data";
import { formatPrice } from "@/lib/utils";

export default async function HomePage() {
  const bestSellers = await getBestSellers();
  const newArrivals = await getNewArrivals();
  const categories = await getCategories();

  return (
    <>
      {/* ====== HERO SECTION ====== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-warm-100)] via-[var(--color-surface)] to-[var(--color-brand-orange-50)]">
        <div className="container-wide py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-brand-orange-100)] rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
                <span className="text-xs font-semibold text-[var(--color-brand-orange-700)] uppercase tracking-wider">
                  Now Shipping Across India
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[var(--font-heading)] text-[var(--color-text-primary)] leading-[1.1] mb-6">
                Art That Stands Out.{" "}
                <span className="text-[var(--color-accent)]">Literally.</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-lg mb-8 leading-relaxed">
                Premium 3D printed wall art, textured posters & desk accessories
                — handcrafted with precision for modern Indian spaces.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="btn btn-primary btn-lg group">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/category/f1-collection" className="btn btn-outline btn-lg">
                  Explore F1 Art
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Truck className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>Free shipping ₹999+</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Shield className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>Secure payments</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <RotateCcw className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>7-day returns</span>
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[var(--color-warm-200)] to-[var(--color-warm-300)] flex items-center justify-center shadow-lg">
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-xl bg-white/60 flex items-center justify-center">
                        <span className="text-3xl">🎨</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-warm-700)]">3D Wall Art</p>
                    </div>
                  </div>
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--color-brand-orange-100)] to-[var(--color-brand-orange-200)] flex items-center justify-center shadow-lg">
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-xl bg-white/60 flex items-center justify-center">
                        <span className="text-3xl">🏎️</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-brand-orange-700)]">F1 Collection</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--color-warm-300)] to-[var(--color-warm-400)] flex items-center justify-center shadow-lg">
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-xl bg-white/60 flex items-center justify-center">
                        <span className="text-3xl">🖼️</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-warm-800)]">Posters</p>
                    </div>
                  </div>
                  <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-[#1A1714] to-[var(--color-warm-800)] flex items-center justify-center shadow-lg">
                    <div className="text-center p-6">
                      <div className="w-20 h-20 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                        <span className="text-3xl">💡</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--color-warm-300)]">Desk Accessories</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CATEGORY CARDS ====== */}
      <section className="section-gap bg-[var(--color-surface)]">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] mb-2">
              Shop by Category
            </h2>
            <p className="text-[var(--color-text-secondary)]">Find your perfect piece</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, i) => {
              const icons = ["🖼️", "✨", "🏎️", "💡"];
              const gradients = [
                "from-[var(--color-warm-200)] to-[var(--color-warm-300)]",
                "from-[var(--color-brand-orange-50)] to-[var(--color-brand-orange-100)]",
                "from-[#1A1714] to-[var(--color-warm-800)]",
                "from-[var(--color-warm-100)] to-[var(--color-warm-200)]",
              ];
              const textColors = [
                "text-[var(--color-warm-800)]",
                "text-[var(--color-brand-orange-800)]",
                "text-white",
                "text-[var(--color-warm-800)]",
              ];

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group"
                  id={`category-card-${category.slug}`}
                >
                  <div className={`aspect-[4/5] rounded-2xl bg-gradient-to-br ${gradients[i]} p-6 flex flex-col justify-between transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
                    <div className="text-4xl md:text-5xl">{icons[i]}</div>
                    <div>
                      <h3 className={`text-base md:text-lg font-bold font-[var(--font-heading)] ${textColors[i]} mb-1`}>
                        {category.name}
                      </h3>
                      <div className={`flex items-center gap-1 text-sm ${textColors[i]} opacity-70 group-hover:opacity-100 transition-opacity`}>
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== BEST SELLERS ====== */}
      <section className="section-gap bg-[var(--color-surface-muted)]">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] mb-1">
                Best Sellers
              </h2>
              <p className="text-[var(--color-text-secondary)]">Loved by our community</p>
            </div>
            <Link
              href="/shop?sort=best-selling"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="product-grid">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} listName="Best Sellers" />
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link href="/shop?sort=best-selling" className="btn btn-outline">
              View All Best Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* ====== NEW ARRIVALS ====== */}
      <section className="section-gap bg-[var(--color-surface)]">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] mb-1">
                New Arrivals
              </h2>
              <p className="text-[var(--color-text-secondary)]">Fresh off the print bed</p>
            </div>
            <Link
              href="/shop?sort=newest"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="product-grid">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} listName="New Arrivals" />
            ))}
          </div>
        </div>
      </section>

      {/* ====== VALUE PROPS ====== */}
      <section className="section-gap bg-[var(--color-text-primary)]">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] text-white mb-2">
              Why PrintMacha?
            </h2>
            <p className="text-[var(--color-warm-400)]">
              Crafted with purpose, delivered with care
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Printer, title: "Precision Crafted", desc: "Every piece is 3D printed with meticulous attention to detail" },
              { icon: Leaf, title: "Eco-Friendly", desc: "Made with biodegradable PLA and sustainable practices" },
              { icon: Package, title: "Secure Packaging", desc: "Each product is carefully packed for safe delivery" },
              { icon: Heart, title: "Made with Love", desc: "Small batch production ensures quality over quantity" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-sm text-[var(--color-warm-400)] leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED COLLECTIONS ====== */}
      <section className="section-gap bg-[var(--color-surface)]">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] mb-2">
              Featured Collections
            </h2>
            <p className="text-[var(--color-text-secondary)]">Curated for your space</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "The F1 Wall", desc: "Complete your motorsport corner with precision circuit art", link: "/category/f1-collection", emoji: "🏎️", bg: "from-[#1A1714] to-[var(--color-warm-800)]", text: "text-white" },
              { title: "Texture Studio", desc: "3D art that transforms spaces with depth and shadow", link: "/category/3d-textured-posters", emoji: "✨", bg: "from-[var(--color-brand-orange-100)] to-[var(--color-brand-orange-200)]", text: "text-[var(--color-brand-orange-800)]" },
              { title: "Desk Setup Goals", desc: "Elevate your workspace with crafted accessories", link: "/category/desk-accessories", emoji: "💡", bg: "from-[var(--color-warm-200)] to-[var(--color-warm-300)]", text: "text-[var(--color-warm-800)]" },
            ].map((collection) => (
              <Link
                key={collection.title}
                href={collection.link}
                className="group"
              >
                <div className={`bg-gradient-to-br ${collection.bg} rounded-2xl p-8 h-64 flex flex-col justify-between transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1`}>
                  <span className="text-4xl">{collection.emoji}</span>
                  <div>
                    <h3 className={`text-xl font-bold font-[var(--font-heading)] ${collection.text} mb-1`}>
                      {collection.title}
                    </h3>
                    <p className={`text-sm ${collection.text} opacity-70 mb-3`}>
                      {collection.desc}
                    </p>
                    <span className={`text-sm font-semibold ${collection.text} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="section-gap bg-[var(--color-surface-muted)]">
        <div className="container-wide">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] mb-2">
              What Our Customers Say
            </h2>
            <p className="text-[var(--color-text-secondary)]">Real reviews from real people</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sampleReviews.slice(0, 3).map((review) => (
              <div
                key={review.id}
                className="bg-[var(--color-surface-elevated)] rounded-xl p-6 border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s <= review.rating ? "star-filled fill-current" : "star-empty"}`}
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold mb-2">{review.title}</p>
                <p className="text-sm text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                  &ldquo;{review.body}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold">
                      {review.reviewer_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.reviewer_name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">Verified Buyer</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== WhatsApp CTA ====== */}
      <section className="py-12 bg-[#25D366]/5 border-y border-[#25D366]/20">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold font-[var(--font-heading)]">
                  Need help choosing?
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Chat with us on WhatsApp for personalized recommendations
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/919876543210?text=Hi%20PrintMacha!%20I%20need%20help%20choosing%20a%20product."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary whitespace-nowrap"
            >
              Chat Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
