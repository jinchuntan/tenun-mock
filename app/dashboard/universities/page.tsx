"use client";

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

import { AuthGate } from "@/components/auth-gate";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { UniversityProfileCard } from "@/components/universities/UniversityProfileCard";
import { CareerReadinessSnapshot } from "@/components/universities/CareerReadinessSnapshot";
import { UniversityOpportunities } from "@/components/universities/UniversityOpportunities";
import { AlumniMentorNetwork } from "@/components/universities/AlumniMentorNetwork";
import { SkillsGapPanel } from "@/components/universities/SkillsGapPanel";
import { UniversityFutureTeaser } from "@/components/universities/UniversityFutureTeaser";
import {
  MOCK_ALUMNI,
  MOCK_OPPORTUNITIES,
  MOCK_READINESS,
  MOCK_SKILLS_GAP,
  MOCK_UNIVERSITY,
  RECOMMENDED_ACTIONS,
  loadSavedOpportunities,
  saveOpportunities,
  type SkillsGap,
} from "@/lib/university-data";

function UniversitiesContent() {
  const { dict } = useLanguage();
  const uni = dict.universities;

  // Saved opportunities (persisted locally per device).
  const [savedIds, setSavedIds] = useState<string[]>([]);
  useEffect(() => {
    setSavedIds(loadSavedOpportunities());
  }, []);

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveOpportunities(next);
      return next;
    });
  }

  // Lightly personalise the skills-gap target role from the user's stored
  // target job when available — the rest stays mock but real-data ready.
  const [gap, setGap] = useState<SkillsGap>(MOCK_SKILLS_GAP);
  useEffect(() => {
    try {
      const targetJob = sessionStorage.getItem("tenun-target-job");
      if (targetJob && targetJob.trim()) {
        setGap((g) => ({ ...g, targetRole: targetJob.trim() }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="px-4 py-8 sm:py-10">
      {/* Intro */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#d4a017]/15 mb-3">
          <GraduationCap size={22} className="text-[#d4a017]" aria-hidden="true" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl text-navy-900">{uni.pageTitle}</h1>
        <p className="text-sm text-navy-500 mt-2 max-w-md mx-auto leading-relaxed">{uni.pageSubtitle}</p>
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        <UniversityProfileCard uni={uni} profile={MOCK_UNIVERSITY} />
        <CareerReadinessSnapshot uni={uni} metrics={MOCK_READINESS} />
        <UniversityOpportunities
          uni={uni}
          opportunities={MOCK_OPPORTUNITIES}
          savedIds={savedIds}
          onToggleSave={toggleSave}
        />
        <AlumniMentorNetwork uni={uni} mentors={MOCK_ALUMNI} />
        <SkillsGapPanel uni={uni} gap={gap} actions={RECOMMENDED_ACTIONS} />
        <UniversityFutureTeaser uni={uni} />
      </div>
    </div>
  );
}

export default function UniversitiesPage() {
  return (
    <AuthGate
      next="/dashboard/universities"
      title="Sign in to the University Career Bridge"
      subtitle="Create your free account to connect your university background to internships, alumni mentors, and career readiness."
      perks={[
        "See how ready you are for the roles you're targeting",
        "Find internships, graduate programmes, and campus events",
        "Connect with alumni mentors from your university",
      ]}
    >
      <div className="min-h-screen bg-[#f5f0e8]">
        <AppTopBar
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Universities" },
          ]}
          returnTo={{ href: "/dashboard", label: "Exit to Dashboard" }}
        />
        <UniversitiesContent />
      </div>
    </AuthGate>
  );
}
