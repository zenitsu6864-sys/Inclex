# INCLEX — Premium Leather Keychains

> Crafted to last. Designed to be remembered.

A production-grade, luxury e-commerce platform for premium leather keychains. Ships with a full public storefront, customer accounts, a bespoke customization studio, a 25-module admin panel, real payment integration (Razorpay), transactional email (Resend), and a homepage CMS that goes live instantly — no code changes required.

Live preview: **https://craft-refine.preview.emergentagent.com**

---

## Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Prerequisites](#-prerequisites)
5. [Getting Started](#-getting-started)
6. [Environment Variables](#-environment-variables)
7. [Third-Party Integrations](#-third-party-integrations)
8. [Development Workflow](#-development-workflow)
9. [API Reference](#-api-reference)
10. [Default Credentials](#-default-credentials)
11. [Testing](#-testing)
12. [Deployment](#-deployment)
13. [Troubleshooting](#-troubleshooting)
14. [License](#-license)

---

## ✨ Features

### Public Storefront
- **Hero video landing page** with GSAP-style parallax, subtle slow-zoom, cinematic overlays
- **Cinematic Experience Section** — responsive 350/500/650px video with premium loader
- **Shop grid** with sidebar filters (category, material, price, color, features), sort, list/grid toggle
- **Product Detail** — image gallery, ratings, variants (color/engraving/qty), highlights, related products
- **Bespoke Studio** (`/customize`) — material, color, finish, font, live engraving preview
- **Cart drawer + Checkout** — COD + Razorpay online payments, prefilled from user profile
- **Newsletter subscription** with CSV export
- **Wishlist** — heart icons persist across devices for signed-in users
- **Editorial pages** — About, Contact, Corporate Orders, FAQ, Policies

### Customer Accounts
- Email/password signup, login, logout with JWT cookies (`inclex_user`)
- **Forgot password / reset password** flow with expiring tokens (30-min TTL)
- Profile management (name, phone, password change)
- Order history with live status tracking
- Wishlist management
- Auto-prefill checkout from profile

### Admin Panel (`/admin`)
- **Dashboard** — real KPIs (revenue, orders, AOV, low stock), 14-day revenue chart, best sellers, activity feed
- **Products CRUD** — full editor with images/attributes/SEO/pricing/status
- **Orders** — list, filter, status pipeline (placed → confirmed → packed → shipped → delivered), side drawer
- **Customers** — auto-aggregated from orders with LTV and last order date
- **Coupons** — percentage/flat/free-shipping/BXGY with schedule, min-order, max-uses, public validation API
- **Homepage CMS** — edit hero heading, videos, CTAs, announcement bar, coupon banner — **goes live instantly**
- **Inquiries** — Contact + Corporate + Customization submissions with tabs
- **Newsletter** — subscriber list with CSV export
- **Media Library** — URL-based image/video management
- **Settings** — general, support, social, payments, shipping
- **Activity Log** — every admin action audited
- **Scaffolded (roadmap)** — Launch Control, Banners, Campaigns, Blog CMS, Navigation CMS, Analytics, Reports, SEO, Staff & Roles, Reviews, Inventory

### Integrations
- 💳 **Razorpay** — UPI/Cards/Netbanking/Wallets with signature verification
- 📧 **Resend** — Order confirmation + password reset emails with branded HTML templates
- 🗄️ **MongoDB** — orders, customers, wishlist, products, coupons, activity logs, CMS content

---

## 🛠 Tech Stack

### Frontend
| Layer | Tool |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Runtime | **React 19** |
| Styling | **Tailwind CSS v3** + custom design tokens |
| UI Kit | **shadcn/ui** primitives + custom `/components/ui` |
| Icons | **lucide-react** |
| Animation | **framer-motion** + CSS keyframes |
| Fonts | **Playfair Display** (headings) + **Inter** (body) via `next/font/google` |
| Toast/Notify | **sonner** |

### Backend
| Layer | Tool |
|---|---|
| API | **Next.js Route Handlers** (App Router, catch-all `/api/[[...path]]`) |
| Database | **MongoDB** (native driver) |
| Auth | **JWT** signed with HMAC-SHA256 (custom, HttpOnly cookies) |
| Password hashing | **Node crypto scrypt** (`salt:hash` format, timing-safe compare) |
| Payments | **razorpay@2.9.8** (order creation + signature verification) |
| Email | **resend@6.18.1** with branded HTML templates |
| IDs | **uuid** (never MongoDB `ObjectId` — kept out of client responses) |

### Development
| Tool | Purpose |
|---|---|
| Yarn | Package manager |
| Supervisor | Process manager for dev server |
| ESLint | Code linting |
| Playwright | UI testing |

### Design System
- **Primary**: `#111111` · **Gold**: `#C9A227` · **Background**: `#F8F7F4` · **Surface**: `#FFFFFF`
- **Borders**: `rgba(0, 0, 0, 0.08)` · **Secondary text**: `#6B7280`
- Editorial spacing rhythm, Playfair serif headings, Inter body, 0.18–0.24em tracking for eyebrows and buttons

---

## 📁 Project Structure

```
/app/
├── app/                            # Next.js App Router
│   ├── api/[[...path]]/route.js    # Single catch-all API entry
│   ├── admin/                      # /admin/* (25 modules)
│   ├── account/                    # /account/* (profile, orders, wishlist)
│   ├── shop/                       # Shop grid + product detail
│   ├── customize/                  # Bespoke studio
│   ├── checkout/                   # Cart → checkout → confirmation
│   ├── login/, signup/,
│   │   forgot-password/,
│   │   reset-password/             # Public auth pages
│   ├── about/, contact/,
│   │   corporate-orders/,
│   │   faq/, policy/[slug]/        # Editorial + legal pages
│   ├── layout.js                   # Root layout (fonts, providers, metadata)
│   ├── providers.js                # User + Cart + Wishlist providers
│   ├── globals.css                 # Design tokens + component classes
│   └── page.js                     # Home
│
├── components/
│   ├── ui/                         # Reusable primitives (Panel, Field, StatusBadge, ...)
│   ├── site/                       # Public site chrome (Header, Footer, Cart, User, Wishlist)
│   └── admin/                      # Admin shell (Sidebar, AdminShell, ComingSoon)
│
├── lib/
│   ├── api/
│   │   ├── db.js                   # getDb() + ensureSeed() + activityLog()
│   │   ├── response.js             # json(), CORS, parsePath()
│   │   └── client.js               # Frontend fetch wrapper (api.get/post/del)
│   ├── auth/user.js                # Customer JWT + scrypt password hashing
│   ├── admin/auth.js               # Admin JWT + cookie helpers
│   ├── payments/razorpay.js        # Razorpay client + signature verify
│   ├── email/resend.js             # Resend client + branded email templates
│   ├── data/products.js            # Seed product catalog
│   ├── data/content.js             # Frontend CMS fetcher (homepage/settings)
│   └── utils/format.js             # fmtINR(), escapeHtml(), slugify(), initials()
│
├── tests/                          # Playwright + backend test harness
├── STRUCTURE.md                    # Canonical folder guide + reusability rules
├── test_result.md                  # Testing communication log (auto-managed)
└── .env                            # Protected environment variables
```

See `STRUCTURE.md` for detailed conventions.

---

## ✅ Prerequisites

Install these before you start:

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | ≥ 18.17 | Required by Next.js 15 |
| **Yarn** | ≥ 1.22 | `npm install -g yarn` — **DO NOT use npm** (breaks lockfile) |
| **MongoDB** | ≥ 5.0 | Local instance or MongoDB Atlas (free tier works) |
| **Git** | ≥ 2.30 | For version control |

Optional (for integrations):
- **Razorpay** account (free) — https://dashboard.razorpay.com
- **Resend** account (free tier: 3,000 emails/mo) — https://resend.com

---

## 🚀 Getting Started

### Step 1 — Clone the repository

```bash
git clone <your-repo-url> inclex
cd inclex
```

### Step 2 — Install dependencies

```bash
yarn install
```

> ⚠️ Never run `npm install` — it will break the lockfile. Always use `yarn`.

### Step 3 — Set up MongoDB

**Option A — Local MongoDB:**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu / Debian
sudo apt install mongodb
sudo systemctl start mongod
```

**Option B — MongoDB Atlas (recommended):**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Whitelist your IP under **Network Access**
4. Create a database user under **Database Access**
5. Copy the connection string (format: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/inclex`)

### Step 4 — Configure environment variables

Copy the example and fill in values:

```bash
cp .env.example .env
```

Or create `/app/.env` manually with:

```env
# ── Core (required) ──────────────────────────────────────
MONGO_URL=mongodb://localhost:27017
DB_NAME=inclex
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*

# ── Admin credentials ────────────────────────────────────
ADMIN_EMAIL=admin@inclex.com
ADMIN_PASSWORD=inclex2025
ADMIN_SECRET=change-this-to-a-random-64-char-string

# ── Razorpay (optional — for online payments) ────────────
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# ── Resend (optional — for order + password reset emails) ─
RESEND_API_KEY=
RESEND_FROM_EMAIL=Inclex <onboarding@resend.dev>
```

> Without Razorpay keys, only Cash on Delivery works. Without Resend, emails are logged and forgot-password returns the reset URL directly in the dev response (safe fallback).

### Step 5 — Start the development server

```bash
yarn dev
```

The app will be available at **http://localhost:3000**.

The first load seeds 4 example products into MongoDB automatically. You can now:
- Visit `/` for the storefront
- Visit `/admin/login` for the admin panel
- Sign up a customer at `/signup`

### Step 6 — Build for production

```bash
yarn build
yarn start
```

---

## 🌍 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URL` | ✅ | MongoDB connection string |
| `DB_NAME` | ✅ | Database name (default: `inclex`) |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Full public URL used in password-reset emails |
| `ADMIN_EMAIL` | ✅ | Admin login email |
| `ADMIN_PASSWORD` | ✅ | Admin login password |
| `ADMIN_SECRET` | ✅ | JWT signing secret — **generate a random 64-char string in production** |
| `RAZORPAY_KEY_ID` | Optional | Razorpay Key ID (starts with `rzp_test_` or `rzp_live_`) |
| `RAZORPAY_KEY_SECRET` | Optional | Razorpay Key Secret (server-only) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional | Same as `RAZORPAY_KEY_ID`, exposed to client |
| `RESEND_API_KEY` | Optional | Resend API key (starts with `re_`) |
| `RESEND_FROM_EMAIL` | Optional | Verified sender (default: `Inclex <onboarding@resend.dev>`) |

Generate a secure `ADMIN_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## 🔌 Third-Party Integrations

### Razorpay (Payments)

**Get keys (test mode):**
1. Sign up at https://dashboard.razorpay.com
2. Ensure top-right toggle is on **Test Mode**
3. Navigate to **Account & Settings → API Keys**
4. Click **Generate Test Key**
5. Copy Key ID + Key Secret into `.env`

**Test payment methods:**
- Card: `4111 1111 1111 1111`, any future expiry, any CVV
- UPI: `success@razorpay`
- Netbanking: use the simulator

### Resend (Email)

**Get key:**
1. Sign up at https://resend.com
2. Go to **API Keys → Create API Key**
3. Copy the key (starts with `re_`) into `.env`
4. For a custom `From` address, verify a domain under **Domains**. Otherwise use `onboarding@resend.dev` for testing.

---

## 🧑‍💻 Development Workflow

### Running with hot reload
```bash
yarn dev
```
Both frontend and API routes hot-reload on file save.

### Restarting the server (needed when `.env` changes or new packages are installed)
```bash
# If using supervisor (production-like local setup):
sudo supervisorctl restart nextjs

# Otherwise, just Ctrl+C and re-run:
yarn dev
```

### Installing a new package
```bash
yarn add <package-name>
```
Always add to `package.json`. Never install with `npm`.

### Linting
```bash
yarn lint
```

### Design system rules
See `STRUCTURE.md`. Key principles:
- Import primitives from `@/components/ui` — never duplicate `Panel`, `Field`, `StatusBadge`, `EmptyState`.
- Use `fmtINR()` from `/lib/utils/format` for currency — never inline `Intl.NumberFormat`.
- Use `api.get / api.post` from `/lib/api/client` — never bare `fetch()` in client code.
- Never use MongoDB `ObjectId` — always UUIDs; strip `_id` from all responses.

---

## 📡 API Reference

All routes are under `/api/*`. JSON in, JSON out. CORS enabled.

### Public
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/status` | Health check |
| GET | `/api/products` | List products (query: `?q=`, `?category=`) |
| GET | `/api/products/:slug` | Product detail |
| GET | `/api/faqs` | FAQ list |
| GET | `/api/content/homepage` | Live homepage CMS content |
| GET | `/api/settings` | Public site settings |
| GET | `/api/coupons/validate?code=` | Validate coupon at checkout |
| POST | `/api/newsletter` | Subscribe email |
| POST | `/api/contact` | Contact form |
| POST | `/api/corporate` | Corporate inquiry |
| POST | `/api/customize` | Save customization |
| POST | `/api/checkout` | Place order (COD or Razorpay) |
| POST | `/api/checkout/verify` | Verify Razorpay signature |

### Customer Auth
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create account + auto login |
| POST | `/api/auth/login` | Login (sets `inclex_user` cookie) |
| POST | `/api/auth/logout` | Logout (clears cookie) |
| POST | `/api/auth/forgot` | Send password reset email |
| POST | `/api/auth/reset` | Reset password with token |
| POST | `/api/auth/update` | Update profile / change password |
| GET | `/api/auth/me` | Current user (or `{user: null}`) |

### Customer Account (requires `inclex_user` cookie)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/account/orders` | Order history |
| GET | `/api/wishlist` | Wishlist items |
| POST | `/api/wishlist/toggle` | Add/remove product |

### Admin (requires `inclex_admin` cookie)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/me` | Current admin |
| GET | `/api/admin/dashboard` | KPIs + charts + activity |
| GET/POST/DELETE | `/api/admin/products[/:id]` | Product CRUD |
| GET/POST/DELETE | `/api/admin/coupons[/:id]` | Coupon CRUD |
| GET | `/api/admin/orders` | All orders |
| POST | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/customers` | Auto-aggregated customer list |
| GET | `/api/admin/newsletter` | Subscribers |
| GET | `/api/admin/inquiries` | Contact + Corporate + Customization tabs |
| GET/POST | `/api/admin/content/homepage` | Homepage CMS |
| GET/POST | `/api/admin/settings` | Site settings |
| GET/POST/DELETE | `/api/admin/media[/:id]` | Media library |
| GET | `/api/admin/activity` | Activity log |

---

## 🔐 Default Credentials

### Admin
- URL: **`/admin/login`**
- Email: `admin@inclex.com`
- Password: `inclex2025`

> **Change these immediately in production** by editing `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` and rotating `ADMIN_SECRET`.

### Test Customer (create via `/signup`)
No pre-seeded customer accounts. Sign up any email through the UI.

---

## 🧪 Testing

### Backend curl tests
```bash
# Health check
curl http://localhost:3000/api/status

# Admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inclex.com","password":"inclex2025"}' \
  -c cookies.txt

# List products (public)
curl http://localhost:3000/api/products
```

### Playwright tests
```bash
yarn test:e2e
```

---

## 🚢 Deployment

### Environment
Set all required env vars on your hosting platform (Vercel, Netlify, Railway, Render, AWS, etc.):
- `MONGO_URL` (production MongoDB Atlas cluster)
- `NEXT_PUBLIC_BASE_URL` (your production domain)
- `ADMIN_SECRET` (rotate to a new random 64-char string)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (change from defaults!)
- Razorpay live keys (from Live Mode, not Test)
- Resend key + a verified custom-domain sender

### Build
```bash
yarn build
yarn start
```

### Recommended hosting
- **Vercel** — zero-config Next.js deployment
- **Railway** — includes managed MongoDB
- **MongoDB Atlas** — production database

### Post-deployment checklist
- [ ] All env vars set
- [ ] `ADMIN_SECRET` rotated
- [ ] `ADMIN_PASSWORD` changed
- [ ] Razorpay switched to **Live Mode**
- [ ] Resend sender domain **verified**
- [ ] MongoDB indexes created:
  ```js
  db.users.createIndex({ email: 1 }, { unique: true });
  db.newsletter.createIndex({ email: 1 }, { unique: true });
  db.orders.createIndex({ createdAt: -1 });
  db.orders.createIndex({ 'customer.email': 1 });
  db.wishlist.createIndex({ userId: 1, productId: 1 }, { unique: true });
  db.password_resets.createIndex({ token: 1 });
  db.password_resets.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  db.products.createIndex({ slug: 1 }, { unique: true });
  db.coupons.createIndex({ code: 1 }, { unique: true });
  ```
- [ ] HTTPS enforced
- [ ] Content Security Policy headers configured
- [ ] Rate limiting on `/api/auth/*` endpoints (recommended)

---

## 🛠 Troubleshooting

| Problem | Fix |
|---|---|
| **`yarn dev` fails to start** | Check `yarn install` completed. Look at logs: `tail -f /var/log/supervisor/nextjs.out.log` |
| **MongoDB connection refused** | Ensure MongoDB is running (`brew services start mongodb-community`) or your Atlas IP is whitelisted |
| **Admin login returns 401** | Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. Restart server after `.env` changes |
| **Razorpay returns 503** | Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`. Restart |
| **Password reset email not received** | Set `RESEND_API_KEY` and verify sender domain. Dev fallback returns the reset URL in the API response |
| **Hero video not playing** | Modern browsers require `muted` autoplay. Check the video URL is a direct MP4, not a page |
| **Cookies not being set** | Check `NEXT_PUBLIC_BASE_URL` matches your actual origin. In production use HTTPS |
| **502 Bad Gateway during dev** | Next.js is recompiling. Wait 10 seconds and reload |

---

## 📜 License

Proprietary — © Inclex. All rights reserved.

---

## 🙏 Credits

- Design & Engineering — Inclex team
- Fonts — [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) + [Inter](https://fonts.google.com/specimen/Inter) by Google Fonts
- Icons — [Lucide](https://lucide.dev)
- Product photography — Unsplash / Pexels contributors
- Video assets — Mixkit / Pixabay

---

**Made in Bengaluru, India** ♥
