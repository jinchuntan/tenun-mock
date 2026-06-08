"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, Building2 } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

/**
 * Dashboard entry card for the candidate-facing "University Career Bridge".
 * Lives in its own dashboard section and links to /dashboard/universities.
 */
export function UniversityEntryCard() {
  const router = useRouter();
  const { dict } = useLanguage();
  const uni = dict.universities;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#0a1628]">{uni.entryTitle}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{uni.entryDescription}</p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 transition-all hover:border-[#d4a017] hover:shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#d4a017]/15 flex items-center justify-center shrink-0">
            <GraduationCap size={22} className="text-[#d4a017]" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="flex items-center gap-2 text-base font-semibold text-[#0a1628]">
              {uni.entryCardTitle}
              <Building2 size={15} className="text-gray-300" aria-hidden="true" />
            </h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{uni.entryCardDesc}</p>

            <button
              onClick={() => router.push("/dashboard/universities")}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0a1628] text-white text-sm font-semibold hover:bg-[#1a2a4a] transition-colors"
            >
              {uni.entryCta} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
