import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";

async function getProduct(slug) {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();

  return data.product;
}

async function getProducts() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/products`, {
    cache: "no-store",
  });

  const data = await res.json();

  return data.products || [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: `${product.name} — ${product.subtitle} | Inclex`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images?.[0]],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const products = await getProducts();

  const related = products
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <ProductDetail
      product={product}
      related={related}
    />
  );
}