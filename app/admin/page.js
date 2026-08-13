"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  PackageCheck,
  PackageX,
  PackageOpen,
  Percent,
  PlusCircle,
  Ticket,
  Megaphone,
  Home,
  ImageIcon,
  Rocket,
  Activity,
  Mail,
  Building2,
} from "lucide-react";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n || 0);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/admin/dashboard");
      const j = await r.json();
      setData(j);
      setLoading(false);
    })();
  }, []);

  const kpi = data?.kpi || {};

  return (
    <AdminShell title="Dashboard" subtitle="Real-time business overview">
      {loading && <div className="text-sm text-neutral-500">Loading…</div>}
      {!loading && (
        <>
          {/* Quick Actions */}
          <section className="mb-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <QuickAction
              icon={PlusCircle}
              label="Add Product"
              href="/admin/products/new"
              primary
            />
            <QuickAction
              icon={Ticket}
              label="Create Coupon"
              href="/admin/coupons"
            />
            <QuickAction
              icon={Megaphone}
              label="New Campaign"
              href="/admin/campaigns"
            />
            <QuickAction
              icon={ImageIcon}
              label="Hero Banner"
              href="/admin/banners"
            />
            <QuickAction
              icon={Home}
              label="Publish Homepage"
              href="/admin/cms/homepage"
            />
            <QuickAction
              icon={Rocket}
              label="Launch Product"
              href="/admin/launch-control"
            />
          </section>

          {/* KPI Row 1 */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={IndianRupee}
              label="Total Revenue"
              value={`₹${fmt(kpi.totalRevenue)}`}
              delta="+12.4%"
              positive
            />
            <Stat
              icon={ShoppingBag}
              label="Total Orders"
              value={fmt(kpi.totalOrders)}
              delta="+8.1%"
              positive
            />
            <Stat
              icon={Users}
              label="Total Customers"
              value={fmt(kpi.totalCustomers)}
              delta="+5.6%"
              positive
            />
            <Stat
              icon={Package}
              label="Total Products"
              value={fmt(kpi.totalProducts)}
              delta={`${kpi.activeProducts || 0} active`}
            />
          </section>

          {/* KPI Row 2 */}
          <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={TrendingUp}
              label="Avg. Order Value"
              value={`₹${fmt(kpi.aov)}`}
            />
            <Stat
              icon={Percent}
              label="Conversion Rate"
              value="3.4%"
              delta="vs 2.9% last mo"
              positive
            />
            <Stat
              icon={PackageOpen}
              label="Pending Orders"
              value={fmt(kpi.pendingOrders)}
            />
            <Stat
              icon={PackageCheck}
              label="Completed"
              value={fmt(kpi.completedOrders)}
            />
          </section>

          {/* KPI Row 3 */}
          <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={PackageX}
              label="Low Stock"
              value={fmt(kpi.lowStock)}
              warn
            />
            <Stat
              icon={PackageX}
              label="Out of Stock"
              value={fmt(kpi.outOfStock)}
              warn
            />
            <Stat
              icon={Mail}
              label="Newsletter Subs"
              value={fmt(kpi.subscribers)}
            />
            <Stat
              icon={Building2}
              label="Corporate Inquiries"
              value={fmt(kpi.corporateInquiries)}
            />
          </section>

          {/* Chart + Best Sellers */}
          <section className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-sm border border-black/10 bg-white p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    Revenue — Last 14 days
                  </div>
                  <div className="mt-1 font-serif text-3xl">
                    ₹
                    {fmt(
                      (data?.daily || []).reduce((s, d) => s + d.revenue, 0),
                    )}
                  </div>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#C9A227]">
                  Live
                </div>
              </div>
              <Chart data={data?.daily || []} />
            </div>

            <div className="rounded-sm border border-black/10 bg-white p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                Best Selling
              </div>
              <ul className="mt-4 space-y-3">
                {(data?.bestSelling || []).length === 0 && (
                  <li className="text-sm text-neutral-500">No sales yet</li>
                )}
                {(data?.bestSelling || []).map((b, i) => (
                  <li
                    key={b.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-sm bg-[#F8F7F4] text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium">{b.name}</span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {b.qty} sold
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Latest orders + Activity */}
          <section className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-sm border border-black/10 bg-white lg:col-span-2">
              <div className="flex items-center justify-between p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  Latest Orders
                </div>
                <Link
                  href="/admin/orders"
                  className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                    <tr>
                      <th className="px-5 py-3 text-left">Order</th>
                      <th className="px-5 py-3 text-left">Customer</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.latestOrders || []).length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-5 py-8 text-center text-neutral-500"
                        >
                          No orders yet
                        </td>
                      </tr>
                    )}
                    {(data?.latestOrders || []).map((o) => (
                      <tr key={o.id} className="border-t border-black/[0.06]">
                        <td className="px-5 py-3 font-mono text-xs">
                          {o.orderNumber}
                        </td>
                        <td className="px-5 py-3">
                          <div className="font-medium">
                            {o.customer?.name || "—"}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {o.customer?.email}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={o.status || "placed"} />
                        </td>
                        <td className="px-5 py-3 text-right font-medium">
                          ₹{fmt(o.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-sm border border-black/10 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  Activity Timeline
                </div>
                <Link
                  href="/admin/activity"
                  className="text-xs text-neutral-600 hover:text-black"
                >
                  All →
                </Link>
              </div>
              <ul className="mt-4 space-y-4">
                {(data?.activity || []).length === 0 && (
                  <li className="text-sm text-neutral-500">No activity yet</li>
                )}
                {(data?.activity || []).map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-[#C9A227]/15 text-[10px] text-[#8B6E12]">
                      <Activity className="h-3 w-3" />
                    </span>
                    <div>
                      <div className="text-sm">{a.action}</div>
                      <div className="text-[11px] text-neutral-500">
                        {new Date(a.at).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </AdminShell>
  );
}

function Stat({ icon: Icon, label, value, delta, positive, warn }) {
  return (
    <div className="rounded-sm border border-black/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.16em] text-neutral-500">
          {label}
        </span>
        <span
          className={`grid h-8 w-8 place-items-center rounded-sm ${warn ? "bg-red-50 text-red-600" : "bg-[#F8F7F4] text-[#C9A227]"}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 font-serif text-3xl">{value}</div>
      {delta && (
        <div
          className={`mt-1 text-xs ${positive ? "text-emerald-600" : "text-neutral-500"}`}
        >
          {delta}
        </div>
      )}
    </div>
  );
}

function QuickAction({ icon: Icon, label, href, primary }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-sm border p-4 transition ${primary ? "border-transparent bg-black text-white hover:bg-neutral-900" : "border-black/10 bg-white hover:border-[#C9A227]"}`}
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-sm ${primary ? "bg-white/10 text-[#C9A227]" : "bg-[#F8F7F4] text-[#C9A227]"}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

function StatusBadge({ status }) {
  const map = {
    placed: "bg-blue-50 text-blue-700",
    confirmed: "bg-indigo-50 text-indigo-700",
    packed: "bg-purple-50 text-purple-700",
    shipped: "bg-amber-50 text-amber-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-neutral-100 text-neutral-600",
    returned: "bg-rose-50 text-rose-700",
    refunded: "bg-rose-50 text-rose-700",
  };
  return (
    <span
      className={`inline-flex rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${map[status] || "bg-neutral-100 text-neutral-700"}`}
    >
      {status}
    </span>
  );
}

function Chart({ data }) {
  if (!data || data.length === 0)
    return (
      <div className="mt-6 h-52 grid place-items-center text-sm text-neutral-500">
        No data yet — place an order to see revenue.
      </div>
    );
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const W = 800,
    H = 200,
    P = 20;
  const step = (W - P * 2) / Math.max(data.length - 1, 1);
  const pts = data.map((d, i) => [
    P + i * step,
    H - P - (d.revenue / max) * (H - P * 2),
  ]);
  const path = pts
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(" ");
  const area = `${path} L${pts[pts.length - 1][0]},${H - P} L${pts[0][0]},${H - P} Z`;
  return (
    <div className="mt-4 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-52 w-full">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#g)" />
        <path d={path} fill="none" stroke="#C9A227" strokeWidth="2" />
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#111" />
        ))}
      </svg>
    </div>
  );
}
