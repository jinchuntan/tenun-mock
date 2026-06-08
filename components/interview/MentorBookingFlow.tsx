"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, CalendarClock, Clock, Trash2, Video } from "lucide-react";

import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  MENTORS,
  MENTOR_BOOKING_DURATION_MINUTES,
  cancelBooking,
  loadBookings,
  makeBookingId,
  saveBooking,
} from "@/lib/interview-mentors";
import { MentorCard } from "./MentorCard";
import { MentorBookingConfirmation } from "./MentorBookingConfirmation";
import { MentorCallRoom } from "./MentorCallRoom";
import { TargetRoleField, InterviewTypeField, DifficultyField } from "./setup-fields";
import {
  INTERVIEW_TYPE_IDS,
  type Difficulty,
  type InterviewType,
  type Mentor,
  type MentorBooking,
} from "./types";

type Step = "browse" | "booked" | "call";

export function MentorBookingFlow({ onExit }: { onExit: () => void }) {
  const { dict } = useLanguage();
  const hub = dict.interviewHub;

  const [step, setStep] = useState<Step>("browse");
  const [filter, setFilter] = useState<InterviewType | "all">("all");

  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType>("general");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [notes, setNotes] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [activeBooking, setActiveBooking] = useState<MentorBooking | null>(null);
  const [bookings, setBookings] = useState<MentorBooking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBookings(loadBookings());
  }, []);

  const selectedMentor: Mentor | null = useMemo(
    () => MENTORS.find((m) => m.id === selectedMentorId) ?? null,
    [selectedMentorId]
  );

  const filteredMentors = useMemo(
    () => (filter === "all" ? MENTORS : MENTORS.filter((m) => m.supportedTypes.includes(filter))),
    [filter]
  );

  function handleSelectMentor(mentor: Mentor) {
    setSelectedMentorId(mentor.id);
    setSelectedSlotId(null);
    setError(null);
    // Keep the interview type valid for this mentor.
    if (!mentor.supportedTypes.includes(interviewType)) {
      setInterviewType(mentor.supportedTypes[0]);
    }
  }

  function handleConfirm() {
    if (!selectedMentor || !targetRole.trim() || !selectedSlotId) {
      setError(hub.bookingIncomplete);
      return;
    }
    const slot = selectedMentor.slots.find((s) => s.id === selectedSlotId);
    if (!slot) {
      setError(hub.bookingIncomplete);
      return;
    }
    const booking: MentorBooking = {
      id: makeBookingId(),
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      mentorTitle: selectedMentor.title,
      mentorInitials: selectedMentor.initials,
      mentorAccent: selectedMentor.accent,
      targetRole: targetRole.trim(),
      interviewType,
      difficulty,
      slotId: slot.id,
      slotLabel: slot.label,
      notes: notes.trim(),
      durationMinutes: MENTOR_BOOKING_DURATION_MINUTES,
      status: "scheduled",
      createdAt: Date.now(),
    };
    setBookings(saveBooking(booking));
    setActiveBooking(booking);
    setError(null);
    setStep("booked");
  }

  function resetSelection() {
    setSelectedMentorId(null);
    setSelectedSlotId(null);
    setNotes("");
    setActiveBooking(null);
    setStep("browse");
  }

  function handleCancelBooking(id: string) {
    setBookings(cancelBooking(id));
  }

  // ── CALL ROOM ─────────────────────────────────────────────────────────────
  if (step === "call" && activeBooking) {
    return <MentorCallRoom hub={hub} booking={activeBooking} onLeave={() => setStep("booked")} />;
  }

  // ── CONFIRMATION ──────────────────────────────────────────────────────────
  if (step === "booked" && activeBooking) {
    return (
      <div className="space-y-4">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" /> {hub.backToHub}
        </button>
        <MentorBookingConfirmation
          hub={hub}
          booking={activeBooking}
          onJoin={() => setStep("call")}
          onBookAnother={resetSelection}
        />
      </div>
    );
  }

  // ── BROWSE / BOOK ─────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      <button
        onClick={onExit}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft size={15} aria-hidden="true" /> {hub.back}
      </button>

      <div>
        <h2 className="text-xl font-bold text-navy-900">{hub.mentorsTitle}</h2>
        <p className="text-sm text-navy-500 mt-1">{hub.mentorsSubtitle}</p>
      </div>

      {/* Existing bookings */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-beige-300 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-navy-900 mb-3">{hub.yourSessionsTitle}</h3>
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-beige-200 bg-beige-50/50 px-3 py-2.5"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${b.mentorAccent} text-white text-xs font-bold flex items-center justify-center shrink-0`}
                  aria-hidden="true"
                >
                  {b.mentorInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy-900 truncate">
                    {b.mentorName} · <span className="font-normal text-navy-500">{b.targetRole}</span>
                  </p>
                  <p className="text-xs text-navy-500 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <Video size={12} aria-hidden="true" /> {hub.types[b.interviewType].label}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock size={12} aria-hidden="true" /> {b.slotLabel}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveBooking(b);
                    setStep("call");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1628] text-white text-xs font-semibold hover:bg-[#1a2a4a] transition-colors"
                >
                  {hub.rejoin}
                </button>
                <button
                  onClick={() => handleCancelBooking(b.id)}
                  aria-label={hub.cancel}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-beige-300 text-navy-400 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-start gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-700 leading-snug">{error}</p>
        </div>
      )}

      {/* Shared setup */}
      <div className="bg-white rounded-2xl border border-beige-300 shadow-sm p-5 space-y-5">
        <h3 className="text-sm font-semibold text-navy-900">{hub.setupTitle}</h3>
        <TargetRoleField hub={hub} value={targetRole} onChange={setTargetRole} id="mentorTargetRole" />
        <InterviewTypeField
          hub={hub}
          value={interviewType}
          onChange={setInterviewType}
          allowed={selectedMentor?.supportedTypes}
        />
        <DifficultyField hub={hub} value={difficulty} onChange={setDifficulty} />
      </div>

      {/* Filter */}
      <div>
        <p className="text-xs font-semibold text-navy-500 mb-2">{hub.filterLabel}</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            {hub.filterAll}
          </FilterChip>
          {INTERVIEW_TYPE_IDS.map((id) => (
            <FilterChip key={id} active={filter === id} onClick={() => setFilter(id)}>
              {hub.types[id].label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Mentor grid */}
      {filteredMentors.length === 0 ? (
        <p className="text-sm text-navy-400 py-8 text-center">{hub.noMentors}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMentors.map((m) => (
            <MentorCard
              key={m.id}
              hub={hub}
              mentor={m}
              selected={selectedMentorId === m.id}
              onSelect={() => handleSelectMentor(m)}
            />
          ))}
        </div>
      )}

      {/* Booking detail panel */}
      {selectedMentor && (
        <div className="bg-white rounded-2xl border-2 border-[#d4a017]/40 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${selectedMentor.accent} text-white font-bold flex items-center justify-center shrink-0`}
              aria-hidden="true"
            >
              {selectedMentor.initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">{hub.bookingDetailsTitle}</h3>
              <p className="text-xs text-navy-500">{selectedMentor.name}</p>
            </div>
          </div>

          {/* Slot picker */}
          <div>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 mb-2">
              <Clock size={14} className="text-navy-400" aria-hidden="true" /> {hub.chooseSlotLabel}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {selectedMentor.slots.map((slot) => {
                const selected = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={[
                      "py-2.5 rounded-xl border-2 text-sm font-semibold transition-all",
                      selected
                        ? "border-[#d4a017] bg-[#d4a017]/10 text-navy-900"
                        : "border-beige-300 text-navy-600 hover:border-beige-500",
                    ].join(" ")}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="mentorNotes" className="block text-sm font-semibold text-navy-900 mb-1.5">
              {hub.notesLabel} <span className="font-normal text-navy-400">{hub.optional}</span>
            </label>
            <textarea
              id="mentorNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={hub.notesPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-[#d4a017]/20 transition-all resize-y"
            />
          </div>

          <button
            onClick={handleConfirm}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0a1628] text-white text-sm font-semibold hover:bg-[#1a2a4a] transition-colors"
          >
            <CalendarClock size={16} aria-hidden="true" /> {hub.confirmBooking}
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors",
        active
          ? "bg-[#0a1628] text-white border-[#0a1628]"
          : "bg-white text-navy-600 border-beige-300 hover:border-navy-300",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
