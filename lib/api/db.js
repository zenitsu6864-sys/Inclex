// Central MongoDB accessor with caching + graceful degradation.
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { PRODUCTS } from '@/lib/data/products';

const uri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME || 'inclex';

let cachedClient = null;

export async function getDb() {
  if (!uri) return null;
  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(uri);
      await cachedClient.connect();
    }
    return cachedClient.db(dbName);
  } catch { return null; }
}

export async function ensureSeed(db) {
  if (!db) return;
  const col = db.collection('products');
  const count = await col.countDocuments();
  if (count === 0) {
    await col.insertMany(PRODUCTS.map(p => ({
      ...p, status: 'published',
      featured: p.badges.includes('Best Seller'),
      stock: 42,
      createdAt: new Date().toISOString(),
    })));
  }
}

export async function activityLog(db, action, meta = {}) {
  if (!db) return;
  try {
    await db.collection('activity_logs').insertOne({
      id: uuidv4(), action, meta, at: new Date().toISOString(),
    });
  } catch {}
}

// import dns from "dns";
// import { MongoClient } from "mongodb";
// import { v4 as uuidv4 } from "uuid";

// import { PRODUCTS } from "@/lib/data/products";

// // Use public DNS resolvers for MongoDB SRV resolution.
// // Required for local development when the system DNS refuses SRV queries.
// dns.setServers(["8.8.8.8", "1.1.1.1"]);

// const uri = process.env.MONGO_URL;
// const dbName = process.env.DB_NAME || "inclex";

// let cachedClient = null;

// export async function getDb() {
//   if (!uri) return null;

//   try {
//     if (!cachedClient) {
//       cachedClient = new MongoClient(uri);
//       await cachedClient.connect();
//     }

//     return cachedClient.db(dbName);
//   } catch (err) {
//     console.error("MongoDB connection error:", err);

//     cachedClient = null;

//     return null;
//   }
// }

// export async function ensureSeed(db) {
//   if (!db) return;

//   const col = db.collection("products");

//   const count = await col.countDocuments();

//   if (count === 0) {
//     await col.insertMany(
//       PRODUCTS.map((p) => ({
//         ...p,
//         status: "published",
//         featured: p.badges.includes("Best Seller"),
//         stock: 42,
//         createdAt: new Date().toISOString(),
//       }))
//     );
//   }
// }

// export async function activityLog(db, action, meta = {}) {
//   if (!db) return;

//   try {
//     await db.collection("activity_logs").insertOne({
//       id: uuidv4(),
//       action,
//       meta,
//       at: new Date().toISOString(),
//     });
//   } catch {}
// }