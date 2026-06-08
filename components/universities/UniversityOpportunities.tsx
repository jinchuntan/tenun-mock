"use client";

import { useRouter } from "next/navigation";
import {
  Award,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  CalendarClock,
  Code2,
  GraduationCap,
  Megaphone,
  Sparkles,
  Users,
} from "lucide-react";
import type { Translations } from "@/lib/i18n";
import type { OpportunityType, UniversityOpportunity } from "@/lib/university-data";
import { SectionHeading } from "./CareerReadinessSnapshot";

type Uni = Translations["universities"];

const TYPE_ICON: Record<OpportunityType, React.ReactNode> = {
  internship: <Briefcase size={16} aria-hidden="true" />,
  graduate_programme: <GraduationCap size={16} aria-hidden="true" />,
  career_fair: <Users size={16} aria-hidden="true" />,
  campus_event: <Megaphone size={16} aria-hidden="true" />,
  scholarship: <Award size={16} aria-hidden="true" />,
  hackathon: <Code2 size={16} aria-hidden="true" />,
};

/** Section 3 — opportunities linked to the university ecosystem. */
export function UniversityOpportunities({
  uni,
  opportunities,
  savedIds,
  onToggleSave,
}: {
  uni: Uni;
  opportunities: UniversityOpportunity[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <section id="opportunities" className="scroll-mt-20">
      <SectionHeading
        icon={<Sparkles size={18} className="text-[#d4a017]" aria-hidden="true" />}
        title={uni.oppTitle}
        subtitle={uni.oppSubtitle}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opp) => {
          const saved = savedIds.includes(opp.id);
          return (
            <div key={opp.id} className="bg-white rounded-2xl border border-beige-300 shadow-sm p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-navy-50 text-navy-600 border border-beige-200">
                  {TYPE_ICON[opp.type]} {uni.oppTypes[opp.type]}
                </span>
                {opp.relevanceLevel === "high" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">
                    {uni.highMatch}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-navy-900 leading-snug">{opp.title}</h3>
              <p className="text-sm text-navy-500 mt-0.5">{opp.organisation}</p>

              <div className="mt-3 space-y-1.5 text-xs text-navy-500">
                <p className="flex items-center gap-1.5">
                  <CalendarClock size={13} className="text-navy-400" aria-hidden="true" />
                  <span className="font-medium text-navy-600">
                    {opp.isDeadline ? uni.deadlineLabel : uni.dateLabel}:
                  </span>{" "}
                  {opp.date}
                </p>
                <p className="flex items-center gap-1.5">
                  <Briefcase size={13} className="text-navy-400" aria-hidden="true" />
                  <span className="font-medium text-navy-600">{uni.relevantTo}:</span> {opp.relevanceRole}
                </p>
              </div>

              <div className="flex-1" />

              <div className="mt-4 flex items-center gap-2.5">
                <button
                  onClick={() => router.push("/dashboard/mock-interview")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0a1628] text-white text-sm font-semibold hover:bg-[#1a2a4a] transition-colors"
                >
                  {uni.prepare}
                </button>
                <button
                  onClick={() => onToggleSave(opp.id)}
                  aria-pressed={saved}
                  className={[
                    "inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-colors",
                    saved
                      ? "bg-[#d4a017]/10 text-[#a97d12] border-[#d4a017]/30"
                      : "border-beige-300 text-navy-600 hover:border-navy-300 hover:text-navy-900",
                  ].join(" ")}
                >
                  {saved ? <BookmarkCheck size={15} aria-hidden="true" /> : <Bookmark size={15} aria-hidden="true" />}
                  {saved ? uni.saved : uni.save}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
