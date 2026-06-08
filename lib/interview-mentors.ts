// Mock mentor data + local booking persistence for the Mentor Mock Interview
// pathway. This is a polished prototype: bookings are stored in localStorage on
// the user's device. The shape is intentionally close to what a real
// calendar/video backend would return, so a future integration can replace the
// storage layer (loadBookings/saveBooking) without touching the UI.

import type { Mentor, MentorBooking } from "@/components/interview/types";

export const MENTOR_BOOKING_DURATION_MINUTES = 30;

// ── Mock mentors ────────────────────────────────────────────────────────────
// Names/photos are placeholders. Avatars render as gradient initials (no
// external image dependency). Slot labels are pre-formatted human strings to
// avoid timezone math and SSR hydration mismatches in this prototype.

export const MENTORS: Mentor[] = [
  {
    id: "mentor-aisha-rahman",
    name: "Aisha Rahman",
    title: "Senior Software Engineer, ex-Grab",
    initials: "AR",
    accent: "from-[#0a1628] to-[#345090]",
    expertise: ["System design", "Data structures", "Frontend", "Career growth"],
    supportedTypes: ["technical", "behavioural", "general", "role_specific"],
    exampleRoles: ["Software Engineer", "Frontend Engineer", "Full-Stack Developer"],
    bio: "Runs realistic coding and system-design interviews, then walks you through how a hiring panel would actually score your answers.",
    slots: [
      { id: "ar-1", label: "Mon, 10:00 AM" },
      { id: "ar-2", label: "Wed, 2:30 PM" },
      { id: "ar-3", label: "Fri, 4:00 PM" },
    ],
  },
  {
    id: "mentor-daniel-lim",
    name: "Daniel Lim",
    title: "Group Product Manager, SaaS",
    initials: "DL",
    accent: "from-[#7f5e0e] to-[#d4a017]",
    expertise: ["Product sense", "Prioritisation", "Metrics", "Stakeholder management"],
    supportedTypes: ["case_study", "behavioural", "general", "role_specific"],
    exampleRoles: ["Product Manager", "Associate PM", "Product Owner"],
    bio: "Specialises in product-sense and execution cases. Expect probing follow-ups and a clear framework you can reuse in real interviews.",
    slots: [
      { id: "dl-1", label: "Tue, 9:30 AM" },
      { id: "dl-2", label: "Thu, 1:00 PM" },
      { id: "dl-3", label: "Sat, 11:00 AM" },
    ],
  },
  {
    id: "mentor-priya-nair",
    name: "Priya Nair",
    title: "Lead Data Analyst, e-commerce",
    initials: "PN",
    accent: "from-[#273c6c] to-[#4164b4]",
    expertise: ["SQL", "Analytics cases", "Storytelling with data", "A/B testing"],
    supportedTypes: ["technical", "case_study", "general", "cv_based"],
    exampleRoles: ["Data Analyst", "Business Analyst", "Data Scientist"],
    bio: "Mixes hands-on analytics questions with case-style problems so you can practise both the technical and the communication side.",
    slots: [
      { id: "pn-1", label: "Mon, 3:00 PM" },
      { id: "pn-2", label: "Wed, 11:30 AM" },
      { id: "pn-3", label: "Fri, 9:00 AM" },
    ],
  },
  {
    id: "mentor-faiz-osman",
    name: "Faiz Osman",
    title: "Engagement Manager, ex-consulting",
    initials: "FO",
    accent: "from-[#1a2848] to-[#6783c3]",
    expertise: ["Case interviews", "Structuring", "Mental math", "Executive presence"],
    supportedTypes: ["case_study", "behavioural", "general"],
    exampleRoles: ["Management Consultant", "Strategy Associate", "Business Analyst"],
    bio: "Classic case-interview coaching — market sizing, profitability, and structuring — with direct feedback on how you communicate under pressure.",
    slots: [
      { id: "fo-1", label: "Tue, 4:30 PM" },
      { id: "fo-2", label: "Thu, 10:00 AM" },
      { id: "fo-3", label: "Sat, 2:00 PM" },
    ],
  },
  {
    id: "mentor-mei-chen",
    name: "Mei Chen",
    title: "Marketing Director, consumer brands",
    initials: "MC",
    accent: "from-[#543f09] to-[#e7b733]",
    expertise: ["Brand & growth", "Campaign strategy", "Portfolio review", "Storytelling"],
    supportedTypes: ["behavioural", "role_specific", "general", "cv_based"],
    exampleRoles: ["Marketing Executive", "Brand Manager", "Growth Marketer"],
    bio: "Helps you tell a sharp story about your campaigns and results, and prepares you for role-specific marketing interview questions.",
    slots: [
      { id: "mc-1", label: "Mon, 1:30 PM" },
      { id: "mc-2", label: "Wed, 5:00 PM" },
      { id: "mc-3", label: "Fri, 11:00 AM" },
    ],
  },
  {
    id: "mentor-arjun-mehta",
    name: "Arjun Mehta",
    title: "Career Coach & ex-Recruiter",
    initials: "AM",
    accent: "from-[#345090] to-[#8da2d2]",
    expertise: ["Behavioural / STAR", "CV deep-dives", "Storytelling", "Salary talk"],
    supportedTypes: ["behavioural", "cv_based", "general"],
    exampleRoles: ["Any role", "Fresh graduates", "Career switchers"],
    bio: "A friendly all-rounder for behavioural and CV-based interviews — great if you're early-career or switching fields and want to build confidence.",
    slots: [
      { id: "am-1", label: "Tue, 11:00 AM" },
      { id: "am-2", label: "Thu, 3:30 PM" },
      { id: "am-3", label: "Sat, 10:00 AM" },
    ],
  },
];

export function getMentorById(id: string): Mentor | undefined {
  return MENTORS.find((m) => m.id === id);
}

// ── Booking persistence (localStorage) ──────────────────────────────────────
// Swap these two functions for API calls when a real backend exists; the UI
// only depends on this module's interface.

const BOOKINGS_KEY = "tenun-mentor-bookings";

export function loadBookings(): MentorBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MentorBooking[]) : [];
  } catch {
    return [];
  }
}

function writeBookings(bookings: MentorBooking[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {
    /* storage full / unavailable — non-fatal for a prototype */
  }
}

/** Persist a booking (most-recent first) and return the updated list. */
export function saveBooking(booking: MentorBooking): MentorBooking[] {
  const next = [booking, ...loadBookings()];
  writeBookings(next);
  return next;
}

export function cancelBooking(bookingId: string): MentorBooking[] {
  const next = loadBookings().filter((b) => b.id !== bookingId);
  writeBookings(next);
  return next;
}

/** Generate a reasonably unique id without external deps. */
export function makeBookingId(): string {
  const rand = Math.floor(Math.random() * 1e9).toString(36);
  return `bk-${Date.now().toString(36)}-${rand}`;
}
