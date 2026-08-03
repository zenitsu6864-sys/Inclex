import { notFound } from 'next/navigation';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

const DOCS = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Effective from May 2025',
    sections: [
      { h: 'Who we are', b: 'Inclex (“we”, “us”) is a brand of premium personal accessories based in Bengaluru, India. We collect only the information required to fulfil your order and improve your shopping experience.' },
      { h: 'What we collect', b: 'Contact details (name, email, phone), shipping address, payment method (via our PCI-compliant partner), order history, and anonymous website analytics.' },
      { h: 'How we use it', b: 'To process orders, respond to inquiries, deliver personalized products, and — with your consent — send occasional updates about new pieces.' },
      { h: 'Third parties', b: 'We share data only with logistics partners, payment processors and analytics providers strictly for fulfilment. We never sell your data.' },
      { h: 'Your rights', b: 'You can request access, correction or deletion of your data anytime by writing to privacy@inclex.com.' },
      { h: 'Cookies', b: 'We use essential cookies to run the site and optional analytics cookies to improve it. You can disable non-essential cookies in your browser settings.' },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    updated: 'Effective from May 2025',
    sections: [
      { h: 'Acceptance', b: 'By accessing inclex.com you agree to these terms. If you don’t agree, please do not use the site.' },
      { h: 'Orders', b: 'Placing an order is an offer to purchase. We reserve the right to accept, decline or cancel orders (with full refund) at our discretion.' },
      { h: 'Pricing', b: 'All prices are in Indian Rupees and inclusive of applicable taxes unless stated otherwise.' },
      { h: 'Personalization', b: 'Personalized items are made-to-order and non-returnable except in cases of manufacturing defect.' },
      { h: 'Intellectual property', b: 'All content, brand marks and imagery are the property of Inclex. Reproduction requires written permission.' },
      { h: 'Liability', b: 'Our liability is limited to the value of the order in question. We are not liable for indirect or consequential loss.' },
      { h: 'Jurisdiction', b: 'These terms are governed by the laws of India, with exclusive jurisdiction in Bengaluru courts.' },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    updated: 'Effective from May 2025',
    sections: [
      { h: 'Where we ship', b: 'Across India, to all serviceable pincodes. International shipping (retail) is coming soon.' },
      { h: 'Dispatch time', b: 'Standard pieces ship within 1–2 business days. Personalized/engraved pieces ship within 3–5 business days.' },
      { h: 'Delivery time', b: 'Metros: 2–4 business days. Rest of India: 4–7 business days.' },
      { h: 'Charges', b: 'Free shipping on orders above ₹499. Below ₹499 a flat ₹49 is applied at checkout.' },
      { h: 'Cash on Delivery', b: 'COD is available for orders below ₹5,000 across serviceable pincodes.' },
      { h: 'Tracking', b: 'A live tracking link is sent to your email and SMS within 24 hours of dispatch.' },
    ],
  },
  returns: {
    title: 'Returns & Refunds',
    updated: 'Effective from May 2025',
    sections: [
      { h: 'Eligibility', b: 'Non-personalized items can be returned within 14 days of delivery in original, unused condition with tags and packaging intact.' },
      { h: 'Personalized items', b: 'Engraved and personalized pieces are final sale, except for manufacturing defects.' },
      { h: 'How to initiate', b: 'Email support@inclex.com with your order number and reason. Our team will schedule a pickup at no cost within India.' },
      { h: 'Refund timing', b: 'Refunds are processed within 5 business days of receiving the returned item, to the original payment method.' },
      { h: 'Damaged in transit', b: 'If your package arrives damaged, share a photo within 48 hours of delivery. We’ll replace it at no charge.' },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) return { title: 'Not found' };
  return { title: `${doc.title} | Inclex`, description: doc.title };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />
      <section className="container-editorial py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow flex items-center gap-3"><span className="hairline" />Legal</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">{doc.title}</h1>
          <p className="mt-3 text-sm text-neutral-500">{doc.updated}</p>

          <div className="mt-12 space-y-10">
            {doc.sections.map((s) => (
              <div key={s.h}>
                <h2 className="font-serif text-2xl">{s.h}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-700">{s.b}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-sm border border-black/10 bg-white p-6 text-sm text-neutral-600">
            Questions about this policy? Write to <a className="underline" href="mailto:support@inclex.com">support@inclex.com</a>.
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
