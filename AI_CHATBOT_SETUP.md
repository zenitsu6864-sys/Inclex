# INCLEX AI Customer Support — Setup

This patch adds a Gemini-powered customer support assistant to the existing Next.js 15 + MongoDB INCLEX website.

## Included

- Floating customer chat widget, mounted globally through `app/providers.js`.
- Server-side Gemini API integration at `POST /api/assistant/chat`.
- INCLEX / Keyfume product knowledge grounded in the current product-information page.
- Live Keyfume product price, color, and stock context from MongoDB's `products` collection.
- Shipping/COD settings read from MongoDB `content` document with `key: "settings"`.
- Order lookup requiring BOTH the order number (`INX-123456`) and the checkout email address.
- Email, recognizable Indian mobile numbers, and order IDs are redacted from messages before sending them to Gemini and before transcript storage.
- Conversation transcripts stored in MongoDB collection `ai_support_chats` (last 40 messages per conversation).
- Admin conversation viewer at `/admin/assistant`, protected by the existing admin API authentication.
- Human-support link to the site's `/contact` page.

## 1. Configure Gemini

Create a Gemini API key in Google AI Studio, then add these variables to your local `.env` file:

```env
GEMINI_API_KEY=your_actual_api_key
GEMINI_MODEL=gemini-3.8-flash
SUPPORT_EMAIL=support@inclex.com
```

`GEMINI_API_KEY` must remain server-side. Do not use `NEXT_PUBLIC_GEMINI_API_KEY`, do not commit `.env`, and do not expose the key in client-side code.

The model can be changed using `GEMINI_MODEL` without changing application code.

## 2. Configure Vercel

In Vercel, open the INCLEX project → Settings → Environment Variables. Add:

- `GEMINI_API_KEY` — required, mark as sensitive if the UI offers that option.
- `GEMINI_MODEL` — `gemini-3.8-flash`.
- `SUPPORT_EMAIL` — optional fallback support address.

Add the variables to the environments where you deploy (Production, Preview, and Development as appropriate), then redeploy.

## 3. Check MongoDB data

The assistant reads current Keyfume information from the `products` collection. The product record must have a `slug` or `name` containing `keyfume`, and its status must not be `archived` (prefer `published`). The assistant does not use the old sample catalog in `lib/data/products.js` to invent Keyfume pricing.

The assistant reads store shipping/payment settings from `content` where `key: "settings"`. If no live shipping threshold is configured, it will not guess one.

Order lookup uses the existing `orders` documents and expects:

- `orderNumber`, e.g. `INX-123456`
- `customer.email`
- `status`
- optional `shipping.courier`, `shipping.trackingNumber`, and `shipping.trackingUrl`

The customer must provide both the order number and the email address used at checkout. The assistant never asks for OTPs, passwords, card numbers, CVV, or UPI PINs.

## 4. Run locally

```bash
yarn dev
```

Open the website and use the **ASK INCLEX** button at the bottom-right corner. Test:

1. `What is Keyfume?`
2. `How do I refill it?`
3. `What is the current price?` (requires the published Keyfume MongoDB product record)
4. `How can I track my order?` (then provide a real order number and checkout email)
5. Ask for a human representative and use the Contact link.

Sign in to the existing admin panel and open **Communication → AI Conversations** to view the latest 100 saved conversations.

## 5. Production notes

- The API includes basic per-runtime-instance throttling (18 requests/minute per detected client IP). This is not a distributed rate limiter; use a shared rate-limit store or edge/WAF rule before high-volume production traffic.
- Chat transcripts are saved in MongoDB. The UI tells customers that chats may be saved and advises them not to share passwords, OTPs, or payment details. Email, recognizable Indian mobile numbers, and order IDs are redacted where detected, but customers should still avoid sending unnecessary personal information.
- The assistant only reports order status after matching both the order number and checkout email.
- Product and policy answers are only as current as the website content and MongoDB settings. Keep the product record and policy pages accurate.
- The Gemini API key is never sent to the browser. All model calls run inside the server route.

## 6. Files changed

- `app/api/[[...path]]/route.js`
- `app/providers.js`
- `components/site/InclexAssistant.jsx` (new)
- `components/admin/Sidebar.jsx`
- `app/admin/assistant/page.js` (new)
- `.env.example` (new)
