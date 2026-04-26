"use client";

import { useState, useMemo, useEffect } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import type { Product } from "@/types/database";

const popularSearches = ["F1 art", "3D textured", "desk organizer", "poster", "wall art", "pen holder"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(async (res) => {
        if (res.data && res.data.length > 0) {
          setAllProducts(res.data.filter((p: any) => p.is_published));
        } else {
          const { sampleProducts } = await import("@/lib/sample-data");
          setAllProducts(sampleProducts);
        }
      })
      .catch(async () => {
        const { sampleProducts } = await import("@/lib/sample-data");
        setAllProducts(sampleProducts);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return allProducts;
    const q = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
        p.category?.name.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q)
    );
  }, [query, allProducts]);

  return (
    <div className="container-wide py-8 md:py-12">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold font-heading text-center mb-6">
          Search Products
        </h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="search"
            placeholder="Search for posters, wall art, F1 art, desk accessories..."
            className="input pl-12 py-4 text-base"
            autoFocus
            id="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Popular searches */}
      <div className="text-center mb-8">
        <p className="text-sm text-[var(--color-text-muted)] mb-3">Popular searches</p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                query.toLowerCase() === term.toLowerCase()
                  ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-brand-orange-50)]"
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">
              {query.trim()
                ? `${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""} for "${query}"`
                : "All Products"}
            </h2>
            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} listName="Search Results" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg font-semibold mb-2">No products found</p>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  Try a different search term or browse our categories.
                </p>
                <button
                  onClick={() => setQuery("")}
                  className="btn btn-outline"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
