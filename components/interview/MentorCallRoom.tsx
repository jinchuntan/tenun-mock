"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CalendarClock, Mic, Target, Video, VideoOff } from "lucide-react";
import type { Translations } from "@/lib/i18n";
import type { MentorBooking } from "./types";

type Hub = Translations["interviewHub"];

/**
 * Prototype mentor call room — a "Waiting for mentor" screen showing the mentor
 * profile, scheduled time, and interview role. There is no live video backend
 * yet; this is the seam where a real video SDK (Daily/LiveKit/Zoom/Meet) would
 * mount its room, keyed by the booking.
 */
export function MentorCallRoom({
  hub,
  booking,
  onLeave,
}: {
  hub: Hub;
  booking: MentorBooking;
  onLeave: () => void;
}) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <button
        onClick={onLeave}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft size={15} aria-hidden="true" /> {hub.leaveRoom}
      </button>

      <div className="relative rounded-2xl bg-gradient-to-b from-[#0a1628] to-[#1a2a4a] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -top-16 -left-10 w-56 h-56 rounded-full bg-[#4164b4] blur-3xl" />
          <div className="absolute -bottom-16 -right-8 w-56 h-56 rounded-full bg-[#d4a017] blur-3xl" />
        </div>

        <div className="relative px-6 py-14 flex flex-col items-center text-center">
          {/* Mentor avatar with waiting pulse */}
          <div className="relative flex items-center justify-center mb-6">
            <motion.span
              className="absolute rounded-full bg-white/10"
              style={{ width: 120, height: 120 }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <div
              className={`relative z-10 w-24 h-24 rounded-full bg-gradient-to-br ${booking.mentorAccent} text-white text-2xl font-bold flex items-center justify-center shadow-xl ring-4 ring-white/10`}
              aria-hidden="true"
            >
              {booking.mentorInitials}
            </div>
          </div>

          <p className="text-white font-semibold text-lg">{booking.mentorName}</p>
          <p className="text-white/55 text-xs mb-5">{booking.mentorTitle}</p>

          <p className="text-white/90 font-medium">{hub.waitingTitle}</p>
          <p className="text-white/50 text-sm mt-1 max-w-sm">{hub.waitingSubtitle}</p>

          {/* Meta chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Chip icon={<Target size={13} aria-hidden="true" />} label={hub.roomRoleLabel} value={booking.targetRole} />
            <Chip
              icon={<CalendarClock size={13} aria-hidden="true" />}
              label={hub.roomWhenLabel}
              value={booking.slotLabel}
            />
          </div>

          {/* Inert call controls (visual only in prototype) */}
          <div className="mt-7 flex items-center gap-3" aria-hidden="true">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white border border-white/15">
              <Mic size={18} />
            </span>
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white border border-white/15">
              <Video size={18} />
            </span>
            <button
              onClick={onLeave}
              aria-label={hub.leaveRoom}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <VideoOff size={18} />
            </button>
          </div>

          <p className="mt-6 text-[11px] text-white/40">{hub.prototypeNote}</p>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/10 text-white border border-white/15">
      <span className="text-white/60">{icon}</span>
      <span className="text-white/60">{label}:</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}
