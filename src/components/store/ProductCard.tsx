"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
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
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist ♥");
  };

  return (
    <div className="group relative" id={`product-card-${product.slug}`}>
      <Link href={`/product/${product.slug}`} className="block">

        {/* ── Image container ─────────────────────────────────────────────── */}
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--color-warm-100)] mb-4">

          {product.featured_image ? (
            <img
              src={product.featured_image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-warm-200)] to-[var(--color-warm-300)] transition-transform duration-500 group-hover:scale-105">
              <ShoppingBag className="w-8 h-8 text-[var(--color-warm-400)]" />
            </div>
          )}

          {/* Discount badge — top-left terracotta */}
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-white text-[11px] font-semibold font-[var(--font-label)]">
                −{discount}%
              </span>
            </div>
          )}

          {/* New / bestseller badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 mt-px">
            {!hasDiscount && product.is_new_arrival && (
              <span className="badge badge-new">New</span>
            )}
            {!hasDiscount && product.is_best_seller && (
              <span className="badge badge-bestseller">Bestseller</span>
            )}
          </div>

          {/* Wishlist — top right, visible on hover */}
          <button
            onClick={handleToggleWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 ${
              inWishlist ? "bg-red-50 text-red-500" : "bg-white/90 hover:bg-white text-[var(--color-text-secondary)]"
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
          </button>

          {/* Quick Add — slides up from bottom on hover */}
          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className={`w-full btn btn-sm rounded-lg ${inCart ? "btn-outline" : "btn-secondary"}`}
            >
              {inCart ? (
                <><Check className="w-3.5 h-3.5" />In Cart</>
              ) : (
                <><ShoppingBag className="w-3.5 h-3.5" />Add to Cart</>
              )}
            </button>
          </div>
        </div>

        {/* ── Product info — matches reference card style ──────────────────── */}
        <div className="space-y-1">
          {/* Category label — spaced uppercase, reference style */}
          {product.category && (
            <p className="label-overline">
              {product.category.name}
            </p>
          )}

          {/* Title — serif, clean */}
          <h3 className="text-sm font-semibold font-[var(--font-heading)] text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Price row — sale price + MRP strikethrough + % off */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className={`text-sm font-bold ${hasDiscount ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-primary)]"}`}>
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="price-original text-xs">
                  {formatPrice(product.base_price)}
                </span>
                <span className="text-[11px] font-semibold text-[var(--color-accent)]">
                  −{discount}%
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
