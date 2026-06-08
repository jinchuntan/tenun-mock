"use client";

import type { Translations } from "@/lib/i18n";
import {
  DIFFICULTY_IDS,
  INTERVIEW_TYPE_IDS,
  type Difficulty,
  type InterviewType,
} from "./types";

/**
 * Small, reusable setup fields shared by the AI call setup and the mentor
 * booking flow, so target-role / interview-type / difficulty look and behave
 * identically across both pathways. All copy comes from the i18n dictionary.
 */

type Hub = Translations["interviewHub"];

export function TargetRoleField({
  hub,
  value,
  onChange,
  id = "targetRole",
}: {
  hub: Hub;
  value: string;
  onChange: (value: string) => void;
  id?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900 mb-1.5">
        {hub.targetRoleLabel}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={hub.targetRolePlaceholder}
        className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-[#d4a017]/20 transition-all"
      />
    </div>
  );
}

export function InterviewTypeField({
  hub,
  value,
  onChange,
  /** Optionally limit which types are selectable (used to match a mentor). */
  allowed,
}: {
  hub: Hub;
  value: InterviewType;
  onChange: (value: InterviewType) => void;
  allowed?: InterviewType[];
}) {
  const ids = allowed && allowed.length > 0 ? allowed : INTERVIEW_TYPE_IDS;
  return (
    <div>
      <span className="block text-sm font-semibold text-navy-900 mb-2">{hub.interviewTypeLabel}</span>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {ids.map((id) => {
          const selected = value === id;
          const meta = hub.types[id];
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={[
                "text-left p-3 rounded-xl border-2 transition-all",
                selected ? "border-[#0a1628] bg-[#0a1628]/5" : "border-beige-300 hover:border-beige-500",
              ].join(" ")}
            >
              <p className="text-sm font-semibold text-navy-900">{meta.label}</p>
              <p className="text-xs text-navy-400 mt-0.5">{meta.hint}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DifficultyField({
  hub,
  value,
  onChange,
}: {
  hub: Hub;
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}) {
  return (
    <div>
      <span className="block text-sm font-semibold text-navy-900 mb-2">{hub.difficultyLabel}</span>
      <div className="grid grid-cols-3 gap-2.5">
        {DIFFICULTY_IDS.map((id) => {
          const selected = value === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(id)}
              className={[
                "py-2.5 rounded-xl border-2 text-sm font-semibold transition-all",
                selected
                  ? "border-[#d4a017] bg-[#d4a017]/10 text-navy-900"
                  : "border-beige-300 text-navy-500 hover:border-beige-500",
              ].join(" ")}
            >
              {hub.difficulties[id]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
