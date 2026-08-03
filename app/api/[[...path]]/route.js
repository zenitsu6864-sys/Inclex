import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { PRODUCTS } from '@/lib/data/products';
import { signToken, getAdminFromRequest } from '@/lib/admin/auth';
import { hashPassword, verifyPassword, signUserToken, getUserFromRequest } from '@/lib/auth/user';
import { getRazorpay, razorpayEnabled, verifyRazorpaySignature } from '@/lib/payments/razorpay';
import { sendOrderEmail, sendResetEmail, makeResetToken, emailEnabled } from '@/lib/email/resend';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'inclex';

let cachedClient = null;
export async function getDb() {  // changed this function to solve login error 
  if (!uri) {
    console.error("❌ MONGO_URL is missing.");
    return null;
  }

  try {
    if (!cachedClient) {
      console.log("Connecting to MongoDB...");
      console.log("URI:", uri);
      console.log("Database:", dbName);

      cachedClient = new MongoClient(uri);
      await cachedClient.connect();

      console.log("✅ MongoDB Connected Successfully");
    }

    return cachedClient.db(dbName);

  } catch (err) {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);

    return null;
  }
}

async function ensureSeed(db) {
  if (!db) return;
  const col = db.collection('products');
  const count = await col.countDocuments();
  if (count === 0) {
    await col.insertMany(PRODUCTS.map(p => ({ ...p, status: 'published', featured: p.badges.includes('Best Seller'), stock: 42, createdAt: new Date().toISOString() })));
  }
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: cors }); }

function route(request) {
  const url = new URL(request.url);
  const parts = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  return { parts, url };
}
function json(data, status = 200, extra = {}) {
  return NextResponse.json(data, { status, headers: { ...cors, ...extra } });
}
function requireAdmin(request) {
  const admin = getAdminFromRequest(request);
  if (!admin) return null;
  return admin;
}
async function log(db, action, meta) {
  if (!db) return;
  await db.collection('activity_logs').insertOne({
    id: uuidv4(), action, meta: meta || {}, at: new Date().toISOString(),
  });
}

// ============================================================================
// GET
// ============================================================================
export async function GET(request) {
  const { parts, url } = route(request);
  try {
    // Public endpoints -------------------------------------------------------
    if (parts.length === 0 || parts[0] === 'status') {
      return json({ ok: true, service: 'inclex', ts: Date.now() });
    }

    // Customer auth ----------------------------------------------------------
    if (parts[0] === 'auth' && parts[1] === 'me') {
      const user = getUserFromRequest(request);
      if (!user) return json({ user: null }, 200);
      const db = await getDb();
      let fresh = null;
      if (db) fresh = await db.collection('users').findOne({ id: user.userId }, { projection: { _id: 0, password: 0 } });
      return json({ user: fresh || { id: user.userId, email: user.email, name: user.name } });
    }

    if (parts[0] === 'account' && parts[1] === 'orders') {
      const user = getUserFromRequest(request);
      if (!user) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb();
      const orders = db ? await db.collection('orders').find({ $or: [{ userId: user.userId }, { 'customer.email': user.email }] }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() : [];
      return json({ orders });
    }

    if (parts[0] === 'wishlist') {
      const user = getUserFromRequest(request);
      if (!user) return json({ items: [], ids: [] });
      const db = await getDb();
      if (!db) return json({ items: [], ids: [] });
      const rows = await db.collection('wishlist').find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();
      const ids = rows.map(r => r.productId);
      if (ids.length === 0) return json({ items: [], ids: [] });
      if (db) await ensureSeed(db);
      const products = await db.collection('products').find({ id: { $in: ids } }, { projection: { _id: 0 } }).toArray();
      const map = new Map(products.map(p => [p.id, p]));
      const items = ids.map(id => map.get(id)).filter(Boolean);
      return json({ items, ids });
    }

    if (parts[0] === 'products' && parts[1] !== undefined && parts[0] !== 'admin') {
      // GET /api/products/:slug
      const db = await getDb();
      let p = null;
      if (db) {
        await ensureSeed(db);
        p = await db.collection('products').findOne({ $or: [{ slug: parts[1] }, { id: parts[1] }], status: { $ne: 'archived' } }, { projection: { _id: 0 } });
      }
      if (!p) p = PRODUCTS.find(x => x.slug === parts[1] || x.id === parts[1]);
      if (!p) return json({ error: 'Not found' }, 404);
      return json({ product: p });
    }

    if (parts[0] === 'products') {
      const db = await getDb();
      let list = [];
      if (db) {
        await ensureSeed(db);
        list = await db.collection('products').find({ status: { $ne: 'archived' } }, { projection: { _id: 0 } }).toArray();
      }
      if (list.length === 0) list = PRODUCTS;
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const category = url.searchParams.get('category');
      if (q) list = list.filter(p => (p.name + ' ' + p.subtitle).toLowerCase().includes(q));
      if (category && category !== 'All Products') {
        list = list.filter(p => category === 'Personalized' ? p.features?.some(f => /personal/i.test(f)) : p.material === category);
      }
      // Only show 'published' products publicly
      const published = list.filter(p => (p.status || 'published') === 'published');
      return json({ products: published });
    }

    if (parts[0] === 'faqs') {
      return json({
        faqs: [
          { q: 'How long does personalization take?', a: 'Personalized orders ship within 3–5 business days from our Bengaluru atelier.' },
          { q: 'What is your return policy?', a: 'Non-personalized items can be returned within 14 days. Engraved items are final sale.' },
          { q: 'Is Cash on Delivery available?', a: 'Yes, COD is available on orders below ₹5,000 across India.' },
          { q: 'How do I track my order?', a: 'You’ll receive an email and SMS with a live tracking link once your order ships.' },
          { q: 'Do you ship internationally?', a: 'International shipping is coming soon. Corporate orders can be arranged today — contact us.' },
          { q: 'What materials do you use?', a: 'Full-grain leather, 316L stainless steel, aerospace carbon fiber and Grade-5 titanium.' },
        ],
      });
    }

    // Homepage content (public read) ----------------------------------------
    if (parts[0] === 'content' && parts[1] === 'homepage') {
      const db = await getDb();
      const doc = db ? await db.collection('content').findOne({ key: 'homepage' }, { projection: { _id: 0 } }) : null;
      return json({ homepage: doc?.value || null });
    }

    if (parts[0] === 'settings') {
      const db = await getDb();
      const doc = db ? await db.collection('content').findOne({ key: 'settings' }, { projection: { _id: 0 } }) : null;
      return json({ settings: doc?.value || null });
    }

    // Coupon validation (public) --------------------------------------------
    if (parts[0] === 'coupons' && parts[1] === 'validate') {
      const code = (url.searchParams.get('code') || '').toUpperCase();
      const db = await getDb();
      const c = db ? await db.collection('coupons').findOne({ code, active: true }, { projection: { _id: 0 } }) : null;
      if (!c) return json({ valid: false, error: 'Invalid or expired code' }, 404);
      return json({ valid: true, coupon: c });
    }

    // ADMIN endpoints -------------------------------------------------------
    if (parts[0] === 'admin') {
      if (parts[1] === 'me') {
        const admin = requireAdmin(request);
        if (!admin) return json({ error: 'Unauthorized' }, 401);
        return json({ ok: true, admin });
      }

      // All admin endpoints below require auth
      const admin = requireAdmin(request);
      if (!admin) return json({ error: 'Unauthorized' }, 401);

      const db = await getDb();

      if (parts[1] === 'dashboard') {
        if (db) await ensureSeed(db);
        const [ordersAll, productsAll, subs, contacts, corps, activity] = db ? await Promise.all([
          db.collection('orders').find({}).toArray(),
          db.collection('products').find({}).toArray(),
          db.collection('newsletter').countDocuments(),
          db.collection('contact').countDocuments(),
          db.collection('corporate_inquiries').countDocuments(),
          db.collection('activity_logs').find({}).sort({ at: -1 }).limit(10).toArray(),
        ]) : [[], [], 0, 0, 0, []];

        const totalRevenue = ordersAll.reduce((s, o) => s + (o.total || 0), 0);
        const customers = new Set(ordersAll.map(o => o.customer?.email).filter(Boolean));
        const statusCount = ordersAll.reduce((m, o) => { m[o.status || 'placed'] = (m[o.status || 'placed'] || 0) + 1; return m; }, {});

        const dailyBuckets = {};
        ordersAll.forEach(o => {
          const d = (o.createdAt || '').slice(0, 10);
          if (!d) return;
          dailyBuckets[d] = (dailyBuckets[d] || 0) + (o.total || 0);
        });
        const daily = Object.keys(dailyBuckets).sort().slice(-14).map(d => ({ date: d, revenue: dailyBuckets[d] }));

        const productSales = {};
        ordersAll.forEach(o => (o.items || []).forEach(it => { productSales[it.name] = (productSales[it.name] || 0) + it.qty; }));
        const bestSelling = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));

        return json({
          kpi: {
            totalRevenue,
            totalOrders: ordersAll.length,
            totalCustomers: customers.size,
            totalProducts: productsAll.length || PRODUCTS.length,
            activeProducts: (productsAll.length ? productsAll : PRODUCTS).filter(p => (p.status || 'published') === 'published').length,
            draftProducts: (productsAll.length ? productsAll : PRODUCTS).filter(p => p.status === 'draft').length,
            pendingOrders: (statusCount.placed || 0) + (statusCount.confirmed || 0),
            completedOrders: (statusCount.delivered || 0),
            returnedOrders: (statusCount.returned || 0),
            lowStock: (productsAll.length ? productsAll : PRODUCTS).filter(p => (p.stock ?? 42) > 0 && (p.stock ?? 42) < 10).length,
            outOfStock: (productsAll.length ? productsAll : PRODUCTS).filter(p => (p.stock ?? 42) === 0).length,
            aov: ordersAll.length ? Math.round(totalRevenue / ordersAll.length) : 0,
            subscribers: subs,
            contacts,
            corporateInquiries: corps,
          },
          daily,
          bestSelling,
          latestOrders: ordersAll.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 6),
          activity: activity || [],
        });
      }

      if (parts[1] === 'products') {
        if (db) await ensureSeed(db);
        if (parts[2]) {
          const p = db ? await db.collection('products').findOne({ id: parts[2] }, { projection: { _id: 0 } }) : null;
          if (!p) return json({ error: 'Not found' }, 404);
          return json({ product: p });
        }
        const list = db ? await db.collection('products').find({}, { projection: { _id: 0 } }).toArray() : PRODUCTS;
        return json({ products: list });
      }

      if (parts[1] === 'orders') {
        const list = db ? await db.collection('orders').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() : [];
        return json({ orders: list });
      }

      if (parts[1] === 'customers') {
        const orders = db ? await db.collection('orders').find({}).toArray() : [];
        const map = new Map();
        orders.forEach(o => {
          const email = o.customer?.email;
          if (!email) return;
          const cur = map.get(email) || { email, name: o.customer.name, phone: o.customer.phone, orders: 0, spent: 0, lastAt: '' };
          cur.orders += 1;
          cur.spent += o.total || 0;
          cur.lastAt = o.createdAt > cur.lastAt ? o.createdAt : cur.lastAt;
          map.set(email, cur);
        });
        return json({ customers: Array.from(map.values()).sort((a, b) => b.spent - a.spent) });
      }

      if (parts[1] === 'newsletter') {
        const list = db ? await db.collection('newsletter').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() : [];
        return json({ subscribers: list });
      }

      if (parts[1] === 'inquiries') {
        const contacts = db ? await db.collection('contact').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() : [];
        const corporate = db ? await db.collection('corporate_inquiries').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() : [];
        const custom = db ? await db.collection('customizations').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() : [];
        return json({ contacts, corporate, customizations: custom });
      }

      if (parts[1] === 'coupons') {
        const list = db ? await db.collection('coupons').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() : [];
        return json({ coupons: list });
      }

      if (parts[1] === 'content' && parts[2] === 'homepage') {
        const doc = db ? await db.collection('content').findOne({ key: 'homepage' }, { projection: { _id: 0 } }) : null;
        return json({ homepage: doc?.value || defaultHomepage() });
      }

      if (parts[1] === 'settings') {
        const doc = db ? await db.collection('content').findOne({ key: 'settings' }, { projection: { _id: 0 } }) : null;
        return json({ settings: doc?.value || defaultSettings() });
      }

      if (parts[1] === 'activity') {
        const list = db ? await db.collection('activity_logs').find({}, { projection: { _id: 0 } }).sort({ at: -1 }).limit(200).toArray() : [];
        return json({ activity: list });
      }

      if (parts[1] === 'media') {
        const list = db ? await db.collection('media').find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray() : [];
        return json({ media: list });
      }

      return json({ error: 'Not found' }, 404);
    }

    return json({ error: 'Not found' }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

// ============================================================================
// POST / PUT / DELETE
// ============================================================================
export async function POST(request) {
  const { parts } = route(request);
  try {
    const body = await request.json().catch(() => ({}));

    // Public POSTs ----------------------------------------------------------

    // Customer auth: signup / login / logout / update -----------------------
    if (parts[0] === 'auth' && parts[1] === 'signup') {
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const name = String(body.name || '').trim().slice(0, 80);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Invalid email' }, 400);
      if (password.length < 6) return json({ error: 'Password must be at least 6 characters' }, 400);
      if (!name) return json({ error: 'Please tell us your name' }, 400);
      const db = await getDb();
      if (!db) return json({ error: 'Database unavailable' }, 500);
      const existing = await db.collection('users').findOne({ email });
      if (existing) return json({ error: 'An account with this email already exists' }, 409);
      const user = {
        id: uuidv4(),
        email,
        name,
        phone: String(body.phone || '').slice(0, 20),
        password: hashPassword(password),
        createdAt: new Date().toISOString(),
      };
      await db.collection('users').insertOne(user);
      await log(db, 'user.signup', { email });
      const token = signUserToken({ userId: user.id, email: user.email, name: user.name });
      const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } }, { status: 200, headers: cors });
      res.headers.append('Set-Cookie', `inclex_user=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`);
      return res;
    }

    if (parts[0] === 'auth' && parts[1] === 'login') {
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const db = await getDb();
      if (!db) return json({ error: 'Database unavailable' }, 500);
      const user = await db.collection('users').findOne({ email });
      if (!user || !verifyPassword(password, user.password)) return json({ error: 'Invalid email or password' }, 401);
      await log(db, 'user.login', { email });
      const token = signUserToken({ userId: user.id, email: user.email, name: user.name });
      const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } }, { status: 200, headers: cors });
      res.headers.append('Set-Cookie', `inclex_user=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`);
      return res;
    }

    if (parts[0] === 'auth' && parts[1] === 'logout') {
      const res = NextResponse.json({ ok: true }, { status: 200, headers: cors });
      res.headers.append('Set-Cookie', `inclex_user=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
      return res;
    }

    if (parts[0] === 'wishlist' && parts[1] === 'toggle') {
      const wuser = getUserFromRequest(request);
      if (!wuser) return json({ error: 'Please sign in to use wishlist', needsAuth: true }, 401);
      const productId = String(body.productId || '');
      if (!productId) return json({ error: 'productId required' }, 400);
      const wdb = await getDb();
      if (!wdb) return json({ error: 'Database unavailable' }, 500);
      const existing = await wdb.collection('wishlist').findOne({ userId: wuser.userId, productId });
      if (existing) {
        await wdb.collection('wishlist').deleteOne({ userId: wuser.userId, productId });
        return json({ ok: true, added: false });
      }
      await wdb.collection('wishlist').insertOne({ id: uuidv4(), userId: wuser.userId, productId, createdAt: new Date().toISOString() });
      return json({ ok: true, added: true });
    }

    if (parts[0] === 'auth' && parts[1] === 'forgot') {
      const email = String(body.email || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Please enter a valid email' }, 400);
      const db = await getDb();
      // Always return ok:true to prevent email enumeration
      if (db) {
        const user = await db.collection('users').findOne({ email });
        if (user) {
          const token = makeResetToken();
          const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();
          await db.collection('password_resets').insertOne({ id: uuidv4(), userId: user.id, email, token, expiresAt, used: false, createdAt: new Date().toISOString() });
          const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          const resetUrl = `${base}/reset-password?token=${token}`;
          await log(db, 'password.reset_requested', { email });
          const result = await sendResetEmail(email, resetUrl);
          // In dev without Resend, return the URL so admin can test
          if (result.skipped) return json({ ok: true, devResetUrl: resetUrl });
        }
      }
      return json({ ok: true });
    }

    if (parts[0] === 'auth' && parts[1] === 'reset') {
      const token = String(body.token || '');
      const newPassword = String(body.password || '');
      if (!token || newPassword.length < 6) return json({ error: 'Invalid token or password too short' }, 400);
      const db = await getDb();
      if (!db) return json({ error: 'Database unavailable' }, 500);
      const rec = await db.collection('password_resets').findOne({ token, used: false });
      if (!rec) return json({ error: 'This reset link is invalid or has already been used' }, 400);
      if (new Date(rec.expiresAt) < new Date()) return json({ error: 'This reset link has expired' }, 400);
      await db.collection('users').updateOne({ id: rec.userId }, { $set: { password: hashPassword(newPassword) } });
      await db.collection('password_resets').updateOne({ token }, { $set: { used: true, usedAt: new Date().toISOString() } });
      await log(db, 'password.reset', { email: rec.email });
      return json({ ok: true });
    }

    if (parts[0] === 'auth' && parts[1] === 'update') {
      const user = getUserFromRequest(request);
      if (!user) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb();
      const patch = {};
      if (body.name) patch.name = String(body.name).slice(0, 80);
      if (body.phone) patch.phone = String(body.phone).slice(0, 20);
      if (body.address) patch.address = body.address;
      if (body.currentPassword && body.newPassword) {
        const dbUser = db ? await db.collection('users').findOne({ id: user.userId }) : null;
        if (!dbUser || !verifyPassword(body.currentPassword, dbUser.password)) return json({ error: 'Current password is incorrect' }, 400);
        if (String(body.newPassword).length < 6) return json({ error: 'New password must be at least 6 characters' }, 400);
        patch.password = hashPassword(body.newPassword);
      }
      if (db) await db.collection('users').updateOne({ id: user.userId }, { $set: patch });
      const fresh = db ? await db.collection('users').findOne({ id: user.userId }, { projection: { _id: 0, password: 0 } }) : null;
      return json({ ok: true, user: fresh });
    }

    if (parts[0] === 'newsletter') {
      const email = String(body.email || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Invalid email' }, 400);
      const db = await getDb();
      const record = { id: uuidv4(), email, createdAt: new Date().toISOString() };
      if (db) await db.collection('newsletter').updateOne({ email }, { $setOnInsert: record }, { upsert: true });
      return json({ ok: true, id: record.id });
    }
    if (parts[0] === 'customize') {
      const db = await getDb();
      const record = { id: uuidv4(), engraving: String(body.engraving || body.name || '').slice(0, 40), material: body.material || 'Leather', color: body.color || 'Black', finish: body.finish || 'Matte', font: body.font || 'Serif', productId: body.productId || 'inclex-signature', createdAt: new Date().toISOString() };
      if (db) await db.collection('customizations').insertOne(record);
      return json({ ok: true, id: record.id, preview: record });
    }
    if (parts[0] === 'contact') {
      const db = await getDb();
      const record = { id: uuidv4(), name: String(body.name || '').slice(0, 80), email: String(body.email || '').slice(0, 120), phone: String(body.phone || '').slice(0, 20), subject: String(body.subject || '').slice(0, 120), message: String(body.message || '').slice(0, 2000), createdAt: new Date().toISOString() };
      if (!record.email || !record.message) return json({ error: 'Email and message required' }, 400);
      if (db) await db.collection('contact').insertOne(record);
      return json({ ok: true, id: record.id });
    }
    if (parts[0] === 'corporate') {
      const db = await getDb();
      const record = { id: uuidv4(), company: String(body.company || '').slice(0, 120), name: String(body.name || '').slice(0, 80), email: String(body.email || '').slice(0, 120), phone: String(body.phone || '').slice(0, 20), quantity: Number(body.quantity || 0), notes: String(body.notes || '').slice(0, 2000), createdAt: new Date().toISOString() };
      if (!record.email || !record.company) return json({ error: 'Company and email required' }, 400);
      if (db) await db.collection('corporate_inquiries').insertOne(record);
      return json({ ok: true, id: record.id });
    }
    if (parts[0] === 'checkout' && parts[1] === 'verify') {
      const db = await getDb();
      const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};
      if (!verifyRazorpaySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature })) {
        return json({ ok: false, error: 'Invalid payment signature' }, 400);
      }
      let updated = null;
      if (db) {
        await db.collection('orders').updateOne(
          { id: orderId },
          { $set: { paymentStatus: 'paid', status: 'confirmed', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, paidAt: new Date().toISOString() } }
        );
        updated = await db.collection('orders').findOne({ id: orderId }, { projection: { _id: 0 } });
        await log(db, 'payment.success', { orderId, razorpay_payment_id });
        if (updated) sendOrderEmail(updated).catch(() => {});
      }
      return json({ ok: true, order: updated });
    }

    if (parts[0] === 'checkout') {
      const db = await getDb();
      const currentUser = getUserFromRequest(request);
      const paymentMethod = String(body.payment || 'cod');
      const record = {
        id: uuidv4(),
        orderNumber: 'INX-' + Math.floor(100000 + Math.random() * 900000),
        items: Array.isArray(body.items) ? body.items : [],
        customer: body.customer || {},
        subtotal: Number(body.subtotal || 0),
        shipping: Number(body.shipping || 0),
        total: Number(body.total || 0),
        payment: paymentMethod,
        status: 'placed',
        paymentStatus: paymentMethod === 'cod' ? 'pending_cod' : 'created',
        userId: currentUser?.userId || null,
        createdAt: new Date().toISOString(),
      };
      if (!record.customer.email || record.items.length === 0) return json({ error: 'Cart is empty or missing info' }, 400);

      // Razorpay branch
      if (paymentMethod === 'razorpay') {
        if (!razorpayEnabled()) return json({ error: 'Online payments are not configured yet. Please use Cash on Delivery.' }, 503);
        try {
          const rzp = getRazorpay();
          const rzpOrder = await rzp.orders.create({
            amount: Math.max(100, Math.round(record.total * 100)),
            currency: 'INR',
            receipt: record.orderNumber,
            notes: { orderId: record.id, orderNumber: record.orderNumber, customerEmail: record.customer.email },
          });
          record.razorpayOrderId = rzpOrder.id;
          if (db) { await db.collection('orders').insertOne(record); await log(db, 'order.placed', { orderNumber: record.orderNumber, total: record.total, payment: 'razorpay' }); }
          return json({
            ok: true, gateway: 'razorpay',
            orderId: record.id, orderNumber: record.orderNumber,
            razorpayOrderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
          });
        } catch (e) {
          return json({ error: 'Could not initiate payment: ' + e.message }, 500);
        }
      }

      // COD branch
      if (db) {
        await db.collection('orders').insertOne(record);
        await log(db, 'order.placed', { orderNumber: record.orderNumber, total: record.total, userId: record.userId });
        sendOrderEmail(record).catch(() => {});
      }
      return json({ ok: true, gateway: 'cod', id: record.id, orderNumber: record.orderNumber });
    }

    // ADMIN ------------------------------------------------------------------
    if (parts[0] === 'admin' && parts[1] === 'login') {
      const email = String(body.email || '').toLowerCase();
      const password = String(body.password || '');
      const expEmail = (process.env.ADMIN_EMAIL || 'admin@inclex.com').toLowerCase();
      const expPwd = process.env.ADMIN_PASSWORD || 'inclex2025';
      if (email !== expEmail || password !== expPwd) return json({ error: 'Invalid credentials' }, 401);
      const token = signToken({ email, role: 'super_admin' });
      const res = NextResponse.json({ ok: true, admin: { email, role: 'super_admin' } }, { status: 200, headers: cors });
      res.headers.append('Set-Cookie', `inclex_admin=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 12}`);
      const db = await getDb();
      await log(db, 'admin.login', { email });
      return res;
    }
    if (parts[0] === 'admin' && parts[1] === 'logout') {
      const res = NextResponse.json({ ok: true }, { status: 200, headers: cors });
      res.headers.append('Set-Cookie', `inclex_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
      return res;
    }

    const admin = getAdminFromRequest(request);
    if (parts[0] === 'admin' && !admin) return json({ error: 'Unauthorized' }, 401);

    const db = await getDb();

    if (parts[0] === 'admin' && parts[1] === 'products') {
      const now = new Date().toISOString();
      const record = {
        id: body.id || uuidv4(),
        slug: body.slug || (body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        name: body.name || 'Untitled',
        subtitle: body.subtitle || '',
        price: Number(body.price || 0),
        compareAt: Number(body.compareAt || 0) || null,
        currency: 'INR',
        rating: Number(body.rating || 4.5),
        reviews: Number(body.reviews || 0),
        badges: Array.isArray(body.badges) ? body.badges : (body.badges ? String(body.badges).split(',').map(s => s.trim()) : []),
        material: body.material || 'Leather',
        colors: Array.isArray(body.colors) ? body.colors : (body.colors ? String(body.colors).split(',').map(s => s.trim()) : ['Black']),
        features: Array.isArray(body.features) ? body.features : (body.features ? String(body.features).split(',').map(s => s.trim()) : []),
        description: body.description || '',
        highlights: Array.isArray(body.highlights) ? body.highlights : [],
        images: Array.isArray(body.images) ? body.images.filter(Boolean) : (body.images ? String(body.images).split('\n').map(s => s.trim()).filter(Boolean) : []),
        status: body.status || 'published',
        featured: !!body.featured,
        stock: Number(body.stock ?? 42),
        sku: body.sku || '',
        seoTitle: body.seoTitle || '',
        seoDescription: body.seoDescription || '',
        createdAt: body.createdAt || now,
        updatedAt: now,
      };
      if (db) {
        if (db) await ensureSeed(db);
        await db.collection('products').updateOne({ id: record.id }, { $set: record }, { upsert: true });
        await log(db, 'product.upsert', { id: record.id, name: record.name });
      }
      return json({ ok: true, product: record });
    }

    if (parts[0] === 'admin' && parts[1] === 'coupons') {
      const now = new Date().toISOString();
      const record = {
        id: body.id || uuidv4(),
        code: String(body.code || '').toUpperCase(),
        type: body.type || 'percent',
        value: Number(body.value || 0),
        active: body.active !== false,
        startsAt: body.startsAt || now,
        endsAt: body.endsAt || null,
        maxUses: Number(body.maxUses || 0) || null,
        perCustomer: Number(body.perCustomer || 0) || null,
        minOrder: Number(body.minOrder || 0) || null,
        maxDiscount: Number(body.maxDiscount || 0) || null,
        appliesTo: body.appliesTo || 'all',
        description: body.description || '',
        createdAt: body.createdAt || now,
      };
      if (!record.code) return json({ error: 'Code is required' }, 400);
      if (db) { await db.collection('coupons').updateOne({ id: record.id }, { $set: record }, { upsert: true }); await log(db, 'coupon.upsert', { code: record.code }); }
      return json({ ok: true, coupon: record });
    }

    if (parts[0] === 'admin' && parts[1] === 'orders' && parts[2] && parts[3] === 'status') {
      const status = body.status;
      if (!status) return json({ error: 'Status required' }, 400);
      if (db) { await db.collection('orders').updateOne({ id: parts[2] }, { $set: { status, updatedAt: new Date().toISOString() } }); await log(db, 'order.status', { id: parts[2], status }); }
      return json({ ok: true });
    }

    if (parts[0] === 'admin' && parts[1] === 'content' && parts[2] === 'homepage') {
      if (db) { await db.collection('content').updateOne({ key: 'homepage' }, { $set: { key: 'homepage', value: body, updatedAt: new Date().toISOString() } }, { upsert: true }); await log(db, 'cms.homepage', {}); }
      return json({ ok: true });
    }

    if (parts[0] === 'admin' && parts[1] === 'settings') {
      if (db) { await db.collection('content').updateOne({ key: 'settings' }, { $set: { key: 'settings', value: body, updatedAt: new Date().toISOString() } }, { upsert: true }); await log(db, 'settings.update', {}); }
      return json({ ok: true });
    }

    if (parts[0] === 'admin' && parts[1] === 'media') {
      const rec = { id: uuidv4(), url: body.url || '', name: body.name || 'Untitled', kind: body.kind || 'image', tags: body.tags || [], createdAt: new Date().toISOString() };
      if (!rec.url) return json({ error: 'URL required' }, 400);
      if (db) { await db.collection('media').insertOne(rec); await log(db, 'media.upload', { name: rec.name }); }
      return json({ ok: true, media: rec });
    }

    return json({ error: 'Not found' }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

export async function DELETE(request) {
  const { parts } = route(request);
  try {
    const admin = getAdminFromRequest(request);
    if (parts[0] === 'admin' && !admin) return json({ error: 'Unauthorized' }, 401);
    const db = await getDb();

    if (parts[0] === 'admin' && parts[1] === 'products' && parts[2]) {
      if (db) { await db.collection('products').deleteOne({ id: parts[2] }); await log(db, 'product.delete', { id: parts[2] }); }
      return json({ ok: true });
    }
    if (parts[0] === 'admin' && parts[1] === 'coupons' && parts[2]) {
      if (db) { await db.collection('coupons').deleteOne({ id: parts[2] }); await log(db, 'coupon.delete', { id: parts[2] }); }
      return json({ ok: true });
    }
    if (parts[0] === 'admin' && parts[1] === 'media' && parts[2]) {
      if (db) { await db.collection('media').deleteOne({ id: parts[2] }); await log(db, 'media.delete', { id: parts[2] }); }
      return json({ ok: true });
    }
    return json({ error: 'Not found' }, 404);
  } catch (e) {
    return json({ error: e.message }, 500);
  }
}

function defaultHomepage() {
  return {
    heroEyebrow: 'Premium Keychains',
    heroHeading: 'Carry More Than Keys.',
    heroSubtitle: 'Crafted to last. Designed to be remembered.',
    heroPrimaryCta: 'Explore Collection',
    heroPrimaryHref: '/shop',
    heroSecondaryCta: 'Customize Yours',
    heroSecondaryHref: '/customize',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-craftsman-working-on-a-leather-belt-45735-large.mp4',
    heroPoster: 'https://images.pexels.com/photos/33242820/pexels-photo-33242820.jpeg?auto=compress&cs=tinysrgb&w=2400&q=85',
    experienceEyebrow: 'Experience Inclex',
    experienceHeading: 'Crafted With Purpose',
    experienceSubtitle: 'Every detail is designed with intention. Watch how Inclex comes to life.',
    experienceVideo: 'https://assets.mixkit.co/videos/preview/mixkit-craftsman-hitting-a-leather-piece-with-a-hammer-45737-large.mp4',
    customizeHeading: 'Customize Your Keychain',
    customizeSubtitle: 'Add your name, initials or logo and create something truly yours.',
    newsletterHeading: 'Stay Updated',
    newsletterSubtitle: 'New arrivals, exclusive offers and more.',
    announcementBar: 'FREE SHIPPING on all orders above ₹499',
    couponBanner: 'Use code: INCLEX10 for 10% OFF on your first order',
  };
}

function defaultSettings() {
  return {
    siteName: 'Inclex',
    tagline: 'Crafted to last. Designed to be remembered.',
    currency: 'INR',
    language: 'en',
    timezone: 'Asia/Kolkata',
    supportEmail: 'support@inclex.com',
    supportPhone: '+91 98765 43210',
    address: '12/B, Indiranagar, Bengaluru 560038, IN',
    social: { instagram: '', facebook: '', youtube: '', x: '', linkedin: '' },
    payments: { razorpay: false, stripe: false, cod: true },
    shipping: { freeAbove: 499, flat: 49 },
  };
}
