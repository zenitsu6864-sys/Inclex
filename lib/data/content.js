export const DEFAULT_HOMEPAGE = {
  heroEyebrow: "Premium Keychains",
  heroHeading: "Carry More Than Keys.",
  heroSubtitle: "Crafted to last. Designed to be remembered.",
  heroPrimaryCta: "Explore Collection",
  heroPrimaryHref: "/shop",
  heroVideo: "/uploads/videos/1785866102505-lyjjzyshem.mp4",
  heroPoster: "/uploads/images/1785871863078-9jsnapnecpt.jpeg",
  experienceEyebrow: "Experience Inclex",
  experienceHeading: "Crafted With Purpose",
  experienceSubtitle:
    "Every detail is designed with intention. Watch how Inclex comes to life.",
  experienceVideo: "/uploads/videos/1785865816732-m28nmwtuk1i.mp4",
  upcomingEyebrow: "Upcoming Product",

  upcomingHeading: "INCLEX Pocket Perfume",

  upcomingSubtitle:
    "Two Vibes. One Luxury. Already prefilled. Ready when you are.",

  upcomingButtonText: "Notify Me",

  upcomingButtonLink: "/coming-soon",

  upcomingImage: "/uploads/images/1786062230741-ua3no33jlb9.jpeg",

  upcomingEnabled: true,
  newsletterHeading: "Stay Updated",
  newsletterSubtitle: "New arrivals, exclusive offers and more.",
  announcementBar: "FREE SHIPPING on all orders above ₹299",
  couponBanner: "Use code: INCLEX10 for 10% OFF on your first order",
};

export async function fetchHomepage() {
  try {
    const res = await fetch("/api/content/homepage", { cache: "no-store" });
    const data = await res.json();
    if (data?.homepage) return { ...DEFAULT_HOMEPAGE, ...data.homepage };
  } catch {}
  return DEFAULT_HOMEPAGE;
}

export async function fetchSettings() {
  try {
    const res = await fetch("/api/settings", { cache: "no-store" });
    const data = await res.json();
    if (data?.settings) return data.settings;
  } catch {}
  return null;
}
