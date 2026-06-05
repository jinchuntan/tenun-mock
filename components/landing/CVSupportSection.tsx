"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight, FileText } from "lucide-react";

const BUILD_CV_HREF = "/profile?upload=true&from=landing";

const STATS = [
  {
    stat: "7 sec",
    label: "average recruiter scan time",
    body: "Numbers and keywords are the only things that stop the scroll. Generic descriptions get skipped instantly.",
    rotate: -3,
    mtClass: "",
  },
  {
    stat: "85%",
    label: "of CVs rejected by ATS before a human reads them",
    body: "Tenun matches your skills to exactly what each company's system scans for — so you actually get seen.",
    rotate: 2,
    mtClass: "sm:mt-6",
  },
  {
    stat: "3x",
    label: "more callbacks with a targeted summary",
    body: "Your opening line should answer one question: why should I keep reading?",
    rotate: -2,
    mtClass: "",
  },
  {
    stat: "90%",
    label: "of recruiters verify candidates online",
    body: "LinkedIn and GitHub signal confidence and make their job easier. Adding them takes 10 seconds.",
    rotate: 3,
    mtClass: "sm:mt-6",
  },
];

export function CVSupportSection() {
  return (
    <section className="py-16 md:py-24 bg-navy-900 relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-[0.06] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading + paragraph */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-end mb-14">
          <h2 className="font-display text-4xl sm:text-5xl text-white leading-[0.95]">
            Don&apos;t stress.
            <br />
            We&apos;ve got you.
          </h2>
          <p className="text-navy-200 text-sm sm:text-base leading-relaxed">
            Most people don&apos;t know where to start — and that&apos;s completely fine.
            We build your CV with you, keep it sharp as you grow, and make sure
            you&apos;re always ready when the right door opens.
          </p>
        </div>

        {/* Tilted stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {STATS.map((s, i) => (
            <motion.article
              key={s.stat}
              initial={{ opacity: 0, y: 20, rotate: s.rotate }}
              whileInView={{ opacity: 1, y: 0, rotate: s.rotate }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{
                scale: 1.05,
                y: -14,
                rotate: 0,
                zIndex: 20,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className={`relative rounded-3xl bg-beige-100 border border-beige-300/40 p-5 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-gold-500/25 hover:border-gold-400 ${s.mtClass}`}
            >
              <span className="absolute -top-3 -right-3 w-11 h-11 rounded-full bg-white border border-beige-300 shadow-md flex items-center justify-center">
                <Clock className="w-5 h-5 text-navy-700" />
              </span>
              <div className="font-display text-3xl text-navy-900 mb-1">{s.stat}</div>
              <p className="text-xs font-semibold text-navy-500 mb-3 leading-snug">{s.label}</p>
              <p className="text-sm text-navy-700 leading-relaxed mb-4">{s.body}</p>
              <Link
                href={BUILD_CV_HREF}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gold-700 hover:text-navy-900 transition-colors"
              >
                View Sample <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={BUILD_CV_HREF}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold-500 text-navy-900 text-sm font-bold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20"
          >
            <FileText className="w-4 h-4" />
            Build my CV
          </Link>
          <p className="text-xs text-navy-300 mt-4">
            Ready to build yours? Free for Weavers. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
