"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { toast } from "sonner";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (data.data) {
          const p = data.data;
          setInitialData({
            title: p.title || "",
            slug: p.slug || "",
            short_description: p.short_description || "",
            long_description: p.long_description || "",
            category_id: p.category_id || "",
            tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
            sku: p.sku || "",
            base_price: p.base_price?.toString() || "",
            sale_price: p.sale_price?.toString() || "",
            stock_quantity: p.stock_quantity?.toString() || "0",
            featured_image: p.featured_image || null,
            is_featured: p.is_featured || false,
            is_new_arrival: p.is_new_arrival || false,
            is_best_seller: p.is_best_seller || false,
            is_published: p.is_published || false,
            return_eligible: p.return_eligible !== false,
            material: p.material || "",
            size: p.size || "",
            color: p.color || "",
            finish: p.finish || "",
            delivery_estimate: p.delivery_estimate || "5-7 business days",
            seo_title: p.seo_title || "",
            seo_description: p.seo_description || "",
          });
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-[var(--color-text-secondary)]">
          This product may have been deleted or doesn&apos;t exist in the database yet.
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          Make sure your Supabase environment variables are configured.
        </p>
      </div>
    );
  }

  return <ProductForm productId={productId} initialData={initialData} />;
}
