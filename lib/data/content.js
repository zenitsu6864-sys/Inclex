export const DEFAULT_HOMEPAGE = {
  heroEyebrow: 'Premium Keychains',
  heroHeading: 'Carry More Than Keys.',
  heroSubtitle: 'Crafted to last. Designed to be remembered.',
  heroPrimaryCta: 'Explore Collection',
  heroPrimaryHref: '/shop',
  heroSecondaryCta: 'Customize Yours',
  heroSecondaryHref: '/customize',
  heroVideo:
    'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-craftsman-working-on-a-leather-belt-45735-large.mp4',
  heroPoster:
    'https://images.pexels.com/photos/33242820/pexels-photo-33242820.jpeg?auto=compress&cs=tinysrgb&w=2400&q=85',
  experienceEyebrow: 'Experience Inclex',
  experienceHeading: 'Crafted With Purpose',
  experienceSubtitle: 'Every detail is designed with intention. Watch how Inclex comes to life.',
  experienceVideo:
    'https://assets.mixkit.co/videos/preview/mixkit-craftsman-hitting-a-leather-piece-with-a-hammer-45737-large.mp4',
  customizeHeading: 'Customize Your Keychain',
  customizeSubtitle: 'Add your name, initials or logo and create something truly yours.',
  newsletterHeading: 'Stay Updated',
  newsletterSubtitle: 'New arrivals, exclusive offers and more.',
  announcementBar: 'FREE SHIPPING on all orders above ₹499',
  couponBanner: 'Use code: INCLEX10 for 10% OFF on your first order',
};

export async function fetchHomepage() {
  try {
    const res = await fetch('/api/content/homepage', { cache: 'no-store' });
    const data = await res.json();
    if (data?.homepage) return { ...DEFAULT_HOMEPAGE, ...data.homepage };
  } catch {}
  return DEFAULT_HOMEPAGE;
}

export async function fetchSettings() {
  try {
    const res = await fetch('/api/settings', { cache: 'no-store' });
    const data = await res.json();
    if (data?.settings) return data.settings;
  } catch {}
  return null;
}
