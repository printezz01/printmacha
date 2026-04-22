"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import type { Product } from "@/types/database";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  listName?: string;
}

export default function ProductCard({ product, listName }: ProductCardProps) {
  const { addItem: addToCart, isInCart } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();

  const hasDiscount = product.sale_price && product.sale_price < product.base_price;
  const displayPrice = product.sale_price || product.base_price;
  const discount = hasDiscount
    ? getDiscountPercentage(product.base_price, product.sale_price!)
    : 0;
  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      toast.info(`${product.title} is already in your cart`);
      return;
    }
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (inWishlist) {
      toast("Removed from wishlist");
    } else {
      toast.success("Added to wishlist ♥");
    }
  };

  return (
    <div className="group relative" id={`product-card-${product.slug}`}>
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--color-surface-muted)] mb-3">
          {/* Product Image */}
          {product.featured_image ? (
            <img
              src={product.featured_image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full product-image-placeholder transition-transform duration-500 group-hover:scale-105">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-[var(--color-warm-300)] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-[var(--color-warm-500)]" />
                </div>
                <span className="text-xs text-[var(--color-warm-500)]">{product.title}</span>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new_arrival && (
              <span className="badge badge-new">New</span>
            )}
            {product.is_best_seller && (
              <span className="badge badge-bestseller">Bestseller</span>
            )}
            {hasDiscount && (
              <span className="badge badge-sale">-{discount}%</span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              className={`w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all ${
                inWishlist
                  ? "bg-red-50 text-red-500"
                  : "bg-white/90 hover:bg-white text-[var(--color-text-secondary)]"
              }`}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              onClick={handleToggleWishlist}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Quick Add */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              className={`w-full btn btn-sm ${inCart ? "btn-outline" : "btn-secondary"}`}
              onClick={handleAddToCart}
            >
              {inCart ? (
                <>
                  <Check className="w-4 h-4" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          {/* Category */}
          {product.category && (
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              {product.category.name}
            </p>
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${star <= 4 ? "star-filled fill-current" : "star-empty"}`}
              />
            ))}
            <span className="text-[11px] text-[var(--color-text-muted)] ml-0.5">
              (4.5)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className={hasDiscount ? "price-sale text-sm" : "price-current text-sm"}>
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="price-original text-xs">
                {formatPrice(product.base_price)}
              </span>
            )}
          </div>

          {/* Material tag */}
          {product.material && (
            <p className="text-[11px] text-[var(--color-text-muted)]">
              {product.material}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
