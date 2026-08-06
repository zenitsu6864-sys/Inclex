import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "INCLEX | Keyfume – Premium Refillable Perfume Keychain",

  description:
    "Keyfume by INCLEX is a premium refillable perfume keychain that lets you carry your favorite fragrance wherever you go. Compact, lightweight, leak-proof, and easy to refill, it attaches to your keys, backpack, handbag, or everyday carry for freshness anytime.",

  keywords: [
    "INCLEX",
    "Keyfume",
    "Refillable perfume keychain",
    "Perfume keychain",
    "Portable perfume bottle",
    "Travel perfume container",
    "Pocket perfume",
    "Leak-proof perfume keychain",
    "Luxury everyday carry",
    "Compact fragrance holder",
    "Perfume accessory",
    "Premium keychain",
    "Made in India",
  ],

  openGraph: {
    title: "INCLEX | Keyfume – Carry Your Signature Fragrance Anywhere",

    description:
      "Discover Keyfume by INCLEX – a premium refillable perfume keychain designed for portability, elegance, and everyday convenience.",

    type: "website",

    siteName: "INCLEX",
  },

  twitter: {
    card: "summary_large_image",

    title: "INCLEX | Keyfume – Premium Refillable Perfume Keychain",

    description:
      "Carry your favorite fragrance everywhere with Keyfume by INCLEX. Refillable, compact, leak-proof, and designed for everyday luxury.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#F8F7F4",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground selection:bg-[#C9A227]/25 selection:text-[#111111]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
