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

  const update = (key) => (e) => {
    setForm((current) => ({
      ...current,
      [key]: e.target.value,
    }));
  };

  async function submit(e) {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.ok) {
        toast.success("Message sent", {
          description: "We'll get back within 24 hours.",
        });

        setDone(true);

        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.error || "Please check the form");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8F7F4]">
      <Header variant="light" />

      <section className="container-editorial py-16 md:py-24">
        {/* MAIN CONTACT GRID */}
        <div className="grid min-w-0 grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* LEFT SIDE */}
          <div className="min-w-0 lg:col-span-5">
            <div className="eyebrow flex items-center gap-3">
              <span className="hairline" />
              Contact INCLEX
            </div>

            <h1 className="mt-4 max-w-full break-words font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Let's Build
              <br />
              Something Premium.
            </h1>

            <p className="mt-5 max-w-xl text-neutral-600 leading-7">
              Whether you have a product inquiry, business proposal, wholesale
              request, customization idea, or need customer support, our team
              is here to help. We aim to respond within one business day.
            </p>

            <ul className="mt-10 space-y-6">
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

          {/* RIGHT SIDE - FORM */}
          <div className="min-w-0 lg:col-span-7">
            <form
              onSubmit={submit}
              className="w-full min-w-0 rounded-sm border border-black/10 bg-white p-6 sm:p-8 md:p-10"
            >
              {/* INPUTS */}
              <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
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

              {/* MESSAGE */}
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
                  className="mt-2 block w-full min-w-0 resize-y rounded-sm border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25"
                />
              </div>

              {/* BOTTOM */}
              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-neutral-500">
                  By submitting you agree to our{" "}
                  <a
                    href="/policy/privacy"
                    className="underline transition hover:text-black"
                  >
                    privacy policy
                  </a>
                  .
                </p>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-dark w-full shrink-0 sm:w-auto"
                >
                  {sending
                    ? "Sending…"
                    : done
                      ? "Sent ✓"
                      : "Send Message"}

                  {!sending && !done && (
                    <Send className="h-4 w-4" />
                  )}
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

/* --------------------------------------------------
   CONTACT INFORMATION ROW
-------------------------------------------------- */

function ContactRow({ icon: Icon, title, body }) {
  return (
    <li className="flex min-w-0 items-start gap-4">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm border border-black/10 bg-white text-[#C9A227]">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
          {title}
        </div>

        {title === "Website" ? (
          <a
            href="https://www.inclexofficial.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-words text-[15px] text-neutral-800 hover:text-[#C9A227]"
          >
            {body}
          </a>
        ) : (
          <div className="mt-1 whitespace-pre-line break-words text-[15px] leading-6 text-neutral-800">
            {body}
          </div>
        )}
      </div>
    </li>
  );
}

/* --------------------------------------------------
   FORM FIELD
-------------------------------------------------- */

function Field({ label, ...props }) {
  return (
    <div className="min-w-0">
      <label className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </label>

      <input
        {...props}
        className="mt-2 block w-full min-w-0 rounded-sm border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25"
      />
    </div>
  );
}