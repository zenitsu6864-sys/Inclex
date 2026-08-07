"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (data.ok) {
        toast.success("Message sent", {
          description: "We’ll get back within 24 hours.",
        });
        setDone(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else toast.error(data.error || "Please check the form");
    } catch {
      toast.error("Network error");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      <section className="container-editorial py-16 md:py-24">
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 md:col-span-5">
            <div className="eyebrow flex items-center gap-3">
              <span className="hairline" />
              Contact INCLEX
            </div>

            <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
              Let's Build
              {/* <br /> */}
              Something Premium.
            </h1>

            <p className="mt-5 max-w-md text-neutral-600">
              Whether you have a product inquiry, business proposal, wholesale
              request, customization idea, or need customer support, our team is
              here to help. We aim to respond within one business day.
            </p>

            <ul className="mt-10 space-y-5">
              <ContactRow
                icon={MapPin}
                title="Company"
                body={"INCLEX\nInnovation in Consumer Products"}
              />
              <ContactRow
                icon={MapPin}
                title="Head Office"
                body={"Dhar, Madhya Pradesh, India"}
              />
              <ContactRow
                icon={Mail}
                title="Email"
                body="support@inclexofficial.com"
              />
              <ContactRow
                icon={Phone}
                title="Customer Support"
                body="+91 92438 75376"
              />
              <ContactRow
                icon={Clock}
                title="Business Hours"
                body={"Monday – Saturday\n11:00 AM – 5:00 PM (IST)"}
              />
              <ContactRow
                icon={Mail}
                title="Website"
                body="www.inclexofficial.com"
              />
              <ContactRow
                icon={MapPin}
                title="GST Number"
                body="23ICDPP3368F1ZI"
              />
            </ul>
          </div>

          <div className="col-span-12 md:col-span-7">
            <form
              onSubmit={submit}
              className="rounded-sm border border-black/10 bg-white p-8 md:p-10"
            >
              <div className="grid grid-cols-2 gap-5">
                <Field
                  label="Full Name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Aditya Sharma"
                  required
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@domain.com"
                  required
                />
                <Field
                  label="Phone (optional)"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+91 …"
                />
                <Field
                  label="Subject"
                  value={form.subject}
                  onChange={update("subject")}
                  placeholder="e.g. Bespoke order"
                />
              </div>
              <div className="mt-5">
                <label className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={update("message")}
                  required
                  rows={6}
                  placeholder="Tell us how we can help…"
                  className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25"
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs text-neutral-500">
                  By submitting you agree to our{" "}
                  <a href="/policy/privacy" className="underline">
                    privacy policy
                  </a>
                  .
                </p>
                <button disabled={sending} className="btn-dark">
                  {sending ? "Sending…" : done ? "Sent ✓" : "Send Message"}{" "}
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ContactRow({ icon: Icon, title, body }) {
  return (
    <li className="flex items-start gap-4">
      <span className="grid h-11 w-11 place-items-center rounded-sm border border-black/10 bg-white text-[#C9A227]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          {title}
        </div>
        {title === "Website" ? (
          <a
            href="https://www.inclexofficial.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-[#C9A227] hover:underline"
          >
            {body}
          </a>
        ) : (
          <p className="mt-1 whitespace-pre-line text-neutral-600">{body}</p>
        )}
      </div>
    </li>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col">
      <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>
      <input
        {...props}
        className="mt-2 rounded-sm border border-black/10 bg-white px-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25"
      />
    </label>
  );
}
