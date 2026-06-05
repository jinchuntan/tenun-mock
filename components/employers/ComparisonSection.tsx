"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const JOB_BOARDS = [
  "Many cold applicants",
  "Keyword-heavy CVs",
  "Candidates apply blindly",
  "Recruiters screen manually",
  "Weak signal on motivation and fit",
];

const TENUN = [
  "Smaller, warmer shortlist",
  "Skill, interest, and role-fit context",
  "Candidates understand the role before applying",
  "Candidate signals are structured before review",
  "Better visibility into readiness and gaps",
];

export function ComparisonSection() {
  return (
    <section id="why" className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl text-navy-900 leading-tight mb-3">
            Why Tenun, not just another job board?
          </h2>
          <p className="text-sm sm:text-base text-navy-600 leading-relaxed">
            Traditional job boards give you volume. Tenun gives you context.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Traditional job boards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-3xl bg-beige-100 border border-beige-300/60 p-6 sm:p-7"
          >
            <h3 className="text-sm font-semibold text-navy-500 mb-5">Traditional job boards</h3>
            <ul className="space-y-3.5">
              {JOB_BOARDS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-600">
                  <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-navy-100 shrink-0">
                    <X className="w-3 h-3 text-navy-500" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tenun */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="rounded-3xl bg-navy-900 border border-navy-800 p-6 sm:p-7 shadow-xl shadow-navy-900/20"
          >
            <h3 className="text-sm font-semibold text-gold-400 mb-5 flex items-center gap-2">
              <span className="text-base font-black text-white">Tenun</span>
            </h3>
            <ul className="space-y-3.5">
              {TENUN.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-100">
                  <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-gold-500 shrink-0">
                    <Check className="w-3 h-3 text-navy-900" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
