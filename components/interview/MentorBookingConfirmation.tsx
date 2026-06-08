"use client";

import { CalendarCheck, Clock, Phone, Plus, Target, Video } from "lucide-react";
import type { Translations } from "@/lib/i18n";
import type { MentorBooking } from "./types";

type Hub = Translations["interviewHub"];

/**
 * Booking confirmation screen. Clearly shows mentor, target role, interview
 * type, scheduled time, duration, and status — and offers a "Join call" entry
 * into the (prototype) mentor call room.
 */
export function MentorBookingConfirmation({
  hub,
  booking,
  onJoin,
  onBookAnother,
}: {
  hub: Hub;
  booking: MentorBooking;
  onJoin: () => void;
  onBookAnother: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl border border-beige-300 shadow-sm overflow-hidden">
      <div className="px-6 py-6 bg-[#0a1628] text-white flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/15 border border-green-400/30 shrink-0">
          <CalendarCheck size={26} className="text-green-400" aria-hidden="true" />
        </div>
        <div>
          <p className="text-lg font-bold">{hub.bookedTitle}</p>
          <p className="text-xs text-white/60 mt-0.5">{hub.bookedSubtitle}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${booking.mentorAccent} text-white font-bold flex items-center justify-center shrink-0`}
            aria-hidden="true"
          >
            {booking.mentorInitials}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-navy-400">{hub.mentorLabel}</p>
            <p className="text-sm font-semibold text-navy-900">{booking.mentorName}</p>
            <p className="text-xs text-navy-500">{booking.mentorTitle}</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DetailRow icon={<Target size={14} aria-hidden="true" />} label={hub.roleLabel} value={booking.targetRole} />
          <DetailRow
            icon={<Video size={14} aria-hidden="true" />}
            label={hub.typeLabel}
            value={hub.types[booking.interviewType].label}
          />
          <DetailRow
            icon={<CalendarCheck size={14} aria-hidden="true" />}
            label={hub.whenLabel}
            value={booking.slotLabel}
          />
          <DetailRow
            icon={<Clock size={14} aria-hidden="true" />}
            label={hub.durationLabel}
            value={hub.duration30}
          />
        </dl>

        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <span className="text-sm font-medium text-navy-700">{hub.statusLabel}</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {hub.statusScheduled}
          </span>
        </div>

        {booking.notes.trim() && (
          <p className="text-sm text-navy-600 rounded-xl bg-beige-50 border border-beige-200 px-4 py-3">
            {booking.notes}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            onClick={onJoin}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#d4a017] text-[#0a1628] text-sm font-semibold hover:bg-[#e0ad1c] transition-colors"
          >
            <Phone size={15} aria-hidden="true" /> {hub.joinCall}
          </button>
          <button
            onClick={onBookAnother}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-beige-300 text-navy-600 text-sm font-semibold hover:border-navy-300 hover:text-navy-900 transition-colors"
          >
            <Plus size={15} aria-hidden="true" /> {hub.bookAnother}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-beige-200 bg-beige-50/50 px-4 py-3">
      <dt className="text-[11px] uppercase tracking-wide text-navy-400 flex items-center gap-1.5">
        {icon} {label}
      </dt>
      <dd className="text-sm font-semibold text-navy-900 mt-0.5">{value}</dd>
    </div>
  );
}
