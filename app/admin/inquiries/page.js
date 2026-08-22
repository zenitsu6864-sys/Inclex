"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { X, Send, Mail, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function InquiriesPage() {
  const [data, setData] = useState({
    contacts: [],
    corporate: [],
    customizations: [],
  });

  const [tab, setTab] = useState("contact");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  async function loadInquiries() {
    try {
      const r = await fetch("/api/admin/inquiries", {
        cache: "no-store",
      });

      const j = await r.json();

      if (!r.ok) {
        throw new Error(j.error || "Failed to load inquiries");
      }

      setData(j);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  const tabs = [
    {
      id: "contact",
      label: "Contact",
      data: data.contacts,
    },
    {
      id: "corporate",
      label: "Corporate",
      data: data.corporate,
    },
    {
      id: "customize",
      label: "Customizations",
      data: data.customizations,
    },
  ];

  const active = tabs.find((t) => t.id === tab);

  return (
    <AdminShell
      title="Inquiries"
      subtitle={`${data.contacts.length + data.corporate.length + data.customizations.length} messages`}
    >
      <div className="mb-4 inline-flex overflow-hidden rounded-sm border border-black/10 bg-white">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.14em] ${
              tab === t.id ? "bg-black text-white" : "hover:bg-neutral-50"
            }`}
          >
            {t.label} ({t.data.length})
          </button>
        ))}
      </div>

      <div className="rounded-sm border border-black/10 bg-white">
        {loading ? (
          <div className="p-10 text-center text-sm text-neutral-500">
            Loading…
          </div>
        ) : (
          <>
            {tab === "contact" && (
              <ContactTable rows={data.contacts} onOpen={setSelected} />
            )}

            {tab === "corporate" && <CorporateTable rows={data.corporate} />}

            {tab === "customize" && (
              <CustomizationsTable rows={data.customizations} />
            )}
          </>
        )}
      </div>

      {selected && (
        <InquiryModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onSent={async () => {
            await loadInquiries();
          }}
        />
      )}
    </AdminShell>
  );
}

function ContactTable({ rows, onOpen }) {
  if (rows.length === 0) {
    return (
      <div className="p-10 text-center text-sm text-neutral-500">
        No contact messages yet
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500">
        <tr>
          <th className="px-4 py-3 text-left">Received</th>
          <th className="px-4 py-3 text-left">From</th>
          <th className="px-4 py-3 text-left">Subject</th>
          <th className="px-4 py-3 text-left">Message</th>
          <th className="px-4 py-3 text-left">Status</th>
          <th className="px-4 py-3 text-right">Action</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r) => (
          <tr
            key={r.id}
            className="border-t border-black/[0.06] align-top hover:bg-[#FAFAF8]"
          >
            <td className="px-4 py-4 text-neutral-500 whitespace-nowrap">
              {new Date(r.createdAt).toLocaleString()}
            </td>

            <td className="px-4 py-4">
              <div className="font-medium">{r.name || "Unknown"}</div>

              <div className="text-xs text-neutral-500">{r.email}</div>
            </td>

            <td className="px-4 py-4">{r.subject || "—"}</td>

            <td className="max-w-md px-4 py-4 text-neutral-600">
              <div className="line-clamp-2">{r.message}</div>
            </td>

            <td className="px-4 py-4">
              {r.status === "replied" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] uppercase tracking-wider text-green-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Replied
                </span>
              ) : (
                <span className="rounded-full bg-yellow-50 px-2 py-1 text-[10px] uppercase tracking-wider text-yellow-700">
                  New
                </span>
              )}
            </td>

            <td className="px-4 py-4 text-right">
              <button
                onClick={() => onOpen(r)}
                className="inline-flex items-center gap-2 border border-black/10 px-3 py-2 text-xs hover:bg-black hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InquiryModal({ inquiry, onClose, onSent }) {
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  async function sendReply() {
    if (!reply.trim()) {
      toast.error("Write a reply first");
      return;
    }

    setSending(true);

    try {
      const r = await fetch(`/api/admin/inquiries/${inquiry.id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reply: reply.trim(),
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        throw new Error(data.error || "Failed to send reply");
      }

      toast.success("Reply sent", {
        description: `Email sent to ${inquiry.email}`,
      });

      setReply("");
      await onSent();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-sm bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#C9A227]">
              Customer Inquiry
            </div>

            <h2 className="mt-1 font-serif text-2xl">
              {inquiry.subject || "Contact Inquiry"}
            </h2>

            <div className="mt-1 text-sm text-neutral-500">
              {inquiry.name} · {inquiry.email}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
            <Clock className="h-3.5 w-3.5" />
            Received
          </div>

          <div className="mb-6 text-xs text-neutral-500">
            {new Date(inquiry.createdAt).toLocaleString()}
          </div>

          <div className="mb-8">
            <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Customer Message
            </div>

            <div className="whitespace-pre-wrap rounded-sm border border-black/10 bg-[#F8F7F4] p-5 text-sm leading-7 text-neutral-700">
              {inquiry.message}
            </div>
          </div>

          {inquiry.replies?.length > 0 && (
            <div className="mb-8">
              <div className="mb-3 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
                Previous Replies
              </div>

              <div className="space-y-3">
                {inquiry.replies.map((r) => (
                  <div
                    key={r.id}
                    className="border-l-2 border-[#C9A227] bg-neutral-50 p-4"
                  >
                    <div className="mb-2 text-[10px] uppercase tracking-wider text-neutral-500">
                      INCLEX Support · {new Date(r.createdAt).toLocaleString()}
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-6">
                      {r.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply */}
          <div>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              Reply to Customer
            </label>

            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={7}
              placeholder="Write your reply..."
              className="w-full resize-none rounded-sm border border-black/10 bg-white p-4 text-sm leading-6 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/10 bg-[#F8F7F4] px-6 py-4">
          <div className="text-xs text-neutral-500">
            Reply will be sent to{" "}
            <span className="font-medium text-neutral-800">
              {inquiry.email}
            </span>
          </div>

          <button
            onClick={sendReply}
            disabled={sending}
            className="inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            <Send className="h-4 w-4" />

            {sending ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CorporateTable({ rows }) {
  if (rows.length === 0)
    return (
      <div className="p-10 text-center text-sm text-neutral-500">
        No corporate inquiries yet
      </div>
    );

  return (
    <table className="w-full text-sm">
      <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500">
        <tr>
          <th className="px-4 py-3 text-left">Received</th>
          <th className="px-4 py-3 text-left">Company</th>
          <th className="px-4 py-3 text-left">Contact</th>
          <th className="px-4 py-3 text-right">Qty</th>
          <th className="px-4 py-3 text-left">Notes</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="border-t border-black/[0.06] align-top">
            <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
              {new Date(r.createdAt).toLocaleString()}
            </td>

            <td className="px-4 py-3">
              <div className="font-medium">{r.company}</div>
            </td>

            <td className="px-4 py-3">
              <div>{r.name}</div>
              <div className="text-xs text-neutral-500">
                {r.email} • {r.phone}
              </div>
            </td>

            <td className="px-4 py-3 text-right">{r.quantity}</td>

            <td className="max-w-md px-4 py-3 text-neutral-600">{r.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CustomizationsTable({ rows }) {
  if (rows.length === 0)
    return (
      <div className="p-10 text-center text-sm text-neutral-500">
        No customizations yet
      </div>
    );

  return (
    <table className="w-full text-sm">
      <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500">
        <tr>
          <th className="px-4 py-3 text-left">Created</th>
          <th className="px-4 py-3 text-left">Engraving</th>
          <th className="px-4 py-3 text-left">Material</th>
          <th className="px-4 py-3 text-left">Color</th>
          <th className="px-4 py-3 text-left">Finish</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="border-t border-black/[0.06]">
            <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
              {new Date(r.createdAt).toLocaleString()}
            </td>

            <td className="px-4 py-3 font-serif italic text-[#C9A227]">
              “{r.engraving}”
            </td>

            <td className="px-4 py-3">{r.material}</td>

            <td className="px-4 py-3">{r.color}</td>

            <td className="px-4 py-3">{r.finish}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
