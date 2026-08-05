import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

import ProductOverview from "./ProductOverview";
import ProductFeatures from "./ProductFeatures";
import ProductRefillVideo from "./ProductRefillVideo";
import ProductSpecifications from "./ProductSpecifications";
import ProductBenefits from "./ProductBenefits";
import ProductFAQ from "./ProductFAQ";
import ProductCTA from "./ProductCTA";

export const metadata = {
  title: "Product Information | INCLEX",
  description:
    "Everything you need to know about the INCLEX Keyfume refillable perfume keychain.",
};

export default function ProductInformationPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      <ProductOverview />
      <ProductFeatures />
      <ProductRefillVideo />
      <ProductSpecifications />
      <ProductBenefits />
      <ProductFAQ />
      <ProductCTA />

      <Footer />
    </main>
  );
}