"use client";

import { Building2, Check, Sparkles } from "lucide-react";
import type { Translations } from "@/lib/i18n";

type Uni = Translations["universities"];

/**
 * Section 6 — a lightweight, clearly future-marked teaser for the upcoming
 * university partner dashboard. Intentionally NOT a real admin portal.
 */
export function UniversityFutureTeaser({ uni }: { uni: Uni }) {
  return (
    <section>
      <div className="relative overflow-hidden rounded-2xl border border-[#d4a017]/30 bg-gradient-to-br from-[#0a1628] to-[#1a2a4a] text-white p-6 sm:p-7">
        <div className="pointer-events-none absolute -top-12 -right-10 w-48 h-48 rounded-full bg-[#d4a017]/20 blur-3xl" aria-hidden="true" />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4a017]/15 border border-[#d4a017]/30 flex items-center justify-center shrink-0">
              <Building2 size={20} className="text-[#d4a017]" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold">{uni.futureTitle}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-[#f0d489] border border-white/15">
              <Sparkles size={12} aria-hidden="true" /> {uni.futureBadge}
            </span>
          </div>

          <p className="text-sm text-white/70 max-w-2xl leading-relaxed">{uni.futureDesc}</p>

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {uni.futurePoints.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-white/85">
                <Check size={15} className="text-[#d4a017] mt-0.5 shrink-0" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[11px] text-white/40">{uni.futureNote}</p>
        </div>
      </div>
    </section>
  );
}
