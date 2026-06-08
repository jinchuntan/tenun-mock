"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import type { CallStatus } from "./types";

/**
 * The "call participant" panel for the AI interviewer. There is no real
 * generated video — the avatar behaves like a live participant through
 * animation: pulse rings while speaking, a listening ring while capturing the
 * candidate's answer, and a gentle idle float otherwise.
 *
 * A future real-time avatar/video vendor can replace the inner visual without
 * changing this component's props (status + name/role + speaking).
 */
export function AIInterviewerAvatar({
  status,
  name,
  role,
  statusLabel,
}: {
  status: CallStatus;
  name: string;
  role: string;
  statusLabel: string;
}) {
  const speaking = status === "speaking";
  const listening = status === "listening";
  const thinking = status === "thinking" || status === "preparing";

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#0a1628] to-[#1a2a4a] px-6 py-10 sm:py-14 overflow-hidden">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -top-16 -left-10 w-48 h-48 rounded-full bg-[#d4a017] blur-3xl" />
        <div className="absolute -bottom-16 -right-8 w-56 h-56 rounded-full bg-[#4164b4] blur-3xl" />
      </div>

      {/* Avatar with reactive rings */}
      <div className="relative flex items-center justify-center mb-5">
        {(speaking || listening) && (
          <>
            <motion.span
              className={`absolute rounded-full ${listening ? "bg-red-400/30" : "bg-[#d4a017]/30"}`}
              style={{ width: 132, height: 132 }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className={`absolute rounded-full ${listening ? "bg-red-400/20" : "bg-[#d4a017]/20"}`}
              style={{ width: 132, height: 132 }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
            />
          </>
        )}

        <motion.div
          className="relative z-10 flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-[#d4a017] to-[#a97d12] shadow-xl ring-4 ring-white/10"
          animate={
            speaking
              ? { scale: [1, 1.06, 1] }
              : thinking
              ? { rotate: [0, 3, -3, 0] }
              : { y: [0, -4, 0] }
          }
          transition={{
            duration: speaking ? 0.7 : thinking ? 1.2 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Bot size={48} className="text-[#0a1628]" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Speaking waveform (decorative) */}
      <div className="h-6 flex items-end gap-1 mb-3" aria-hidden="true">
        {speaking
          ? Array.from({ length: 7 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-1 rounded-full bg-[#d4a017]"
                animate={{ height: [6, 22, 6] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }}
              />
            ))
          : null}
      </div>

      <p className="text-white font-semibold text-lg">{name}</p>
      <p className="text-white/55 text-xs mb-3">{role}</p>

      <span
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/15 backdrop-blur"
      >
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            speaking ? "bg-[#d4a017]" : listening ? "bg-red-400" : thinking ? "bg-amber-300" : "bg-white/50",
            status !== "idle" && status !== "ended" ? "animate-pulse" : "",
          ].join(" ")}
        />
        {statusLabel}
      </span>
    </div>
  );
}
