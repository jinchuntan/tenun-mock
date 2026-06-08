// Shared types for the Mock Interview Hub — a dedicated interview-practice
// workspace with two pathways: a live-style AI interview call and a 30-minute
// mentor mock-interview booking. (Unrelated to the chatbot / Tenun Guide.)

export type Locale = "en" | "ms" | "zh-CN";

/** The two top-level pathways the user can choose in the hub. */
export type InterviewMode = "ai" | "mentor";

/** Interview formats supported across both the AI and mentor pathways. */
export type InterviewType =
  | "general"
  | "behavioural"
  | "technical"
  | "case_study"
  | "cv_based"
  | "role_specific";

export const INTERVIEW_TYPE_IDS: InterviewType[] = [
  "general",
  "behavioural",
  "technical",
  "case_study",
  "cv_based",
  "role_specific",
];

export type Difficulty = "easy" | "medium" | "challenging";

export const DIFFICULTY_IDS: Difficulty[] = ["easy", "medium", "challenging"];

// ── AI interview feedback / reporting ───────────────────────────────────────

export interface Feedback {
  score: number;
  summary: string;
  whatWentWell: string[];
  toImprove: string[];
  sampleAnswer: string;
}

export interface HistoryItem {
  question: string;
  answer?: string;
  feedback?: Feedback;
}

export interface FinalReport {
  overallScore: number;
  strengths: string[];
  improvementAreas: string[];
  recommendedPractice: string[];
}

/** Shared configuration for an interview (role, type, difficulty, context). */
export interface InterviewConfig {
  targetRole: string;
  interviewType: InterviewType;
  difficulty: Difficulty;
  cvContext: string;
}

// ── AI live-style call ──────────────────────────────────────────────────────

/**
 * Status states surfaced in the AI call UI. These drive the avatar animation,
 * the status pill, and accessibility announcements.
 */
export type CallStatus =
  | "idle" // before the call starts
  | "preparing" // generating the first question
  | "speaking" // interviewer is asking / narrating
  | "listening" // capturing the candidate's spoken answer
  | "thinking" // evaluating the answer / fetching the next question
  | "feedback" // showing feedback for the latest answer
  | "ended"; // call finished

// ── Mentor booking ──────────────────────────────────────────────────────────

export interface MentorSlot {
  /** Stable id used as the React key and stored on the booking. */
  id: string;
  /** Human-readable label, e.g. "Tue, 10:00 AM". Pre-formatted to avoid SSR
   *  hydration mismatches and timezone math in a mock prototype. */
  label: string;
}

export interface Mentor {
  id: string;
  name: string;
  /** Title / professional background, e.g. "Senior PM at a fintech". */
  title: string;
  /** Two-letter initials used by the avatar placeholder. */
  initials: string;
  /** Tailwind gradient classes for the avatar placeholder. */
  accent: string;
  /** Focus areas the mentor specialises in. */
  expertise: string[];
  /** Interview types this mentor can run. */
  supportedTypes: InterviewType[];
  /** Example target roles this mentor can interview for. */
  exampleRoles: string[];
  /** Short description of how they can help. */
  bio: string;
  /** Available 30-minute slots. */
  slots: MentorSlot[];
}

export type BookingStatus = "scheduled";

/** A persisted mentor booking (stored locally on the device). */
export interface MentorBooking {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorTitle: string;
  mentorInitials: string;
  mentorAccent: string;
  targetRole: string;
  interviewType: InterviewType;
  difficulty: Difficulty;
  slotId: string;
  slotLabel: string;
  notes: string;
  durationMinutes: number;
  status: BookingStatus;
  /** Epoch ms of when the booking was created (display/sort only). */
  createdAt: number;
}
