"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileText,
  FolderGit2,
  GitCompareArrows,
  Mic,
  Target,
} from "lucide-react";
import type { Translations } from "@/lib/i18n";
import type { RecommendedAction, RecommendedActionId, SkillsGap } from "@/lib/university-data";
import { SectionHeading } from "./CareerReadinessSnapshot";

type Uni = Translations["universities"];

const ACTION_ICON: Record<RecommendedActionId, React.ReactNode> = {
  improveCv: <FileText size={15} aria-hidden="true" />,
  mockInterview: <Mic size={15} aria-hidden="true" />,
  addPortfolio: <FolderGit2 size={15} aria-hidden="true" />,
  applyInternship: <Briefcase size={15} aria-hidden="true" />,
  shortCourse: <BookOpen size={15} aria-hidden="true" />,
};

/** Section 5 — university-to-market skills gap + recommended next actions. */
export function SkillsGapPanel({
  uni,
  gap,
  actions,
}: {
  uni: Uni;
  gap: SkillsGap;
  actions: RecommendedAction[];
}) {
  return (
    <section>
      <SectionHeading
        icon={<GitCompareArrows size={18} className="text-[#d4a017]" aria-hidden="true" />}
        title={uni.gapTitle}
        subtitle={uni.gapSubtitle}
      />

      <div className="bg-white rounded-2xl border border-beige-300 shadow-sm p-5 sm:p-6 space-y-5">
        {/* Target role banner */}
        <div className="flex items-center gap-2 rounded-xl bg-[#0a1628]/5 border border-beige-200 px-4 py-3">
          <Target size={16} className="text-[#d4a017] shrink-0" aria-hidden="true" />
          <p className="text-sm text-navy-700">
            <span className="font-semibold text-navy-500">{uni.targetRoleLabel}: </span>
            <span className="font-bold text-navy-900">{gap.targetRole}</span>
          </p>
        </div>

        {/* Studied vs requires vs gaps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GapColumn title={uni.studiedLabel} items={[gap.studied]} tone="neutral" />
          <GapColumn title={uni.requiresLabel} items={gap.requires} tone="info" />
          <GapColumn title={uni.gapsLabel} items={gap.gaps} tone="warn" />
        </div>

        {/* Recommended actions */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-2.5">
            {uni.recommendedActions}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {actions.map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-beige-300 bg-beige-50/50 text-sm font-semibold text-navy-700 hover:border-[#d4a017] hover:text-navy-900 transition-colors"
              >
                <span className="text-[#a97d12]">{ACTION_ICON[a.id]}</span>
                {uni.actions[a.id]}
                <ArrowRight size={13} className="text-navy-300 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GapColumn({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "info" | "warn";
}) {
  const dot =
    tone === "warn" ? "bg-[#d4a017]" : tone === "info" ? "bg-[#4164b4]" : "bg-navy-300";
  return (
    <div className="rounded-xl border border-beige-200 bg-beige-50/40 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-2">{title}</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-navy-700">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
