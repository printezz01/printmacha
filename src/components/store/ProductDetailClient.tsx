"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  Share2,
  ChevronRight,
  Check,
} from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { sampleProducts, sampleReviews } from "@/lib/sample-data";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { toast } from "sonner";
import type { Product } from "@/types/database";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem: addToCart, isInCart } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.size || "A3");

  const hasDiscount = product.sale_price && product.sale_price < product.base_price;
  const displayPrice = product.sale_price || product.base_price;
  const discount = hasDiscount ? getDiscountPercentage(product.base_price, product.sale_price!) : 0;
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    router.push("/checkout");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="container-wide py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-8 flex-wrap">
        <Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-[var(--color-text-primary)] transition-colors">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/category/${product.category.slug}`} className="hover:text-[var(--color-text-primary)] transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text-primary)] font-medium">{product.title}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-[var(--color-surface-muted)] product-image-placeholder relative overflow-hidden">
            {product.featured_image ? (
              <img
                src={product.featured_image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-[var(--color-warm-300)] flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-[var(--color-warm-500)]" />
                  </div>
                  <p className="text-sm text-[var(--color-warm-500)]">{product.title}</p>
                </div>
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new_arrival && <span className="badge badge-new">New</span>}
              {product.is_best_seller && <span className="badge badge-bestseller">Bestseller</span>}
              {hasDiscount && <span className="badge badge-sale">-{discount}%</span>}
            </div>
          </div>
          {/* Thumbnail row */}
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                className={`w-20 h-20 rounded-xl bg-[var(--color-surface-muted)] border-2 ${i === 1 ? "border-[var(--color-accent)]" : "border-transparent"} overflow-hidden product-image-placeholder transition-all hover:border-[var(--color-accent)]`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[var(--color-warm-400)]" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:pt-4">
          {/* Category */}
          {product.category && (
            <Link
              href={`/category/${product.category.slug}`}
              className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl font-bold font-[var(--font-heading)] mt-2 mb-3">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= 4 ? "star-filled fill-current" : "star-empty"}`} />
              ))}
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">4.5 (8 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className={`text-3xl font-bold ${hasDiscount ? "text-[var(--color-error)]" : "text-[var(--color-text-primary)]"}`}>
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-[var(--color-text-muted)] line-through">
                  {formatPrice(product.base_price)}
                </span>
                <span className="badge badge-sale">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
            {product.short_description}
          </p>

          {/* Product details */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-[var(--color-surface-muted)]">
            {product.material && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Material</p>
                <p className="text-sm font-medium">{product.material}</p>
              </div>
            )}
            {product.size && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Size</p>
                <p className="text-sm font-medium">{product.size}</p>
              </div>
            )}
            {product.finish && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Finish</p>
                <p className="text-sm font-medium">{product.finish}</p>
              </div>
            )}
            {product.color && (
              <div>
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Color</p>
                <p className="text-sm font-medium">{product.color}</p>
              </div>
            )}
          </div>

          {/* Size selector */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Size</label>
              <div className="flex gap-2">
                {["A4", "A3", "A2"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      size === selectedSize
                        ? "border-[var(--color-accent)] bg-[var(--color-brand-orange-50)] text-[var(--color-accent)]"
                        : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-primary)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-[var(--color-border)] rounded-lg">
              <button
                className="p-3 hover:bg-[var(--color-surface-muted)] transition-colors rounded-l-lg"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 py-3 text-sm font-medium min-w-[48px] text-center">{quantity}</span>
              <button
                className="p-3 hover:bg-[var(--color-surface-muted)] transition-colors rounded-r-lg"
                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                disabled={quantity >= product.stock_quantity}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-[var(--color-success)] font-medium">
              ✓ In stock ({product.stock_quantity} available)
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-3">
            <button
              className={`flex-1 btn btn-lg ${inCart ? "btn-outline" : "btn-primary"}`}
              id="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              {inCart ? (
                <>
                  <Check className="w-5 h-5" />
                  Added — Add More
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
            <button
              className={`btn btn-outline btn-lg btn-icon ${inWishlist ? "text-red-500 border-red-200 bg-red-50" : ""}`}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              id="wishlist-btn"
              onClick={() => {
                toggleWishlist(product);
                toast(inWishlist ? "Removed from wishlist" : "Added to wishlist ♥");
              }}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
            </button>
            <button
              className="btn btn-outline btn-lg btn-icon hidden sm:flex"
              aria-label="Share"
              id="share-btn"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Buy Now */}
          <button
            className="w-full btn btn-secondary btn-lg mb-8"
            id="buy-now-btn"
            onClick={handleBuyNow}
          >
            Buy Now
          </button>

          {/* Trust cues */}
          <div className="space-y-3 p-4 rounded-xl border border-[var(--color-border)]">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
              <span>
                <strong>Delivery:</strong> {product.delivery_estimate || "5-7 business days"} · Free above ₹999
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
              <span>
                <strong>Returns:</strong> {product.return_eligible ? "7-day easy returns" : "Non-returnable"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
              <span>
                <strong>Payment:</strong> Secure UPI, cards, netbanking & COD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Description */}
      <div className="mt-16 border-t border-[var(--color-border)] pt-12">
        <div className="max-w-3xl">
          <h2 className="text-xl font-bold font-[var(--font-heading)] mb-4">About this product</h2>
          <div className="prose prose-warm text-[var(--color-text-secondary)] leading-relaxed">
            <p>{product.long_description}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-[var(--color-border)] pt-12">
        <h2 className="text-xl font-bold font-[var(--font-heading)] mb-6">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {sampleReviews.slice(0, 4).map((review) => (
            <div key={review.id} className="p-5 rounded-xl border border-[var(--color-border)]">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "star-filled fill-current" : "star-empty"}`} />
                ))}
              </div>
              <p className="font-medium text-sm mb-1">{review.title}</p>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">&ldquo;{review.body}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-[10px] font-bold">
                  {review.reviewer_name.charAt(0)}
                </div>
                <span className="text-xs font-medium">{review.reviewer_name}</span>
                <span className="text-xs text-[var(--color-text-muted)]">• Verified Buyer</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-[var(--color-border)] pt-12">
          <h2 className="text-xl font-bold font-[var(--font-heading)] mb-6">You may also like</h2>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} listName="Related Products" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
