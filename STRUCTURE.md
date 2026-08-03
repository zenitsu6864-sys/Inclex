// Feature-based README describing the folder purposes.
# Inclex — Codebase Structure

```
/app/
├── app/                      # Next.js App Router
│   ├── api/[[...path]]/      # Single catch-all API entry (dispatches to /lib/api handlers)
│   ├── admin/                # /admin/* pages (dashboard, products, orders, ...)
│   ├── account/              # /account/* pages (overview, orders, wishlist)
│   ├── shop/                 # Public shop grid + product detail
│   ├── login/, signup/,
│   │   forgot-password/,
│   │   reset-password/       # Public auth pages
│   ├── customize/            # Bespoke studio
│   ├── about/, contact/,
│   │   corporate-orders/,
│   │   faq/, policy/[slug]/  # Editorial + legal pages
│   ├── checkout/             # Cart → checkout → confirmation
│   ├── layout.js             # Root layout (fonts, providers, metadata)
│   ├── providers.js          # UserProvider + CartProvider + WishlistProvider
│   ├── globals.css           # Design tokens + component classes
│   └── page.js               # Home
│
├── components/
│   ├── ui/                   # ✨ Reusable primitives (Panel, Field, Eyebrow, ...)
│   ├── site/                 # Public site chrome (Header, Footer, Cart, User, Wishlist)
│   └── admin/                # Admin shell (Sidebar, AdminShell, ComingSoon)
│
├── lib/
│   ├── api/                  # API layer
│   │   ├── db.js             # getDb() + ensureSeed() + activityLog()
│   │   ├── response.js       # json(), CORS, parsePath()
│   │   ├── client.js         # Frontend fetch wrapper (api.get/post/del)
│   │   └── admin.js          # Admin route handlers (extracted from route.js)
│   ├── auth/user.js          # Customer JWT + scrypt password hashing
│   ├── admin/auth.js         # Admin JWT + cookie helpers
│   ├── payments/razorpay.js  # Razorpay client + signature verify
│   ├── email/resend.js       # Resend client + branded email templates
│   ├── data/products.js      # Seed product catalog
│   ├── data/content.js       # Frontend CMS fetcher (homepage/settings)
│   └── utils/format.js       # fmt(), escape(), slugify(), initials()
│
├── tests/                    # Playwright + backend test harness
├── test_result.md            # Testing communication log
└── .env                      # Protected environment variables
```

## Adding a new feature — the fast path
1. **Data layer**: put shapes/seed in `/lib/data/*.js`.
2. **API layer**: add handler in `/lib/api/*.js` (or extend route.js).
3. **UI primitives**: reuse `Panel`, `Field`, `Eyebrow`, `StatusBadge`, `EmptyState`.
4. **Public route**: `/app/app/<route>/page.js`.
5. **Admin route**: `/app/app/admin/<route>/page.js` + add nav item in `Sidebar.jsx`.

## Reusability rules
- **Never duplicate a form field** — use `<Field label icon Icon type ... />`.
- **Never duplicate a form section** — use `<Panel title number>`.
- **Never write your own status pill** — use `<StatusBadge status />`.
- **Never write your own empty state** — use `<EmptyState icon title description ctaLabel ctaHref />`.
- **Never do `new Intl.NumberFormat`** — use `fmtINR()` from `/lib/utils/format`.
- **Never do bare `fetch(...)` in client code** — use `api.get/post/del` from `/lib/api/client`.
