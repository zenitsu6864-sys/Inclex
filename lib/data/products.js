/* Central product catalog (server-safe). */

export const PRODUCTS = [
  {
    id: 'inclex-signature',
    slug: 'inclex-signature',
    name: 'INCLEX Signature',
    subtitle: 'Premium Leather Keychain',
    price: 899,
    compareAt: 1299,
    currency: 'INR',
    rating: 4.7,
    reviews: 128,
    badges: ['Best Seller', 'New'],
    material: 'Leather',
    colors: ['Black', 'Cognac', 'Espresso'],
    features: ['Genuine Leather', 'Lifetime Finish', 'Personalizable'],
    description:
      'A perfect blend of premium leather and stainless steel. Laser-engraved to make it uniquely yours. Built for those who appreciate the finer details.',
    highlights: [
      { title: 'Genuine Leather', body: 'Full-grain, vegetable-tanned Italian leather.' },
      { title: 'Stainless Steel Ring', body: 'PVD-coated, corrosion resistant hardware.' },
      { title: 'Laser Engraving', body: 'Sharp, permanent personalization up to 16 characters.' },
      { title: 'Lifetime Finish', body: 'Ages beautifully with a rich, natural patina.' },
    ],
    images: [
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
    ],
  },
  {
    id: 'inclex-noir',
    slug: 'inclex-noir',
    name: 'INCLEX Noir',
    subtitle: 'Obsidian Carbon Keychain',
    price: 1199,
    compareAt: 1499,
    currency: 'INR',
    rating: 4.8,
    reviews: 42,
    badges: ['New'],
    material: 'Carbon Fiber',
    colors: ['Black'],
    features: ['Carbon Fiber', 'Titanium Ring', 'Ultra Light'],
    description:
      'Aerospace-grade carbon fiber paired with a machined titanium ring. Weightless in the pocket, unmistakable in the hand.',
    highlights: [
      { title: 'Aerospace Carbon', body: '3K woven carbon fiber, hand-finished.' },
      { title: 'Titanium Hardware', body: 'Grade-5 titanium ring, hypoallergenic.' },
      { title: 'Ultra Light', body: 'Under 12g — you’ll forget it’s there.' },
      { title: 'Timeless Matte', body: 'Anti-fingerprint matte topcoat.' },
    ],
    images: [
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
    ],
  },
  {
    id: 'inclex-heritage',
    slug: 'inclex-heritage',
    name: 'INCLEX Heritage',
    subtitle: 'Cognac Leather Keychain',
    price: 999,
    compareAt: 1399,
    currency: 'INR',
    rating: 4.6,
    reviews: 87,
    badges: ['Best Seller'],
    material: 'Leather',
    colors: ['Cognac', 'Tan'],
    features: ['Genuine Leather', 'Brass Ring', 'Personalizable'],
    description:
      'A warm cognac leather with vintage-brass hardware. Designed to develop character with everyday use.',
    highlights: [
      { title: 'Vintage Cognac', body: 'Hand-dyed full-grain leather.' },
      { title: 'Solid Brass', body: 'Patina develops beautifully over time.' },
      { title: 'Personalizable', body: 'Engrave initials, names or logos.' },
      { title: 'Made to Last', body: 'Hand-stitched with waxed linen thread.' },
    ],
    images: [
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
    ],
  },
  {
    id: 'inclex-steel',
    slug: 'inclex-steel',
    name: 'INCLEX Steel',
    subtitle: 'Machined Stainless Keychain',
    price: 1499,
    compareAt: 1899,
    currency: 'INR',
    rating: 4.9,
    reviews: 31,
    badges: ['Limited Edition'],
    material: 'Metal',
    colors: ['Silver', 'Gunmetal'],
    features: ['Stainless Steel', 'CNC Machined', 'Lifetime Finish'],
    description:
      'CNC-machined from a single billet of stainless steel. Precision-engineered, tactile, permanent.',
    highlights: [
      { title: 'Solid Billet', body: 'Machined from a single piece of 316L steel.' },
      { title: 'Tactile Knurl', body: 'Sub-millimeter knurl for perfect grip.' },
      { title: 'Numbered Edition', body: 'Each piece individually numbered.' },
      { title: 'Lifetime Finish', body: 'Sapphire-clear PVD coating.' },
    ],
    images: [
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
      '/uploads/images/1785871863078-9jsnapnecpt.jpeg',
    ],
  },
];

export const CATEGORIES = ['All Products', 'Leather', 'Metal', 'Carbon Fiber', 'Personalized'];

export const MATERIALS = ['Leather', 'Metal', 'Stainless Steel', 'Carbon Fiber'];

export const FEATURES_FILTER = ['Personalizable', 'Best Seller', 'New', 'Limited Edition'];