"use client";

import { PlayCircle } from "lucide-react";

export default function ProductRefillVideo() {
  return (
    <section className="bg-[#F8F7F4] py-24">
      <div className="container-editorial">
        {/* Heading */}
        <div className="text-center">
          <div className="eyebrow flex items-center justify-center gap-3">
            <span className="hairline" />
            Product Guide
          </div>

          <h2 className="mt-5 font-serif text-4xl md:text-5xl">
            How to Refill
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-neutral-600 leading-8">
            Watch the complete refill process of your INCLEX Keyfume. It takes
            less than one minute.
          </p>
        </div>

        {/* Video */}
        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl">
          <video
            controls
            playsInline
            preload="metadata"
            poster="/uploads/images/1785953009349-udf8ahq3stc.jpeg"
            className="w-full"
          >
            <source
              src="/uploads/videos/1785952292423-fiizsgrxiab.mp4"
              type="video/mp4"
            />
            Your browser does not support video.
          </video>
        </div>

        {/* Steps */}
        <div className="mt-20 grid gap-8 md:grid-cols-4">
          <Step
            number="01"
            title="Open"
            text="Unscrew the spray head carefully."
          />

          <Step
            number="02"
            title="Attach"
            text="Place the perfume bottle nozzle into the refill valve."
          />

          <Step
            number="03"
            title="Pump"
            text="Pump perfume several times until full."
          />

          <Step
            number="04"
            title="Ready"
            text="Close the cap and enjoy your fragrance."
          />
        </div>
      </div>
    </section>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
      <div className="text-sm font-semibold tracking-[0.25em] text-[#C9A227]">
        {number}
      </div>

      <h3 className="mt-4 font-serif text-2xl">{title}</h3>

      <p className="mt-3 leading-7 text-neutral-600">{text}</p>
    </div>
  );
}