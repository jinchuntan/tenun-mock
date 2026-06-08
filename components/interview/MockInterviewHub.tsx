"use client";

import { useEffect, useState } from "react";
import { Mic } from "lucide-react";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { InterviewModeSelector } from "./InterviewModeSelector";
import { AICallInterviewSession } from "./AICallInterviewSession";
import { MentorBookingFlow } from "./MentorBookingFlow";
import type { InterviewMode } from "./types";

const MODE_KEY = "tenun-mock-interview-mode";

/**
 * Top-level Mock Interview Hub. Presents the two pathways (AI call / mentor
 * booking) and renders the chosen flow. The active pathway is persisted so a
 * refresh keeps the user where they were (each flow also persists its own deep
 * state independently).
 */
export function MockInterviewHub() {
  const { dict } = useLanguage();
  const hub = dict.interviewHub;

  const [mode, setMode] = useState<InterviewMode | null>(null);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(MODE_KEY);
      if (saved === "ai" || saved === "mentor") setMode(saved);
    } catch {
      /* ignore */
    }
    setRestored(true);
  }, []);

  function selectMode(next: InterviewMode | null) {
    setMode(next);
    try {
      if (next) window.localStorage.setItem(MODE_KEY, next);
      else window.localStorage.removeItem(MODE_KEY);
    } catch {
      /* ignore */
    }
  }

  // Avoid a flash of the selector before we know the saved pathway.
  if (!restored) return null;

  return (
    <div className="px-4 py-8 sm:py-10">
      {/* Hub header — hidden once inside a flow to maximise call/booking space */}
      {mode === null && (
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#d4a017]/15 mb-3">
            <Mic size={22} className="text-[#d4a017]" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-navy-900">{hub.pageTitle}</h1>
          <p className="text-sm text-navy-500 mt-2 max-w-md mx-auto leading-relaxed">{hub.pageSubtitle}</p>
        </div>
      )}

      {mode === null && <InterviewModeSelector onSelect={selectMode} />}
      {mode === "ai" && <AICallInterviewSession onExit={() => selectMode(null)} />}
      {mode === "mentor" && <MentorBookingFlow onExit={() => selectMode(null)} />}
    </div>
  );
}
