"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText, Palette, Upload, PenLine, ChevronRight, ChevronLeft, Loader2,
  Sparkles, Paperclip, AlertCircle, Check,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { initCV, loadBlocks } from "@/store/slices/cvSlice";
import type { CVStyle, CVFormat, CVBlock } from "@/lib/cv-types";
import { DEFAULT_BLOCK_CONTENT, DEFAULT_BLOCK_ORDER, newId } from "@/lib/cv-types";
import { createCVInSupabase } from "@/lib/cv-persist";
import { buildBlocksFromGenerated } from "@/lib/cv-generate";
import { AppTopBar } from "@/components/layout/AppTopBar";

type Step = "format" | "style" | "job" | "start";
const STEPS: Step[] = ["format", "style", "job", "start"];
const STEP_LABELS = ["Format", "Style", "Target Role", "Start"];

// Labeled stepper — replaces the old anonymous dots so users always know which
// stage of the wizard they're on.
function StepIndicator({ currentIdx }: { currentIdx: number }) {
  return (
    <div className="mb-6">
      <ol className="flex items-center">
        {STEP_LABELS.map((label, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          const isLast = i === STEP_LABELS.length - 1;
          return (
            <li key={label} className={isLast ? "flex items-center" : "flex items-center flex-1"}>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={[
                    "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-colors",
                    current ? "bg-[#0a1628] text-white"
                      : done ? "bg-[#d4a017] text-[#0a1628]"
                      : "bg-beige-200 text-navy-400",
                  ].join(" ")}
                >
                  {done ? <Check size={13} /> : i + 1}
                </span>
                <span
                  className={[
                    "hidden sm:inline text-xs font-medium whitespace-nowrap transition-colors",
                    current ? "text-navy-900" : done ? "text-navy-700" : "text-navy-400",
                  ].join(" ")}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <span className={["flex-1 h-px mx-2", done ? "bg-[#d4a017]" : "bg-beige-300"].join(" ")} />
              )}
            </li>
          );
        })}
      </ol>
      <p className="sm:hidden text-center text-[11px] text-navy-500 mt-2">
        Step {currentIdx + 1} of {STEP_LABELS.length} ·{" "}
        <span className="font-semibold text-navy-700">{STEP_LABELS[currentIdx]}</span>
      </p>
    </div>
  );
}

function makeBlock(type: CVBlock["type"]): CVBlock {
  return { id: newId(), type, content: { ...DEFAULT_BLOCK_CONTENT[type] } };
}

function buildDefaultBlocks(): CVBlock[] {
  return DEFAULT_BLOCK_ORDER.map(makeBlock);
}

/** Read the user's saved language preference (set by the i18n LanguageProvider). */
function readLocale(): "en" | "ms" {
  try {
    return window.localStorage.getItem("tenun-locale") === "ms" ? "ms" : "en";
  } catch {
    return "en";
  }
}

function NewCVFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const uploadMode = searchParams.get("upload") === "true";

  const [step, setStep] = useState<Step>(() => {
    if (uploadMode) return "start";
    if (searchParams.get("style") as CVStyle) return "job";
    return "format";
  });
  const [format, setFormatState] = useState<CVFormat>("resume");
  const [style, setStyleState] = useState<CVStyle>(
    (searchParams.get("style") as CVStyle) ?? "harvard"
  );
  const [targetJob, setTargetJobState] = useState("");
  const [notes, setNotes] = useState("");
  const [genFile, setGenFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const genFileRef = useRef<HTMLInputElement>(null);
  const uploadFileRef = useRef<HTMLInputElement>(null);

  const busy = generating || uploading || creating;
  const currentIdx = STEPS.indexOf(step);

  function prev() {
    if (currentIdx > 0) setStep(STEPS[currentIdx - 1]);
  }

  function next() {
    if (currentIdx < STEPS.length - 1) setStep(STEPS[currentIdx + 1]);
  }

  const title = targetJob ? `CV for ${targetJob}` : "Untitled CV";

  // Persist the new CV and move on to the editor. When Supabase isn't
  // configured the save is skipped and the editor runs from Redux state.
  async function finishCreate(blocks: CVBlock[]) {
    const id = newId();
    await createCVInSupabase({ id, title, style, format, targetJob }, blocks);
    dispatch(initCV({ id, title, style, format, targetJob }));
    dispatch(loadBlocks(blocks));
    router.push(`/dashboard/cv/${id}/edit`);
  }

  async function extractText(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/extract-text", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Could not read that file. Please try another PDF.");
    }
    const { text } = await res.json();
    return text ?? "";
  }

  async function handleGenerate() {
    setError(null);
    setGenerating(true);
    try {
      const fileText = genFile ? await extractText(genFile) : "";
      // Combine the user's rough notes with any uploaded text — both feed the draft.
      const resumeText = [notes.trim(), fileText].filter(Boolean).join("\n\n");

      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetJob, format, style, locale: readLocale() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Generation failed. Please try again.");
      }

      const { generated } = await res.json();
      await finishCreate(buildBlocksFromGenerated(generated));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setGenerating(false);
    }
  }

  async function handleFresh() {
    setError(null);
    setCreating(true);
    try {
      await finishCreate(buildDefaultBlocks());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create your CV. Please try again.");
      setCreating(false);
    }
  }

  async function handleUpload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const text = await extractText(file);

      const parseRes = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const { profile } = parseRes.ok ? await parseRes.json() : { profile: null };

      const blocks = buildDefaultBlocks();

      const infoBlock = blocks.find((b) => b.type === "personal_info");
      if (infoBlock && profile?.name) infoBlock.content.name = profile.name;

      const summaryBlock = blocks.find((b) => b.type === "summary");
      if (summaryBlock && profile?.experience) summaryBlock.content.text = profile.experience;

      const skillsBlock = blocks.find((b) => b.type === "skills");
      if (skillsBlock && profile?.skills?.length) skillsBlock.content.items = profile.skills;

      await finishCreate(blocks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not import that file. Please try again.");
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <AppTopBar
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "CV Builder", href: "/dashboard/cv" },
          { label: "New CV" },
        ]}
        actions={
          <Link
            href="/dashboard/cv"
            className="inline-flex items-center gap-1.5 rounded-lg border border-beige-300 bg-white px-3 py-1.5 text-xs font-medium text-navy-700 hover:border-navy-300 transition-colors"
          >
            <ChevronLeft size={14} /> <span className="hidden sm:inline">Back to Your CVs</span>
          </Link>
        }
        returnTo={{ href: "/dashboard", label: "Exit to Dashboard" }}
      />

      <div className="flex items-start justify-center p-4 pt-8 sm:pt-10">
        <div className="w-full max-w-lg">
          {/* Intro */}
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl text-navy-900">Create a new CV</h1>
            <p className="text-sm text-navy-500 mt-1.5">
              Create a CV from scratch, upload an existing one, or let Tenun generate a first draft.
            </p>
          </div>

          <StepIndicator currentIdx={currentIdx} />

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Format step */}
          {step === "format" && (
            <StepLayout
              title="What are you building?"
              subtitle="This sets the page limit."
              onNext={next}
              canNext
            >
              <div className="grid grid-cols-2 gap-3">
                {([["resume", "Resume", "1 page — concise and direct"], ["cv", "CV", "2 pages — full detail"]] as const).map(
                  ([val, label, desc]) => (
                    <button
                      key={val}
                      onClick={() => setFormatState(val)}
                      className={[
                        "text-left p-4 rounded-xl border-2 transition-all",
                        format === val ? "border-[#0a1628] bg-[#0a1628]/5" : "border-gray-200 hover:border-gray-300",
                      ].join(" ")}
                    >
                      <p className="font-semibold text-[#0a1628] text-sm">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </button>
                  )
                )}
              </div>
            </StepLayout>
          )}

          {/* Style step */}
          {step === "style" && (
            <StepLayout title="Pick a style" subtitle="You can switch later." onNext={next} onPrev={prev} canNext>
              <div className="grid grid-cols-2 gap-3">
                <StyleCard
                  id="harvard"
                  label="Harvard / ATS"
                  description="Clean layout, optimised for applicant tracking systems."
                  icon={<FileText size={20} className="text-[#4164b4]" />}
                  accent="#4164b4"
                  selected={style === "harvard"}
                  onSelect={() => setStyleState("harvard")}
                />
                <StyleCard
                  id="creative"
                  label="Creative / Visual"
                  description="Two-column layout with colour accents and portfolio."
                  icon={<Palette size={20} className="text-[#6c5ce7]" />}
                  accent="#6c5ce7"
                  selected={style === "creative"}
                  onSelect={() => setStyleState("creative")}
                />
              </div>
            </StepLayout>
          )}

          {/* Target job step */}
          {step === "job" && (
            <StepLayout
              title="What role are you targeting?"
              subtitle="Optional — helps us tailor your CV sections."
              onNext={next}
              onPrev={prev}
              canNext
            >
              <input
                type="text"
                value={targetJob}
                onChange={(e) => setTargetJobState(e.target.value)}
                placeholder="e.g. Product Manager, UX Designer..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0a1628] placeholder:text-gray-300 focus:outline-none focus:border-[#0a1628] transition-colors"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && next()}
              />
            </StepLayout>
          )}

          {/* Start step */}
          {step === "start" && (
            <StepLayout title="How do you want to start?" onPrev={prev} canNext={false}>
              <div className="space-y-3">
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100">
                    <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-600 leading-snug">{error}</p>
                  </div>
                )}

                {/* Generate with AI — primary */}
                <div className="rounded-xl border-2 border-[#d4a017] bg-[#d4a017]/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-[#d4a017]/15 flex items-center justify-center shrink-0">
                      <Sparkles size={18} className="text-[#d4a017]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0a1628] text-sm flex items-center gap-2">
                        Tell Tenun what you&apos;ve done
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#d4a017]">Recommended</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Describe your background in plain English — we&apos;ll turn it into a
                        {" "}{format === "cv" ? "CV" : "resume"}
                        {targetJob ? ` for ${targetJob}` : ""} you can edit.
                      </p>
                    </div>
                  </div>

                  {/* Rough-notes input */}
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder={"e.g. I'm a software engineer. I write backend services and use Perforce to ship. I built a React + Supabase dashboard and led a student project."}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-xs text-[#0a1628] placeholder:text-gray-300 focus:outline-none focus:border-[#d4a017] focus:ring-2 focus:ring-[#d4a017]/15 transition-all resize-none"
                  />

                  {/* Example starter chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "I'm a software engineer",
                      "I worked on backend systems",
                      "I built a React + Supabase dashboard",
                      "I led a student project",
                    ].map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => setNotes((n) => (n.trim() ? `${n.trim()}. ${ex}` : ex))}
                        className="px-2.5 py-1 rounded-full border border-beige-300 bg-white text-[11px] text-gray-500 hover:border-[#d4a017] hover:text-[#0a1628] transition-colors"
                      >
                        + {ex}
                      </button>
                    ))}
                  </div>

                  {/* Optional file attach */}
                  <button
                    onClick={() => genFileRef.current?.click()}
                    disabled={busy}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-300 bg-white text-left hover:border-[#d4a017] transition-colors disabled:opacity-50"
                  >
                    <Paperclip size={14} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-500 truncate flex-1">
                      {genFile ? genFile.name : "Attach an existing CV / resume / portfolio (PDF, optional)"}
                    </span>
                    {genFile && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setGenFile(null); }}
                        className="text-[11px] text-gray-400 hover:text-red-400 shrink-0"
                      >
                        Remove
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleGenerate}
                    disabled={busy}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4a017] text-[#0a1628] text-sm font-semibold hover:bg-[#e0ad1c] transition-colors disabled:opacity-60"
                  >
                    {generating ? (
                      <><Loader2 size={15} className="animate-spin" /> Generating your {format === "cv" ? "CV" : "resume"}…</>
                    ) : (
                      <><Sparkles size={15} /> Generate CV</>
                    )}
                  </button>
                </div>

                {/* Secondary options */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleFresh}
                    disabled={busy}
                    className="flex items-center gap-2.5 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0a1628] hover:bg-[#0a1628]/5 transition-all text-left disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      {creating ? <Loader2 size={15} className="animate-spin text-gray-400" /> : <PenLine size={15} className="text-gray-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#0a1628] text-xs">Start fresh</p>
                      <p className="text-[11px] text-gray-400 leading-tight">Blank sections</p>
                    </div>
                  </button>

                  <button
                    onClick={() => uploadFileRef.current?.click()}
                    disabled={busy}
                    className="flex items-center gap-2.5 p-3 rounded-xl border-2 border-gray-200 hover:border-[#0a1628] hover:bg-[#0a1628]/5 transition-all text-left disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      {uploading ? <Loader2 size={15} className="animate-spin text-gray-400" /> : <Upload size={15} className="text-gray-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#0a1628] text-xs">Upload &amp; prefill</p>
                      <p className="text-[11px] text-gray-400 leading-tight">Import without AI</p>
                    </div>
                  </button>
                </div>

                <input
                  ref={genFileRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setGenFile(file);
                    e.target.value = "";
                  }}
                />
                <input
                  ref={uploadFileRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>
            </StepLayout>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------

export default function NewCVPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[#0a1628]" />
        </div>
      }
    >
      <NewCVFlow />
    </Suspense>
  );
}

// ---------- Step layout ----------

function StepLayout({
  title, subtitle, children, onNext, onPrev, canNext,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  canNext: boolean;
}) {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-[#0a1628]">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
      <div className="flex items-center justify-between pt-2">
        {onPrev ? (
          <button onClick={onPrev} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft size={14} /> Back
          </button>
        ) : <div />}
        {canNext && onNext && (
          <button
            onClick={onNext}
            className="flex items-center gap-1 px-4 py-2 bg-[#0a1628] text-white rounded-lg text-xs font-medium hover:bg-[#1a2a4a] transition-colors"
          >
            Continue <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Style card ----------

function StyleCard({ label, description, icon, accent, selected, onSelect }: {
  id: string; label: string; description: string;
  icon: React.ReactNode; accent: string; selected: boolean; onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="text-left p-4 rounded-xl border-2 transition-all"
      style={{ borderColor: selected ? accent : undefined }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = "#e5e7eb"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = ""; }}
    >
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: accent + "15" }}>
        {icon}
      </div>
      <p className="font-semibold text-[#0a1628] text-xs">{label}</p>
      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{description}</p>
    </button>
  );
}
