"use client";

import { MessageSquare } from "lucide-react";
import type { Translations } from "@/lib/i18n";
import type { HistoryItem } from "./types";

type Hub = Translations["interviewHub"];

function scoreColor(score: number): string {
  if (score >= 8) return "#16a34a";
  if (score >= 5) return "#d4a017";
  return "#dc2626";
}

/**
 * Live transcript / history of the interview call. Shows each answered turn with
 * its score, plus the current (in-progress) question at the bottom.
 */
export function InterviewTranscriptPanel({
  hub,
  interviewerName,
  history,
  currentQuestion,
}: {
  hub: Hub;
  interviewerName: string;
  history: HistoryItem[];
  currentQuestion: string;
}) {
  const empty = history.length === 0 && !currentQuestion;

  return (
    <div className="bg-white rounded-2xl border border-beige-300 shadow-sm flex flex-col h-full min-h-[18rem]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-beige-200">
        <MessageSquare size={15} className="text-navy-400" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-navy-900">{hub.transcriptTitle}</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-[28rem]">
        {empty && <p className="text-sm text-navy-400">{hub.transcriptEmpty}</p>}

        {history.map((item, i) => (
          <div key={i} className="space-y-2">
            {/* Interviewer question */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400 mb-0.5">
                {interviewerName}
              </p>
              <p className="text-sm text-navy-800 leading-snug">{item.question}</p>
            </div>

            {/* Candidate answer */}
            {item.answer && (
              <div className="rounded-lg bg-beige-50 border border-beige-200 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400 mb-0.5">
                  {hub.yourAnswerLabel}
                </p>
                <p className="text-sm text-navy-700 leading-snug whitespace-pre-line">{item.answer}</p>
              </div>
            )}

            {/* Score chip + short summary */}
            {item.feedback && (
              <div className="flex items-start gap-2">
                <span
                  className="inline-flex items-center justify-center shrink-0 h-6 min-w-[2.75rem] px-2 rounded-md text-[11px] font-bold text-white"
                  style={{ backgroundColor: scoreColor(item.feedback.score) }}
                >
                  {item.feedback.score}/10
                </span>
                {item.feedback.summary && (
                  <p className="text-xs text-navy-500 leading-snug">{item.feedback.summary}</p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Current question (not yet answered) */}
        {currentQuestion && (
          <div className="space-y-1 rounded-lg border border-[#d4a017]/30 bg-[#d4a017]/5 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#a97d12]">
              {hub.interviewerAsks}
            </p>
            <p className="text-sm text-navy-800 leading-snug">{currentQuestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}
