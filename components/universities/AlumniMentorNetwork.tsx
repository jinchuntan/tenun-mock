"use client";

import { useRouter } from "next/navigation";
import { Building2, GraduationCap, Users } from "lucide-react";
import type { Translations } from "@/lib/i18n";
import type { AlumniMentor } from "@/lib/university-data";
import { SectionHeading } from "./CareerReadinessSnapshot";

type Uni = Translations["universities"];

/**
 * Section 4 — alumni / university-linked mentors. "Book mock interview" routes
 * into the existing Mock Interview Hub (a clean, lightweight conceptual link to
 * the mentor feature without forcing a complex integration).
 */
export function AlumniMentorNetwork({
  uni,
  mentors,
}: {
  uni: Uni;
  mentors: AlumniMentor[];
}) {
  const router = useRouter();

  return (
    <section>
      <SectionHeading
        icon={<Users size={18} className="text-[#d4a017]" aria-hidden="true" />}
        title={uni.alumniTitle}
        subtitle={uni.alumniSubtitle}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mentors.map((m) => {
          const available = m.status === "available";
          return (
            <div key={m.id} className="bg-white rounded-2xl border border-beige-300 shadow-sm p-5 flex flex-col">
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.accent} text-white font-bold flex items-center justify-center shrink-0`}
                  aria-hidden="true"
                >
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-navy-900 leading-tight">{m.name}</h3>
                  <p className="text-xs text-navy-500 mt-0.5">{m.role}</p>
                  <p className="text-xs text-navy-500 flex items-center gap-1">
                    <Building2 size={11} aria-hidden="true" /> {m.company}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-navy-500 flex items-center gap-1.5">
                <GraduationCap size={13} className="text-navy-400 shrink-0" aria-hidden="true" /> {m.background}
              </p>

              <div className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
                  {uni.expertiseLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {m.expertise.map((e) => (
                    <span
                      key={e}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-navy-50 text-navy-600 border border-beige-200"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={[
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border",
                    available
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-beige-100 text-navy-500 border-beige-300",
                  ].join(" ")}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${available ? "bg-green-500" : "bg-navy-300"}`} />
                  {available ? uni.statusAvailable : uni.statusBusy}
                </span>
              </div>

              <div className="flex-1" />

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => router.push("/dashboard/mock-interview")}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0a1628] text-white text-sm font-semibold hover:bg-[#1a2a4a] transition-colors"
                >
                  {uni.bookMock}
                </button>
                <button
                  disabled
                  title={uni.futureBadge}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-beige-300 text-navy-400 text-sm font-semibold cursor-not-allowed"
                >
                  {uni.requestAdvice}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
