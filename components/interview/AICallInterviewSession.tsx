"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, ClipboardList, Loader2, Phone, Volume2 } from "lucide-react";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import { VoiceAnswerInput } from "./VoiceAnswerInput";
import { InterviewFeedbackCard } from "./InterviewFeedbackCard";
import { InterviewFinalReport } from "./InterviewFinalReport";
import { AIInterviewerAvatar } from "./AIInterviewerAvatar";
import { InterviewCallControls } from "./InterviewCallControls";
import { InterviewTranscriptPanel } from "./InterviewTranscriptPanel";
import { TargetRoleField, InterviewTypeField, DifficultyField } from "./setup-fields";
import type {
  CallStatus,
  Feedback,
  FinalReport,
  HistoryItem,
  InterviewConfig,
  Locale,
} from "./types";

const MAX_QUESTIONS = 5;
const STORAGE_KEY = "tenun-ai-interview-call";

type Phase = "setup" | "call" | "report";

interface PersistedSession {
  phase: Phase;
  config: InterviewConfig;
  sessionPlan: string[];
  history: HistoryItem[];
  currentQuestion: string;
  currentAnswer: string;
  currentFeedback: Feedback | null;
  pendingNext: string | null;
  questionNumber: number;
  finalReport: FinalReport | null;
}

const DEFAULT_CONFIG: InterviewConfig = {
  targetRole: "",
  interviewType: "general",
  difficulty: "medium",
  cvContext: "",
};

function readLocale(): Locale {
  try {
    const saved = window.localStorage.getItem("tenun-locale");
    if (saved === "ms") return "ms";
    if (saved === "zh-CN") return "zh-CN";
    return "en";
  } catch {
    return "en";
  }
}

interface ApiResponse {
  question?: string | null;
  sessionPlan?: string[];
  feedback?: Feedback | null;
  nextQuestion?: string | null;
  finalReport?: FinalReport | null;
  error?: string;
}

export function AICallInterviewSession({ onExit }: { onExit: () => void }) {
  const { dict } = useLanguage();
  const hub = dict.interviewHub;

  const [phase, setPhase] = useState<Phase>("setup");
  const [config, setConfig] = useState<InterviewConfig>(DEFAULT_CONFIG);
  const [showCvInput, setShowCvInput] = useState(false);

  const [sessionPlan, setSessionPlan] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [pendingNext, setPendingNext] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [finalReport, setFinalReport] = useState<FinalReport | null>(null);

  const [loadingAction, setLoadingAction] = useState<"start" | "evaluate" | "report" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [restored, setRestored] = useState(false);
  const localeRef = useRef<Locale>("en");

  // Speech state
  const [ttsSupported, setTtsSupported] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  // Assume supported until the on-mount check confirms otherwise (avoids a
  // one-frame "not supported" flash in browsers that do support speech input).
  const [micSupported, setMicSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // ── Restore saved session ───────────────────────────────────────────────
  useEffect(() => {
    localeRef.current = readLocale();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as PersistedSession;
        if (s && s.phase) {
          setPhase(s.phase);
          setConfig(s.config ?? DEFAULT_CONFIG);
          setSessionPlan(s.sessionPlan ?? []);
          setHistory(s.history ?? []);
          setCurrentQuestion(s.currentQuestion ?? "");
          setCurrentAnswer(s.currentAnswer ?? "");
          setCurrentFeedback(s.currentFeedback ?? null);
          setPendingNext(s.pendingNext ?? null);
          setQuestionNumber(s.questionNumber ?? 1);
          setFinalReport(s.finalReport ?? null);
          if (s.config?.cvContext) setShowCvInput(true);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setRestored(true);
  }, []);

  // ── Persist session ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!restored) return;
    if (phase === "setup" && history.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const snapshot: PersistedSession = {
      phase, config, sessionPlan, history, currentQuestion,
      currentAnswer, currentFeedback, pendingNext, questionNumber, finalReport,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      /* non-fatal */
    }
  }, [restored, phase, config, sessionPlan, history, currentQuestion,
      currentAnswer, currentFeedback, pendingNext, questionNumber, finalReport]);

  // ── Text-to-speech ────────────────────────────────────────────────────────
  useEffect(() => {
    setTtsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (mutedRef.current || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      localeRef.current === "ms" ? "ms-MY" : localeRef.current === "zh-CN" ? "zh-CN" : "en-US";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  // Narrate a freshly-asked question (only when it has no feedback yet).
  useEffect(() => {
    if (phase === "call" && currentQuestion && !currentFeedback) {
      speak(currentQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, phase]);

  // ── API helper ────────────────────────────────────────────────────────────
  const callApi = useCallback(async (payload: Record<string, unknown>): Promise<ApiResponse> => {
    const res = await fetch("/api/mock-interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, locale: localeRef.current }),
    });
    const data = (await res.json().catch(() => ({}))) as ApiResponse;
    if (!res.ok) {
      throw new Error(data.error || "The interview coach could not respond. Please try again.");
    }
    return data;
  }, []);

  const configPayload = useCallback(
    () => ({
      targetRole: config.targetRole,
      interviewType: config.interviewType,
      difficulty: config.difficulty,
      cvContext: config.cvContext,
    }),
    [config]
  );

  // ── Actions ─────────────────────────────────────────────────────────────────
  async function handleStart() {
    if (!config.targetRole.trim()) {
      setError(hub.targetRoleRequired);
      return;
    }
    setError(null);
    setLoadingAction("start");
    try {
      const data = await callApi({ mode: "start", ...configPayload() });
      if (!data.question) throw new Error("The interview coach did not return a question. Please try again.");
      setSessionPlan(data.sessionPlan ?? []);
      setHistory([]);
      setCurrentAnswer("");
      setCurrentFeedback(null);
      setPendingNext(null);
      setQuestionNumber(1);
      setFinalReport(null);
      setPhase("call");
      setCurrentQuestion(data.question);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the interview.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleSubmitAnswer() {
    if (!currentAnswer.trim()) {
      setError("Please type or speak an answer before submitting. Add a concrete example if you can.");
      return;
    }
    stopSpeaking();
    setError(null);
    setLoadingAction("evaluate");
    try {
      const data = await callApi({
        mode: "evaluate_answer",
        ...configPayload(),
        currentQuestion,
        answer: currentAnswer,
        history,
      });
      if (!data.feedback) throw new Error("The interview coach did not return feedback. Please try again.");
      setHistory((prev) => [
        ...prev,
        { question: currentQuestion, answer: currentAnswer, feedback: data.feedback ?? undefined },
      ]);
      setCurrentFeedback(data.feedback);
      setPendingNext(data.nextQuestion ?? null);
      if (data.feedback.summary) speak(data.feedback.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not evaluate your answer.");
    } finally {
      setLoadingAction(null);
    }
  }

  const answeredCount = history.length;
  const isLastQuestion = answeredCount >= MAX_QUESTIONS || (currentFeedback !== null && !pendingNext);

  function handleNextQuestion() {
    stopSpeaking();
    if (!pendingNext || answeredCount >= MAX_QUESTIONS) {
      void handleEndSession();
      return;
    }
    setCurrentAnswer("");
    setCurrentFeedback(null);
    setQuestionNumber((n) => n + 1);
    setError(null);
    setCurrentQuestion(pendingNext);
    setPendingNext(null);
  }

  async function handleEndSession() {
    stopSpeaking();
    // Not enough history to report — just leave the call cleanly.
    if (history.length === 0) {
      handleRestart();
      return;
    }
    setError(null);
    setLoadingAction("report");
    try {
      const data = await callApi({ mode: "final_report", ...configPayload(), history });
      if (!data.finalReport) throw new Error("Could not generate the final report. Please try again.");
      setFinalReport(data.finalReport);
      setPhase("report");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate the final report.");
    } finally {
      setLoadingAction(null);
    }
  }

  function handleRestart() {
    stopSpeaking();
    window.localStorage.removeItem(STORAGE_KEY);
    setPhase("setup");
    setSessionPlan([]);
    setHistory([]);
    setCurrentQuestion("");
    setCurrentAnswer("");
    setCurrentFeedback(null);
    setPendingNext(null);
    setQuestionNumber(1);
    setFinalReport(null);
    setError(null);
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (next) {
        window.speechSynthesis?.cancel();
        setSpeaking(false);
      }
      return next;
    });
  }

  // ── Derived call status ─────────────────────────────────────────────────────
  const status: CallStatus = (() => {
    if (phase !== "call") return "idle";
    if (loadingAction === "start") return "preparing";
    if (loadingAction === "evaluate" || loadingAction === "report") return "thinking";
    if (speaking) return "speaking";
    if (currentFeedback) return "feedback";
    if (listening) return "listening";
    return "idle";
  })();

  const statusLabel: Record<CallStatus, string> = {
    idle: hub.statusIdle,
    preparing: hub.statusPreparing,
    speaking: hub.statusSpeaking,
    listening: hub.statusListening,
    thinking: hub.statusThinking,
    feedback: hub.statusFeedback,
    ended: hub.statusEnded,
  };

  const speechLang =
    localeRef.current === "ms" ? "ms-MY" : localeRef.current === "zh-CN" ? "zh-CN" : "en-US";
  const busy = loadingAction !== null;

  if (!restored) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={22} className="animate-spin text-[#0a1628]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      {/* Back to hub */}
      <button
        onClick={() => {
          stopSpeaking();
          onExit();
        }}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft size={15} aria-hidden="true" /> {hub.back}
      </button>

      {error && (
        <div role="alert" className="flex items-start gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-700 leading-snug">{error}</p>
        </div>
      )}

      {/* ── SETUP ──────────────────────────────────────────────────────────── */}
      {phase === "setup" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-beige-300 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-navy-900">{hub.setupTitle}</h2>
            <p className="text-sm text-navy-500 mt-1">
              {hub.interviewerName}, {hub.interviewerRole}.
            </p>
          </div>

          <TargetRoleField
            hub={hub}
            value={config.targetRole}
            onChange={(v) => setConfig((c) => ({ ...c, targetRole: v }))}
          />
          <InterviewTypeField
            hub={hub}
            value={config.interviewType}
            onChange={(v) => {
              setConfig((c) => ({ ...c, interviewType: v }));
              if (v === "cv_based") setShowCvInput(true);
            }}
          />
          <DifficultyField
            hub={hub}
            value={config.difficulty}
            onChange={(v) => setConfig((c) => ({ ...c, difficulty: v }))}
          />

          {/* Optional CV context */}
          <div>
            {!showCvInput ? (
              <button
                type="button"
                onClick={() => setShowCvInput(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-600 hover:text-navy-900 transition-colors"
              >
                <ClipboardList size={15} aria-hidden="true" /> {hub.cvContextToggle}
              </button>
            ) : (
              <div>
                <label htmlFor="cvContext" className="block text-sm font-semibold text-navy-900 mb-1.5">
                  {hub.cvContextLabel} <span className="font-normal text-navy-400">{hub.optional}</span>
                </label>
                <p className="text-xs text-navy-400 mb-2">{hub.cvContextHint}</p>
                <textarea
                  id="cvContext"
                  value={config.cvContext}
                  onChange={(e) => setConfig((c) => ({ ...c, cvContext: e.target.value }))}
                  rows={4}
                  placeholder={hub.cvContextPlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-[#d4a017]/20 transition-all resize-y"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a1628] text-white text-sm font-semibold hover:bg-[#1a2a4a] transition-colors disabled:opacity-60"
          >
            {loadingAction === "start" ? (
              <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> {hub.statusPreparing}…</>
            ) : (
              <><Phone size={16} aria-hidden="true" /> {hub.startCall}</>
            )}
          </button>
        </div>
      )}

      {/* ── CALL ───────────────────────────────────────────────────────────── */}
      {phase === "call" && (
        <div className="space-y-5">
          {/* Progress + role */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-navy-900">
              {hub.questionProgress} {Math.min(questionNumber, MAX_QUESTIONS)}{" "}
              <span className="font-normal text-navy-400">{hub.of} {MAX_QUESTIONS}</span>
            </p>
            {config.targetRole && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#d4a017]/15 text-[#a97d12] border border-[#d4a017]/20">
                {config.targetRole}
              </span>
            )}
          </div>
          <div className="h-1.5 w-full rounded-full bg-beige-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#d4a017] transition-all"
              style={{ width: `${(Math.min(questionNumber, MAX_QUESTIONS) / MAX_QUESTIONS) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Avatar */}
            <div className="lg:col-span-1">
              <AIInterviewerAvatar
                status={status}
                name={hub.interviewerName}
                role={hub.interviewerRole}
                statusLabel={statusLabel[status]}
              />
            </div>

            {/* Question + answer/feedback + controls */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-beige-300 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1.5">
                      {hub.interviewerAsks}
                    </p>
                    <p className="text-base text-navy-900 leading-relaxed">{currentQuestion}</p>
                  </div>
                  {ttsSupported && !muted && (
                    <button
                      type="button"
                      onClick={() => (speaking ? stopSpeaking() : speak(currentQuestion))}
                      aria-label={hub.replayQuestion}
                      className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-beige-300 text-navy-600 hover:border-navy-300 hover:text-navy-900 transition-colors"
                    >
                      <Volume2 size={17} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              {!currentFeedback ? (
                <div className="bg-white rounded-2xl border border-beige-300 shadow-sm p-5 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                    {hub.yourAnswerLabel}
                  </p>
                  <VoiceAnswerInput
                    value={currentAnswer}
                    onChange={setCurrentAnswer}
                    disabled={loadingAction === "evaluate"}
                    lang={speechLang}
                    placeholder={hub.answerPlaceholder}
                    rows={5}
                    onListeningChange={setListening}
                    onSupportChange={setMicSupported}
                  />
                  {!micSupported && (
                    <p className="text-xs text-navy-400">{hub.micUnsupported}</p>
                  )}
                  <InterviewCallControls
                    hub={hub}
                    phase="answering"
                    busy={busy}
                    ttsSupported={ttsSupported}
                    muted={muted}
                    onToggleMute={toggleMute}
                    canSubmit={currentAnswer.trim().length > 0}
                    onSubmit={handleSubmitAnswer}
                    showNext={false}
                    isLast={isLastQuestion}
                    onNext={handleNextQuestion}
                    onEnd={handleEndSession}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <InterviewFeedbackCard feedback={currentFeedback} />
                  <InterviewCallControls
                    hub={hub}
                    phase="feedback"
                    busy={busy}
                    ttsSupported={ttsSupported}
                    muted={muted}
                    onToggleMute={toggleMute}
                    canSubmit={false}
                    onSubmit={handleSubmitAnswer}
                    showNext={!isLastQuestion}
                    isLast={isLastQuestion}
                    onNext={handleNextQuestion}
                    onEnd={handleEndSession}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Transcript */}
          <InterviewTranscriptPanel
            hub={hub}
            interviewerName={hub.interviewerName}
            history={history}
            currentQuestion={currentFeedback ? "" : currentQuestion}
          />

          {sessionPlan.length > 0 && (
            <details className="bg-white/60 rounded-xl border border-beige-200 px-4 py-3">
              <summary className="text-xs font-semibold text-navy-500 cursor-pointer select-none">
                {hub.transcriptTitle} · {sessionPlan.length}
              </summary>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                {sessionPlan.map((item, i) => (
                  <li key={i} className="text-xs text-navy-500">{item}</li>
                ))}
              </ol>
            </details>
          )}
        </div>
      )}

      {/* ── REPORT ─────────────────────────────────────────────────────────── */}
      {phase === "report" && finalReport && (
        <div className="max-w-2xl mx-auto">
          <InterviewFinalReport
            report={finalReport}
            onRestart={handleRestart}
            targetRole={config.targetRole}
            roleLabel={hub.reportForRole}
            restartLabel={hub.newInterview}
          />
        </div>
      )}
    </div>
  );
}
