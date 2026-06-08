"use client";

import { BadgeCheck, Building2, CalendarDays, GraduationCap, MapPin } from "lucide-react";
import type { Translations } from "@/lib/i18n";
import type { UniversityProfile } from "@/lib/university-data";

type Uni = Translations["universities"];

/** Section 1 — the candidate's selected/mock university profile. */
export function UniversityProfileCard({
  uni,
  profile,
}: {
  uni: Uni;
  profile: UniversityProfile;
}) {
  const verificationText =
    profile.verification === "graduate_linked" ? uni.graduateLinked : uni.studentLinked;

  return (
    <div className="bg-white rounded-2xl border border-beige-300 shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-5 bg-gradient-to-br from-[#0a1628] to-[#1a2a4a] text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#d4a017]/15 border border-[#d4a017]/30 flex items-center justify-center shrink-0">
            <GraduationCap size={26} className="text-[#d4a017]" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-white/50">{uni.profileTitle}</p>
            <h2 className="text-lg sm:text-xl font-bold leading-tight">{profile.name}</h2>
            <p className="text-xs text-white/60 mt-1 flex items-center gap-1.5">
              <MapPin size={12} aria-hidden="true" /> {profile.location}
            </p>
          </div>
          <span className="ml-auto shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-500/15 text-green-300 border border-green-400/25">
            <BadgeCheck size={13} aria-hidden="true" /> {verificationText}
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-beige-200">
        <Detail icon={<Building2 size={14} aria-hidden="true" />} label={uni.facultyLabel} value={profile.faculty} />
        <Detail icon={<GraduationCap size={14} aria-hidden="true" />} label={uni.programmeLabel} value={profile.programme} />
        <Detail
          icon={<CalendarDays size={14} aria-hidden="true" />}
          label={uni.gradYearLabel}
          value={String(profile.graduationYear)}
        />
        <Detail
          icon={<BadgeCheck size={14} aria-hidden="true" />}
          label={uni.careerCentreLabel}
          value={profile.careerCentreActive ? uni.careerCentreActive : uni.careerCentreInactive}
          highlight={profile.careerCentreActive}
        />
      </dl>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white px-5 sm:px-6 py-3.5">
      <dt className="text-[11px] uppercase tracking-wide text-navy-400 flex items-center gap-1.5">
        {icon} {label}
      </dt>
      <dd className={`text-sm font-semibold mt-0.5 ${highlight ? "text-green-700" : "text-navy-900"}`}>
        {value}
      </dd>
    </div>
  );
}
