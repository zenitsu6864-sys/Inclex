"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/admin/settings");
      const j = await r.json();
      setS(j.settings);
    })();
  }, []);

  async function save() {
    setSaving(true);
    const r = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    setSaving(false);
    if (r.ok) toast.success("Settings saved");
    else toast.error("Failed");
  }

  if (!s)
    return (
      <AdminShell title="Settings">
        <div className="text-sm text-neutral-500">Loading…</div>
      </AdminShell>
    );

  const set = (k) => (v) => setS((x) => ({ ...x, [k]: v }));
  const setNested = (obj, k) => (v) =>
    setS((x) => ({ ...x, [obj]: { ...x[obj], [k]: v } }));

  return (
    <AdminShell
      title="Settings"
      subtitle="Store, payments, shipping, integrations"
      actions={
        <button
          onClick={save}
          disabled={saving}
          className="btn-dark !py-2 !px-4 text-xs"
        >
          <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save"}
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="General">
          <F
            label="Website Name"
            value={s.siteName}
            onChange={set("siteName")}
          />
          <F label="Tagline" value={s.tagline} onChange={set("tagline")} />
          <div className="grid grid-cols-3 gap-4">
            <F label="Currency" value={s.currency} onChange={set("currency")} />
            <F label="Language" value={s.language} onChange={set("language")} />
            <F label="Timezone" value={s.timezone} onChange={set("timezone")} />
          </div>
        </Panel>
        <Panel title="Support">
          <F
            label="Email"
            value={s.supportEmail}
            onChange={set("supportEmail")}
          />
          <F
            label="Phone"
            value={s.supportPhone}
            onChange={set("supportPhone")}
          />
          <F label="Address" value={s.address} onChange={set("address")} />
        </Panel>
        <Panel title="Social Media">
          {["instagram", "facebook", "youtube", "x", "linkedin"].map((k) => (
            <F
              key={k}
              label={k[0].toUpperCase() + k.slice(1)}
              value={s.social?.[k]}
              onChange={setNested("social", k)}
              placeholder={`https://${k}.com/inclex`}
            />
          ))}
        </Panel>
        <Panel title="Payments & Shipping">
          <div className="space-y-2">
            {[
              ["razorpay", "Razorpay"],
              ["stripe", "Stripe"],
              ["cod", "Cash on Delivery"],
            ].map(([k, l]) => (
              <label key={k} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!s.payments?.[k]}
                  onChange={(e) => setNested("payments", k)(e.target.checked)}
                  className="h-4 w-4 accent-[#C9A227]"
                />
                {l}
              </label>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <F
              label="Free Shipping Above (₹)"
              type="number"
              value={s.shipping?.freeAbove}
              onChange={setNested("shipping", "freeAbove")}
            />
            <F
              label="Flat Shipping Charge (₹)"
              type="number"
              value={s.shipping?.flat}
              onChange={setNested("shipping", "flat")}
            />
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-sm border border-black/10 bg-white p-6">
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em]">
        {title}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function F({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25"
      />
    </label>
  );
}
