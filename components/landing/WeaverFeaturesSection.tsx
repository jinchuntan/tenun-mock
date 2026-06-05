"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const FEATURES = [
  {
    title: "Job discovery, not just job search",
    body: "Type what you enjoy. Get 6 real job titles you may not have known existed, each with salary ranges, day-to-day breakdowns, and required skills.",
    image: "/images/landing/dog-image.png",
    alt: "Tenun mascot puppy exploring careers",
  },
  {
    title: "The secret sauce, not just job descriptions",
    body: "Learn what actually separates candidates who get hired from those who don't, for every role you explore. No generic advice.",
    image: "/images/landing/frog-image.png",
    alt: "Tenun mascot frog graduate thinking it through",
  },
  {
    title: "Your path, not just a list",
    body: "Upload your CV and see what to improve, what to build, and how to position yourself for the roles you actually want.",
    image: "/images/landing/can-image.png",
    alt: "Tenun graduation-cap mascot striding ahead",
  },
];

const AUTO_ROTATE_MS = 4000;

// Three visual slots. Percentages keep the offsets responsive to card width.
const SLOTS = {
  center: { x: "0%", scale: 1, rotate: 0, opacity: 1 },
  left: { x: "-58%", scale: 0.86, rotate: -5, opacity: 0.6 },
  right: { x: "58%", scale: 0.86, rotate: 5, opacity: 0.6 },
} as const;

type SlotName = keyof typeof SLOTS;

function slotFor(index: number, active: number): SlotName {
  const rel = (index - active + FEATURES.length) % FEATURES.length;
  if (rel === 0) return "center";
  return rel === 1 ? "right" : "left";
}

export function WeaverFeaturesSection() {
  const [active, setActive] = useState(0);
  // Ref (not state) so pausing never tears down the interval
  const pausedRef = useRef(false);

  // "Forward" = the left card slides into the centre (matches the brief)
  const goNext = () => setActive((a) => (a - 1 + FEATURES.length) % FEATURES.length);
  const goPrev = () => setActive((a) => (a + 1) % FEATURES.length);

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setActive((a) => (a - 1 + FEATURES.length) % FEATURES.length);
      }
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left headline */}
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-navy-500 mb-3">For Weavers.</p>
            <h2 className="font-display text-3xl sm:text-4xl text-navy-900 leading-[1.05] mb-6">
              Built for people who don&apos;t know their job title yet.
            </h2>
            <p className="text-sm text-navy-600 leading-relaxed underline decoration-gold-400 decoration-2 underline-offset-4 max-w-sm mb-8">
              Most platforms expect you to already know what you want. Tenun starts
              from where you actually are.
            </p>

            {/* Manual navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous feature"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-beige-300 bg-white text-navy-700 hover:border-gold-400 hover:text-gold-600 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next feature"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-beige-300 bg-white text-navy-700 hover:border-gold-400 hover:text-gold-600 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right coverflow carousel — pauses on hover/touch so you can read */}
          <div
            className="lg:col-span-7 relative h-[420px] sm:h-[400px] overflow-hidden"
            onMouseEnter={pause}
            onMouseLeave={resume}
            onTouchStart={pause}
            onTouchEnd={resume}
          >
            {FEATURES.map((feature, i) => {
              const slot = slotFor(i, active);
              return (
                <motion.article
                  key={feature.title}
                  initial={false}
                  animate={SLOTS[slot]}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  style={{ zIndex: slot === "center" ? 3 : 2 }}
                  className="absolute inset-0 m-auto w-[80%] sm:w-[300px] lg:w-[330px] h-[360px] rounded-3xl bg-beige-100 border border-beige-300/60 p-5 flex flex-col shadow-lg shadow-navy-900/10"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-navy-900 text-base leading-snug">
                      {feature.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-navy-400 shrink-0 mt-0.5" />
                  </div>
                  <p className="text-sm text-navy-600 leading-relaxed mb-4">
                    {feature.body}
                  </p>
                  {/* Real mascot illustration on a clean rounded panel */}
                  <div className="mt-auto relative flex-1 min-h-0 rounded-2xl bg-white border border-beige-300/50 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.alt}
                      fill
                      sizes="(max-width: 640px) 80vw, 330px"
                      className="object-contain p-4"
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
