"use client";

import {
  Target, FolderGit2, FileCheck2, AlertTriangle,
  MessageSquare, CalendarClock, Wallet,
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

// Icons line up by index with employerSignalStrip.signals in lib/i18n.ts.
const SIGNAL_ICONS = [
  Target,        // Role fit
  FolderGit2,    // Portfolio evidence
  FileCheck2,    // CV readiness
  AlertTriangle, // Skill gaps
  MessageSquare, // Interview intent
  CalendarClock, // Availability
  Wallet,        // Salary fit
];

export function EmployerSignalStrip() {
  const { dict } = useLanguage();
  const s = dict.employerSignalStrip;

  return (
    <section className="bg-beige-100/60 border-y border-beige-300/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <p className="flex items-center gap-2 shrink-0 text-[11px] font-bold uppercase tracking-wider text-navy-700">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
            {s.label}
          </p>

          <div className="flex flex-wrap gap-2">
            {s.signals.map((signal, i) => {
              const Icon = SIGNAL_ICONS[i % SIGNAL_ICONS.length];
              return (
                <span
                  key={signal}
                  className="inline-flex items-center gap-1.5 rounded-full border border-beige-300 bg-white px-3 py-1.5 text-xs font-medium text-navy-700"
                >
                  <Icon className="w-3.5 h-3.5 text-gold-600" />
                  {signal}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
