"use client";

import { ArrowRight, Flag, Loader2, PhoneOff, Volume2, VolumeX } from "lucide-react";
import type { Translations } from "@/lib/i18n";

type Hub = Translations["interviewHub"];

/**
 * Call-style control bar: mute (AI voice), submit answer, next question, and end
 * call. Stateless — the parent owns all interview state. The microphone toggle
 * lives inside the answer box (VoiceAnswerInput) to avoid two competing mics.
 */
export function InterviewCallControls({
  hub,
  phase,
  busy,
  ttsSupported,
  muted,
  onToggleMute,
  canSubmit,
  onSubmit,
  showNext,
  isLast,
  onNext,
  onEnd,
}: {
  hub: Hub;
  /** "answering" while the user works on an answer; "feedback" after it's scored. */
  phase: "answering" | "feedback";
  busy: boolean;
  ttsSupported: boolean;
  muted: boolean;
  onToggleMute: () => void;
  canSubmit: boolean;
  onSubmit: () => void;
  showNext: boolean;
  isLast: boolean;
  onNext: () => void;
  onEnd: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Mute / unmute AI voice */}
      {ttsSupported && (
        <button
          type="button"
          onClick={onToggleMute}
          aria-pressed={muted}
          className="inline-flex items-center gap-2 px-3.5 py-3 rounded-xl border border-beige-300 text-navy-600 text-sm font-semibold hover:border-navy-300 hover:text-navy-900 transition-colors"
        >
          {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
          <span className="hidden sm:inline">{muted ? hub.unmute : hub.mute}</span>
        </button>
      )}

      <div className="flex-1" />

      {/* Primary action: submit answer or next question */}
      {phase === "answering" ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={busy || !canSubmit}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a1628] text-white text-sm font-semibold hover:bg-[#1a2a4a] transition-colors disabled:opacity-50"
        >
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" /> {hub.evaluating}
            </>
          ) : (
            hub.submitAnswer
          )}
        </button>
      ) : showNext && !isLast ? (
        <button
          type="button"
          onClick={onNext}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a1628] text-white text-sm font-semibold hover:bg-[#1a2a4a] transition-colors disabled:opacity-50"
        >
          {hub.nextQuestion} <ArrowRight size={15} aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onEnd}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#d4a017] text-[#0a1628] text-sm font-semibold hover:bg-[#e0ad1c] transition-colors disabled:opacity-50"
        >
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" /> {hub.evaluating}
            </>
          ) : (
            <>
              <Flag size={15} aria-hidden="true" /> {hub.finishReport}
            </>
          )}
        </button>
      )}

      {/* End call */}
      <button
        type="button"
        onClick={onEnd}
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <PhoneOff size={16} aria-hidden="true" />
        <span className="hidden sm:inline">{hub.endCall}</span>
      </button>
    </div>
  );
}
