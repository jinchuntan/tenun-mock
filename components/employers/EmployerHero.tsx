"use client";

import { motion } from "framer-motion";
import { Search, ArrowRight, LayoutDashboard } from "lucide-react";

interface EmployerHeroProps {
  roleTitle: string;
  setRoleTitle: (v: string) => void;
  onFindCandidates: () => void;
  onPostRole: () => void;
  onViewPreview: () => void;
}

export function EmployerHero({
  roleTitle, setRoleTitle, onFindCandidates, onPostRole, onViewPreview,
}: EmployerHeroProps) {
  return (
    <section
      className="relative pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden"
      aria-labelledby="employer-hero-heading"
    >
      <div className="absolute inset-0 dot-pattern opacity-[0.35] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-beige-300 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-navy-600 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
          For Employers
        </motion.span>

        <motion.h1
          id="employer-hero-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-[2.5rem] leading-[0.98] sm:text-5xl lg:text-6xl tracking-tight text-navy-900 mb-5"
        >
          Hire candidates who already
          <br className="hidden sm:block" />{" "}
          know <span className="gradient-gold">why they fit.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg text-navy-600 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Tenun helps employers discover students and fresh graduates who have explored
          the role, built a profile, and understand what it takes — before they apply.
        </motion.p>

        {/* Role input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <form
            onSubmit={(e) => { e.preventDefault(); onFindCandidates(); }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400 pointer-events-none" />
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="What role are you hiring for?"
              aria-label="What role are you hiring for?"
              className="w-full pr-44 py-5 rounded-full border border-beige-300 bg-white/90 text-sm sm:text-base text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-4 focus:ring-gold-500/15 focus:border-gold-400 transition-all shadow-lg shadow-navy-900/5"
              style={{ paddingLeft: "3.25rem" }}
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-5 py-3 rounded-full bg-navy-900 text-white text-sm font-semibold hover:bg-gold-500 hover:text-navy-900 transition-all"
            >
              Find matched candidates
            </button>
          </form>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7">
            <button
              type="button"
              onClick={onPostRole}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500 text-navy-900 text-sm font-bold hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20"
            >
              Post a role
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onViewPreview}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-navy-300 bg-white/70 text-navy-900 text-sm font-semibold hover:border-navy-900 hover:bg-white transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              View candidate preview
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
