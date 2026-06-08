// Mock data + types for the candidate-facing "University Career Bridge"
// (/dashboard/universities). This is a lean, credible prototype: all values are
// mock and live in this single module so a real university/partner backend can
// later replace the constants without touching the UI. Display labels live in
// the i18n dictionary (lib/i18n.ts → `universities`); the example *data* here
// (names, programmes, employers) is intentionally English mock content.

export type VerificationStatus = "student_linked" | "graduate_linked";

export interface UniversityProfile {
  name: string;
  faculty: string;
  programme: string;
  graduationYear: number;
  /** Whether the university's career centre is a Tenun partner (mock). */
  careerCentreActive: boolean;
  verification: VerificationStatus;
  location: string;
}

export type ReadinessMetricId =
  | "cv"
  | "interview"
  | "skills"
  | "internship"
  | "portfolio";

export interface ReadinessMetric {
  id: ReadinessMetricId;
  /** 0–100 mock score. */
  value: number;
  /** Where the "Improve" link points (an existing Tenun feature). */
  href: string;
}

export type OpportunityType =
  | "internship"
  | "graduate_programme"
  | "career_fair"
  | "campus_event"
  | "scholarship"
  | "hackathon";

export interface UniversityOpportunity {
  id: string;
  title: string;
  organisation: string;
  type: OpportunityType;
  /** Pre-formatted date/deadline string (no timezone math in a prototype). */
  date: string;
  /** Whether `date` is a deadline (vs. an event date). */
  isDeadline: boolean;
  /** Target role this is most relevant to. */
  relevanceRole: string;
  relevanceLevel: "high" | "medium";
}

export type MentorStatus = "available" | "busy";

export interface AlumniMentor {
  id: string;
  name: string;
  role: string;
  company: string;
  /** Their university background, e.g. "BSc Computer Science '19". */
  background: string;
  expertise: string[];
  status: MentorStatus;
  initials: string;
  accent: string;
}

export interface SkillsGap {
  targetRole: string;
  studied: string;
  /** What the target role typically requires. */
  requires: string[];
  /** Gaps to close between studies and the market. */
  gaps: string[];
}

export type RecommendedActionId =
  | "improveCv"
  | "mockInterview"
  | "addPortfolio"
  | "applyInternship"
  | "shortCourse";

export interface RecommendedAction {
  id: RecommendedActionId;
  href: string;
}

// ── Mock data ───────────────────────────────────────────────────────────────

export const MOCK_UNIVERSITY: UniversityProfile = {
  name: "Universiti Malaya",
  faculty: "Faculty of Computer Science & Information Technology",
  programme: "BSc (Hons) Computer Science",
  graduationYear: 2026,
  careerCentreActive: true,
  verification: "student_linked",
  location: "Kuala Lumpur, Malaysia",
};

export const MOCK_READINESS: ReadinessMetric[] = [
  { id: "cv", value: 72, href: "/dashboard/cv" },
  { id: "interview", value: 58, href: "/dashboard/mock-interview" },
  { id: "skills", value: 64, href: "/dashboard" },
  { id: "internship", value: 49, href: "#opportunities" },
  { id: "portfolio", value: 41, href: "/dashboard/cv/new?style=creative&from=universities" },
];

export const MOCK_OPPORTUNITIES: UniversityOpportunity[] = [
  {
    id: "opp-grab-intern",
    title: "Software Engineering Internship 2026",
    organisation: "Grab",
    type: "internship",
    date: "31 Aug 2026",
    isDeadline: true,
    relevanceRole: "Software Engineer",
    relevanceLevel: "high",
  },
  {
    id: "opp-maybank-grad",
    title: "Maybank GO Ahead Graduate Programme",
    organisation: "Maybank",
    type: "graduate_programme",
    date: "15 Sep 2026",
    isDeadline: true,
    relevanceRole: "Data Analyst",
    relevanceLevel: "medium",
  },
  {
    id: "opp-um-careerfair",
    title: "UM Tech & Innovation Career Fair",
    organisation: "UM Career Centre",
    type: "career_fair",
    date: "12 Jul 2026",
    isDeadline: false,
    relevanceRole: "Software Engineer",
    relevanceLevel: "high",
  },
  {
    id: "opp-petronas-campus",
    title: "PETRONAS Campus Tech Talk",
    organisation: "PETRONAS Digital",
    type: "campus_event",
    date: "5 Jul 2026",
    isDeadline: false,
    relevanceRole: "Data Analyst",
    relevanceLevel: "medium",
  },
  {
    id: "opp-talentbank-hack",
    title: "Talentbank Career OS Hackathon",
    organisation: "Talentbank",
    type: "hackathon",
    date: "20 Jun 2026",
    isDeadline: true,
    relevanceRole: "Software Engineer",
    relevanceLevel: "high",
  },
  {
    id: "opp-aws-scholarship",
    title: "AWS Cloud Upskilling Scholarship",
    organisation: "AWS Academy",
    type: "scholarship",
    date: "30 Jul 2026",
    isDeadline: true,
    relevanceRole: "Cloud Engineer",
    relevanceLevel: "medium",
  },
];

export const MOCK_ALUMNI: AlumniMentor[] = [
  {
    id: "alum-nurul",
    name: "Nurul Aziz",
    role: "Software Engineer",
    company: "Grab",
    background: "BSc Computer Science '19",
    expertise: ["System design", "Backend", "Technical interviews"],
    status: "available",
    initials: "NA",
    accent: "from-[#0a1628] to-[#345090]",
  },
  {
    id: "alum-weijie",
    name: "Tan Wei Jie",
    role: "Data Scientist",
    company: "Shopee",
    background: "BSc Computer Science '18",
    expertise: ["Machine learning", "SQL", "Analytics cases"],
    status: "busy",
    initials: "TW",
    accent: "from-[#273c6c] to-[#4164b4]",
  },
  {
    id: "alum-farah",
    name: "Farah Lim",
    role: "Product Manager",
    company: "PETRONAS Digital",
    background: "BSc Information Technology '17",
    expertise: ["Product sense", "Stakeholder management", "Roadmapping"],
    status: "available",
    initials: "FL",
    accent: "from-[#7f5e0e] to-[#d4a017]",
  },
];

export const MOCK_SKILLS_GAP: SkillsGap = {
  targetRole: "Software Engineer",
  studied: "Computer Science",
  requires: ["Data structures", "System design", "Cloud deployment", "Version control", "Testing"],
  gaps: ["System design", "Cloud deployment", "Technical interview practice", "GitHub portfolio quality"],
};

export const RECOMMENDED_ACTIONS: RecommendedAction[] = [
  { id: "improveCv", href: "/dashboard/cv" },
  { id: "mockInterview", href: "/dashboard/mock-interview" },
  { id: "addPortfolio", href: "/dashboard/cv/new?style=creative&from=universities" },
  { id: "applyInternship", href: "#opportunities" },
  { id: "shortCourse", href: "/dashboard" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Map a 0–100 readiness score to a band used for colour + label. */
export function readinessBand(value: number): "low" | "mid" | "high" {
  if (value >= 75) return "high";
  if (value >= 50) return "mid";
  return "low";
}

export function readinessColor(value: number): string {
  const band = readinessBand(value);
  if (band === "high") return "#16a34a";
  if (band === "mid") return "#d4a017";
  return "#dc2626";
}

const SAVED_KEY = "tenun-university-saved-opps";

export function loadSavedOpportunities(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function saveOpportunities(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  } catch {
    /* non-fatal */
  }
}
