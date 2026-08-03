import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/lib/data/products';
import ProductDetail from './ProductDetail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return { title: 'Product not found' };
  return {
    title: `${p.name} — ${p.subtitle} | Inclex`,
    description: p.description,
    openGraph: { title: p.name, description: p.description, images: [p.images[0]] },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const product = PRODUCTS.find((x) => x.slug === slug);
  if (!product) notFound();
  const related = PRODUCTS.filter((x) => x.id !== product.id).slice(0, 3);
  return <ProductDetail product={product} related={related} />;
}
