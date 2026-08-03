import Link from 'next/link';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />
      <section className="container-editorial grid place-items-center py-32 text-center">
        <div className="eyebrow inline-flex items-center gap-3 justify-center"><span className="hairline" />404</div>
        <h1 className="mt-4 font-serif text-6xl md:text-7xl">Lost in the leather.</h1>
        <p className="mt-4 max-w-md text-neutral-600">The page you’re looking for doesn’t exist or has moved. Let’s take you back to something beautiful.</p>
        <div className="mt-10 flex gap-3">
          <Link href="/" className="btn-dark">Back to Home</Link>
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-sm border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold">Shop Collection</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
