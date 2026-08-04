"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  ExternalLink,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n || 0);

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

const load = async () => {
  setLoading(true);

  const r = await fetch("/api/admin/products", {
    cache: "no-store",
  });

  const j = await r.json();
  setProducts(j.products || []);

  setLoading(false);
};
  useEffect(() => {
    load();
  }, []);

  async function del(id) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    toast.success("Product deleted");
    load();
  }
  async function duplicate(p) {
    const clone = {
      ...p,
      id: undefined,
      slug: p.slug + "-copy",
      name: p.name + " (Copy)",
      status: "draft",
    };
    const r = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clone),
    });
    if (r.ok) {
      toast.success("Duplicated");
      load();
    }
  }
  async function toggleStatus(p, next) {
    const r = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, status: next }),
    });
    if (r.ok) {
      toast.success(`Marked as ${next}`);
      load();
    }
  }

  const filtered = products.filter(
    (p) =>
      (p.name + " " + p.subtitle + " " + (p.sku || ""))
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (status === "all" || p.status === status),
  );

  return (
    <AdminShell
      title="Products"
      subtitle={`${products.length} total`}
      actions={
        <Link href="/admin/products/new" className="btn-dark">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      }
    >
      <div className="rounded-sm border border-black/10 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, SKU, description…"
              className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25"
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "published", "draft", "archived"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-sm px-3 py-1.5 text-xs uppercase tracking-[0.14em] ${status === s ? "bg-black text-white" : "border border-black/10 bg-white"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Material</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-10 text-center text-neutral-500"
                  >
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-10 text-center text-neutral-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-black/[0.06]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]}
                        alt=""
                        className="h-12 w-12 rounded-sm object-cover bg-[#EFEDE7]"
                      />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-neutral-500">
                          {p.subtitle}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{p.material}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    ₹{fmt(p.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={p.stock < 10 ? "text-red-600 font-medium" : ""}
                    >
                      {fmt(p.stock ?? 42)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.status || "published"}
                      onChange={(e) => toggleStatus(p, e.target.value)}
                      className="rounded-sm border border-black/10 bg-white px-2 py-1 text-xs"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/shop/${p.slug}`}
                        target="_blank"
                        className="grid h-8 w-8 place-items-center rounded-sm hover:bg-black/5"
                        title="View"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="grid h-8 w-8 place-items-center rounded-sm hover:bg-black/5"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => duplicate(p)}
                        className="grid h-8 w-8 place-items-center rounded-sm hover:bg-black/5"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => del(p.id)}
                        className="grid h-8 w-8 place-items-center rounded-sm text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
