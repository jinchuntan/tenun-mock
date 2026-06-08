"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, CalendarCheck, Check } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { InterviewMode } from "./types";

/**
 * The two-pathway chooser shown when the user opens the Mock Interview Hub.
 * A: Practise with AI Interviewer (call-focused).
 * B: Book a Mentor Mock Interview (scheduling-focused).
 */
export function InterviewModeSelector({
  onSelect,
}: {
  onSelect: (mode: InterviewMode) => void;
}) {
  const { dict } = useLanguage();
  const hub = dict.interviewHub;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900">{hub.chooseTitle}</h2>
        <p className="text-sm text-navy-500 mt-1.5">{hub.chooseSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <PathCard
          icon={<Bot size={24} className="text-[#d4a017]" aria-hidden="true" />}
          badge={hub.aiBadge}
          title={hub.aiTitle}
          desc={hub.aiDesc}
          points={hub.aiPoints}
          cta={hub.aiCta}
          accentBtn="bg-[#0a1628] text-white hover:bg-[#1a2a4a]"
          onClick={() => onSelect("ai")}
          delay={0}
        />
        <PathCard
          icon={<CalendarCheck size={24} className="text-[#0a1628]" aria-hidden="true" />}
          badge={hub.mentorBadge}
          title={hub.mentorTitle}
          desc={hub.mentorDesc}
          points={hub.mentorPoints}
          cta={hub.mentorCta}
          accentBtn="bg-[#d4a017] text-[#0a1628] hover:bg-[#e0ad1c]"
          onClick={() => onSelect("mentor")}
          delay={0.06}
        />
      </div>
    </div>
  );
}

function PathCard({
  icon,
  badge,
  title,
  desc,
  points,
  cta,
  accentBtn,
  onClick,
  delay,
}: {
  icon: React.ReactNode;
  badge: string;
  title: string;
  desc: string;
  points: string[];
  cta: string;
  accentBtn: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3 }}
      className="group text-left bg-white rounded-2xl border-2 border-beige-300 hover:border-[#d4a017] shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-[#d4a017]/30"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-beige-100 border border-beige-200 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-navy-50 text-navy-600 border border-beige-200">
          {badge}
        </span>
      </div>

      <h3 className="text-lg font-bold text-navy-900">{title}</h3>
      <p className="text-sm text-navy-500 mt-1.5 leading-relaxed">{desc}</p>

      <ul className="mt-4 space-y-2 flex-1">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-navy-700">
            <Check size={15} className="text-green-600 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <span
        className={`mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors ${accentBtn}`}
      >
        {cta}
        <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
      </span>
    </motion.button>
  );
}
