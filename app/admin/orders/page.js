"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, Eye, ArrowRight } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

const fmt = (n) => new Intl.NumberFormat("en-IN").format(n || 0);
const STATUSES = [
  "payment_pending",
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const [shippingOrder, setShippingOrder] = useState(null);
  const [shippingForm, setShippingForm] = useState({
    courier: "",
    trackingNumber: "",
    trackingUrl: "",
  });

  const [actionOrder, setActionOrder] = useState(null);
  const [actionStatus, setActionStatus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [actionForm, setActionForm] = useState({
    cancellationReason: "",
    returnNote: "",
    refundAmount: "",
    refundReference: "",
  });

  const [emailNotifications, setEmailNotifications] = useState([]);
  const [emailNotificationsLoading, setEmailNotificationsLoading] =
    useState(false);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/orders");
    const j = await r.json();
    setOrders(j.orders || []);
    setLoading(false);
  };

  const loadEmailNotifications = async (orderId) => {
    if (!orderId) return;

    setEmailNotificationsLoading(true);

    try {
      const r = await fetch(`/api/admin/orders/${orderId}/notifications`);

      const data = await r.json();

      if (r.ok) {
        setEmailNotifications(data.notifications || []);
      } else {
        setEmailNotifications([]);
      }
    } catch (error) {
      console.error("Failed to load email notifications:", error);

      setEmailNotifications([]);
    } finally {
      setEmailNotificationsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status, extra = {}) {
    try {
      setActionLoading(true);

      const r = await fetch(`/api/admin/orders/${id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          ...extra,
        }),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        toast.error(data.error || "Could not update order status");
        return false;
      }

      if (data.unchanged) {
        toast.info(`Order is already ${status}`);
        return true;
      }

      if (data.email?.sent) {
        toast.success(`Order → ${status}. Customer email sent.`);
      } else if (data.email?.skipped) {
        toast.success(`Order → ${status}. Email was skipped.`);
      } else if (data.email?.error) {
        toast.warning(`Order → ${status}, but the email could not be sent.`);
      } else {
        toast.success(`Status → ${status}`);
      }

      await load();

      if (active?.id === id) {
        const updated = data.order;

        if (updated) {
          setActive(updated);
        }

        await loadEmailNotifications(id);
      }

      return true;
    } catch (error) {
      console.error("Order status update error:", error);
      toast.error("Something went wrong while updating the order");
      return false;
    } finally {
      setActionLoading(false);
    }
  }

  function handleStatusChange(order, status) {
    if (status === order.status) {
      return;
    }

    if (status === "shipped") {
      setShippingOrder(order);

      setShippingForm({
        courier: order.shipping?.courier || "",
        trackingNumber: order.shipping?.trackingNumber || "",
        trackingUrl: order.shipping?.trackingUrl || "",
      });

      return;
    }

    if (
      status === "cancelled" ||
      status === "returned" ||
      status === "refunded"
    ) {
      setActionOrder(order);
      setActionStatus(status);

      setActionForm({
        cancellationReason: order.cancellationReason || "",
        returnNote: order.returnNote || "",
        refundAmount:
          order.refundAmount != null
            ? String(order.refundAmount)
            : String(order.total || ""),
        refundReference: order.refundReference || "",
      });

      return;
    }

    updateStatus(order.id, status);
  }

  async function submitShipping() {
    if (!shippingOrder) return;

    const courier = shippingForm.courier.trim();
    const trackingNumber = shippingForm.trackingNumber.trim();
    const trackingUrl = shippingForm.trackingUrl.trim();

    if (!courier) {
      toast.error("Please enter the courier name");
      return;
    }

    if (!trackingNumber) {
      toast.error("Please enter the tracking number");
      return;
    }

    if (!trackingUrl) {
      toast.error("Please enter the tracking URL");
      return;
    }

    try {
      new URL(trackingUrl);
    } catch {
      toast.error("Please enter a valid tracking URL");
      return;
    }

    const success = await updateStatus(shippingOrder.id, "shipped", {
      courier,
      trackingNumber,
      trackingUrl,
    });

    if (success) {
      setShippingOrder(null);

      setShippingForm({
        courier: "",
        trackingNumber: "",
        trackingUrl: "",
      });
    }
  }

  async function submitAction() {
    if (!actionOrder || !actionStatus) return;

    const extra = {};

    if (actionStatus === "cancelled") {
      const reason = actionForm.cancellationReason.trim();

      if (!reason) {
        toast.error("Please enter a cancellation reason");
        return;
      }

      extra.cancellationReason = reason;
    }

    if (actionStatus === "returned") {
      const note = actionForm.returnNote.trim();

      if (note) {
        extra.returnNote = note;
      }
    }

    if (actionStatus === "refunded") {
      const amount = Number(actionForm.refundAmount);

      if (!Number.isFinite(amount) || amount < 0) {
        toast.error("Please enter a valid refund amount");
        return;
      }

      if (amount > Number(actionOrder.total || 0)) {
        toast.error("Refund amount cannot exceed the order total");
        return;
      }

      extra.refundAmount = amount;

      const reference = actionForm.refundReference.trim();

      if (reference) {
        extra.refundReference = reference;
      }
    }

    const success = await updateStatus(actionOrder.id, actionStatus, extra);

    if (success) {
      setActionOrder(null);
      setActionStatus("");

      setActionForm({
        cancellationReason: "",
        returnNote: "",
        refundAmount: "",
        refundReference: "",
      });
    }
  }

  const filtered = orders.filter(
    (o) =>
      (
        o.orderNumber +
        " " +
        (o.customer?.email || "") +
        " " +
        (o.customer?.name || "")
      )
        .toLowerCase()
        .includes(q.toLowerCase()) &&
      (filter === "all" || o.status === filter),
  );

  return (
    <AdminShell title="Orders" subtitle={`${orders.length} total`}>
      <div className="rounded-sm border border-black/10 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search order # or customer…"
              className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["all", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-sm px-3 py-1.5 text-xs uppercase tracking-[0.14em] ${filter === s ? "bg-black text-white" : "border border-black/10 bg-white"}`}
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
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-neutral-500"
                  >
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-neutral-500"
                  >
                    No orders
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-black/[0.06]">
                  <td className="px-4 py-3 font-mono text-xs">
                    {o.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.customer?.name}</div>
                    <div className="text-xs text-neutral-500">
                      {o.customer?.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 uppercase text-xs">{o.payment}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    ₹{fmt(o.total)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o, e.target.value)}
                      className="rounded-sm border border-black/10 bg-white px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setActive(o);
                        loadEmailNotifications(o.id);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-sm hover:bg-black/5"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex"
          onClick={() => {
            setActive(null);
            setEmailNotifications([]);
          }}
        >
          <div className="flex-1 bg-black/50" />
          <aside
            className="w-full max-w-lg overflow-y-auto bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Order
                </div>
                <div className="font-serif text-2xl">{active.orderNumber}</div>
              </div>
              <button
                onClick={() => {
                  setActive(null);
                  setEmailNotifications([]);
                }}
                className="text-neutral-400"
              >
                Close
              </button>
            </div>

            <div className="mt-6 rounded-sm border border-black/10 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                Customer
              </div>
              <div className="mt-2 text-sm">
                <b>{active.customer?.name}</b>
                <br />
                {active.customer?.email}
                <br />
                {active.customer?.phone}
                <br />
                {active.customer?.address}, {active.customer?.city}{" "}
                {active.customer?.pincode}, {active.customer?.state}
              </div>
            </div>

            <div className="mt-4 rounded-sm border border-black/10">
              <div className="border-b border-black/[0.06] p-4 text-xs uppercase tracking-[0.18em] text-neutral-500">
                Items
              </div>
              <ul className="divide-y divide-black/[0.06]">
                {(active.items || []).map((it) => (
                  <li
                    key={it.key || it.id}
                    className="flex items-center gap-3 p-4"
                  >
                    <img
                      src={it.image}
                      alt=""
                      className="h-14 w-14 rounded-sm object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{it.name}</div>
                      <div className="text-xs text-neutral-500">
                        {it.color}
                        {it.engraving ? ` • “${it.engraving}”` : ""} × {it.qty}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{fmt(it.price * it.qty)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="space-y-1 border-t border-black/[0.06] p-4 text-sm">
                <Row label="Subtotal" value={`₹${fmt(active.subtotal)}`} />
                <Row
                  label="Shipping"
                  value={active.shipping ? `₹${fmt(active.shipping)}` : "Free"}
                />
                <div className="mt-2 flex items-center justify-between border-t border-black/[0.06] pt-3 text-base">
                  <span className="font-serif">Total</span>
                  <span className="font-serif text-xl">
                    ₹{fmt(active.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Email notification history */}
            <div className="mt-6 rounded-sm border border-black/10">
              <div className="border-b border-black/[0.06] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  Email History
                </div>

                <div className="mt-1 text-xs text-neutral-400">
                  Customer notifications for this order
                </div>
              </div>

              <div className="p-4">
                {emailNotificationsLoading ? (
                  <div className="py-4 text-center text-xs text-neutral-500">
                    Loading email history…
                  </div>
                ) : emailNotifications.length === 0 ? (
                  <div className="py-4 text-center text-xs text-neutral-500">
                    No email notifications recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {emailNotifications.map((notification) => {
                      const isSent = notification.status === "sent";

                      const isSkipped = notification.status === "skipped";

                      const isFailed = notification.status === "failed";

                      const type = String(notification.type || "")
                        .replace(/^order_/, "")
                        .replace(/_/g, " ");

                      return (
                        <div
                          key={notification.id}
                          className="flex items-start gap-3"
                        >
                          <div
                            className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${
                              isSent
                                ? "bg-green-50 text-green-700"
                                : isSkipped
                                  ? "bg-yellow-50 text-yellow-700"
                                  : "bg-red-50 text-red-700"
                            }`}
                          >
                            {isSent ? "✓" : isSkipped ? "–" : "✕"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="text-sm font-medium capitalize">
                                {type}
                              </div>

                              <div className="text-[10px] text-neutral-400">
                                {notification.createdAt
                                  ? new Date(
                                      notification.createdAt,
                                    ).toLocaleString("en-IN")
                                  : ""}
                              </div>
                            </div>

                            <div className="mt-1 text-xs text-neutral-500">
                              {notification.recipient ||
                                active?.customer?.email}
                            </div>

                            {isFailed && notification.error && (
                              <div className="mt-1 text-xs text-red-600">
                                {notification.error}
                              </div>
                            )}

                            {isSkipped && (
                              <div className="mt-1 text-xs text-yellow-700">
                                Email was skipped because email delivery is not
                                configured.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {["confirmed", "packed", "shipped", "delivered"].map((s) => (
                <button
                  key={s}
                  disabled={actionLoading}
                  onClick={() => handleStatusChange(active, s)}
                  className="inline-flex items-center gap-1 rounded-sm border border-black/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Mark {s}
                  <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Shipping modal */}
      {shippingOrder && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            if (!actionLoading) {
              setShippingOrder(null);
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-sm bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  Ship Order
                </div>

                <div className="mt-1 font-serif text-2xl">
                  {shippingOrder.orderNumber}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShippingOrder(null)}
                disabled={actionLoading}
                className="text-sm text-neutral-400 hover:text-black disabled:opacity-50"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-neutral-500">
                  Courier
                </label>

                <input
                  value={shippingForm.courier}
                  onChange={(e) =>
                    setShippingForm((prev) => ({
                      ...prev,
                      courier: e.target.value,
                    }))
                  }
                  placeholder="e.g. Delhivery"
                  className="w-full rounded-sm border border-black/10 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-neutral-500">
                  Tracking Number
                </label>

                <input
                  value={shippingForm.trackingNumber}
                  onChange={(e) =>
                    setShippingForm((prev) => ({
                      ...prev,
                      trackingNumber: e.target.value,
                    }))
                  }
                  placeholder="e.g. 1234567890"
                  className="w-full rounded-sm border border-black/10 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-neutral-500">
                  Tracking URL
                </label>

                <input
                  type="url"
                  value={shippingForm.trackingUrl}
                  onChange={(e) =>
                    setShippingForm((prev) => ({
                      ...prev,
                      trackingUrl: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full rounded-sm border border-black/10 px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShippingOrder(null)}
                disabled={actionLoading}
                className="rounded-sm border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.14em] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitShipping}
                disabled={actionLoading}
                className="rounded-sm bg-black px-5 py-2 text-xs uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? "Shipping..." : "Ship Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation / Return / Refund modal */}
      {actionOrder && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            if (!actionLoading) {
              setActionOrder(null);
              setActionStatus("");
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-sm bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  {actionStatus === "cancelled"
                    ? "Cancel Order"
                    : actionStatus === "returned"
                      ? "Return Order"
                      : "Process Refund"}
                </div>

                <div className="mt-1 font-serif text-2xl">
                  {actionOrder.orderNumber}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!actionLoading) {
                    setActionOrder(null);
                    setActionStatus("");
                  }
                }}
                disabled={actionLoading}
                className="text-sm text-neutral-400 hover:text-black disabled:opacity-50"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {/* Cancellation */}
              {actionStatus === "cancelled" && (
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-neutral-500">
                    Cancellation Reason
                  </label>

                  <textarea
                    value={actionForm.cancellationReason}
                    onChange={(e) =>
                      setActionForm((prev) => ({
                        ...prev,
                        cancellationReason: e.target.value,
                      }))
                    }
                    placeholder="Why is this order being cancelled?"
                    rows={4}
                    className="w-full resize-none rounded-sm border border-black/10 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
              )}

              {/* Return */}
              {actionStatus === "returned" && (
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-neutral-500">
                    Return Note
                  </label>

                  <textarea
                    value={actionForm.returnNote}
                    onChange={(e) =>
                      setActionForm((prev) => ({
                        ...prev,
                        returnNote: e.target.value,
                      }))
                    }
                    placeholder="Add a note about this return..."
                    rows={4}
                    className="w-full resize-none rounded-sm border border-black/10 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
              )}

              {/* Refund */}
              {actionStatus === "refunded" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-neutral-500">
                      Refund Amount
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        max={actionOrder.total || 0}
                        step="1"
                        value={actionForm.refundAmount}
                        onChange={(e) =>
                          setActionForm((prev) => ({
                            ...prev,
                            refundAmount: e.target.value,
                          }))
                        }
                        className="w-full rounded-sm border border-black/10 py-2 pl-8 pr-3 text-sm outline-none focus:border-black"
                      />
                    </div>

                    <div className="mt-1 text-xs text-neutral-500">
                      Maximum refund: ₹{fmt(actionOrder.total)}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-neutral-500">
                      Refund Reference
                    </label>

                    <input
                      value={actionForm.refundReference}
                      onChange={(e) =>
                        setActionForm((prev) => ({
                          ...prev,
                          refundReference: e.target.value,
                        }))
                      }
                      placeholder="e.g. RZP-REF-123456"
                      className="w-full rounded-sm border border-black/10 px-3 py-2 text-sm outline-none focus:border-black"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setActionOrder(null);
                  setActionStatus("");
                }}
                disabled={actionLoading}
                className="rounded-sm border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.14em] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitAction}
                disabled={actionLoading}
                className="rounded-sm bg-black px-5 py-2 text-xs uppercase tracking-[0.14em] text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Processing..."
                  : actionStatus === "cancelled"
                    ? "Cancel Order"
                    : actionStatus === "returned"
                      ? "Mark Returned"
                      : "Mark Refunded"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-neutral-500">{label}</span>
      <span className="text-neutral-800">{value}</span>
    </div>
  );
}
