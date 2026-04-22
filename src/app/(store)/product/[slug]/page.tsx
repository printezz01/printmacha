import Link from "next/link";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import ProductDetailClient from "@/components/store/ProductDetailClient";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.seo_title || product?.title || "Product",
    description: product?.seo_description || product?.short_description || "",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="container-wide py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/shop" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const relatedProducts = product.category_id ? await getRelatedProducts(product.category_id, product.id) : [];

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
