"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Star } from "lucide-react";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { sampleProducts } from "@/lib/sample-data";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart, isInCart } = useCart();

  const handleMoveToCart = (wishlistItem: typeof items[0]) => {
    // Find the full product from sample data to add to cart
    const fullProduct = sampleProducts.find((p) => p.id === wishlistItem.id);
    if (fullProduct) {
      addToCart(fullProduct);
      removeItem(wishlistItem.id);
      toast.success(`${wishlistItem.title} moved to cart!`);
    }
  };

  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="text-3xl font-bold font-[var(--font-heading)] mb-2">My Wishlist</h1>
      <p className="text-[var(--color-text-secondary)] mb-8">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>

      {items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const hasDiscount = item.sale_price && item.sale_price < item.base_price;
            const displayPrice = item.sale_price || item.base_price;
            const discount = hasDiscount ? getDiscountPercentage(item.base_price, item.sale_price!) : 0;
            const alreadyInCart = isInCart(item.id);

            return (
              <div key={item.id} className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden">
                {/* Image */}
                <Link href={`/product/${item.slug}`} className="block">
                  <div className="aspect-[3/4] bg-[var(--color-surface-muted)] relative overflow-hidden">
                    {item.featured_image ? (
                      <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-[var(--color-warm-400)]" />
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {item.is_new_arrival && <span className="badge badge-new">New</span>}
                      {item.is_best_seller && <span className="badge badge-bestseller">Bestseller</span>}
                      {hasDiscount && <span className="badge badge-sale">-{discount}%</span>}
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  {item.category_name && (
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)] mb-1">
                      {item.category_name}
                    </p>
                  )}
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-sm font-semibold hover:text-[var(--color-accent)] transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className={hasDiscount ? "price-sale text-sm" : "price-current text-sm"}>
                      {formatPrice(displayPrice)}
                    </span>
                    {hasDiscount && (
                      <span className="price-original text-xs">{formatPrice(item.base_price)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`flex-1 btn btn-sm ${alreadyInCart ? "btn-outline" : "btn-primary"}`}
                      onClick={() => handleMoveToCart(item)}
                      disabled={alreadyInCart}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {alreadyInCart ? "In Cart" : "Move to Cart"}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm btn-icon text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
                      aria-label="Remove from wishlist"
                      onClick={() => {
                        removeItem(item.id);
                        toast("Removed from wishlist");
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
            <Heart className="w-8 h-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Save items you love for later by tapping the heart icon.
          </p>
          <Link href="/shop" className="btn btn-primary">Browse Products</Link>
        </div>
      )}
    </div>
  );
}
