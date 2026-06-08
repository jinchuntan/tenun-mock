"use client";

import { Briefcase, Check, Clock, Target } from "lucide-react";
import type { Translations } from "@/lib/i18n";
import type { Mentor } from "./types";

type Hub = Translations["interviewHub"];

/**
 * A single mentor in the browse grid. The avatar is a gradient-initials
 * placeholder (no external image dependency). Selecting a mentor lifts the
 * choice to the booking flow; the slot picker lives in the flow's detail panel.
 */
export function MentorCard({
  hub,
  mentor,
  selected,
  onSelect,
}: {
  hub: Hub;
  mentor: Mentor;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={[
        "bg-white rounded-2xl border-2 shadow-sm p-5 flex flex-col h-full transition-all",
        selected ? "border-[#d4a017] ring-2 ring-[#d4a017]/20" : "border-beige-300 hover:border-beige-500",
      ].join(" ")}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mentor.accent} text-white font-bold text-lg flex items-center justify-center shrink-0 shadow`}
          aria-hidden="true"
        >
          {mentor.initials}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-navy-900 leading-tight">{mentor.name}</h3>
          <p className="text-xs text-navy-500 mt-0.5 flex items-center gap-1.5">
            <Briefcase size={12} aria-hidden="true" /> {mentor.title}
          </p>
        </div>
      </div>

      <p className="text-sm text-navy-600 mt-3 leading-relaxed">{mentor.bio}</p>

      {/* Expertise */}
      <div className="mt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
          {hub.expertiseLabel}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {mentor.expertise.map((e) => (
            <span
              key={e}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-navy-50 text-navy-600 border border-beige-200"
            >
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Supported interview types */}
      <div className="mt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
          {hub.supportsLabel}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {mentor.supportedTypes.map((t) => (
            <span
              key={t}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#d4a017]/10 text-[#a97d12] border border-[#d4a017]/20"
            >
              {hub.types[t].label}
            </span>
          ))}
        </div>
      </div>

      {/* Example roles */}
      <p className="mt-3 text-xs text-navy-500 flex items-start gap-1.5">
        <Target size={13} className="mt-0.5 shrink-0 text-navy-400" aria-hidden="true" />
        <span>
          <span className="font-semibold text-navy-600">{hub.exampleRolesLabel}: </span>
          {mentor.exampleRoles.join(", ")}
        </span>
      </p>

      {/* Slots preview */}
      <p className="mt-2 text-xs text-navy-500 flex items-start gap-1.5">
        <Clock size={13} className="mt-0.5 shrink-0 text-navy-400" aria-hidden="true" />
        <span>
          <span className="font-semibold text-navy-600">{hub.slotsLabel}: </span>
          {mentor.slots.map((s) => s.label).join(" · ")}
        </span>
      </p>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={[
          "mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
          selected
            ? "bg-[#d4a017] text-[#0a1628] hover:bg-[#e0ad1c]"
            : "bg-[#0a1628] text-white hover:bg-[#1a2a4a]",
        ].join(" ")}
      >
        {selected ? (
          <>
            <Check size={15} aria-hidden="true" /> {hub.selected}
          </>
        ) : (
          hub.select
        )}
      </button>
    </div>
  );
}
