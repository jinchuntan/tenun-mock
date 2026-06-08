"use client";

import { AuthGate } from "@/components/auth-gate";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { MockInterviewHub } from "@/components/interview/MockInterviewHub";

export default function MockInterviewPage() {
  return (
    <AuthGate
      next="/dashboard/mock-interview"
      title="Sign in to the Mock Interview Hub"
      subtitle="Create your free account to run a live-style AI interview or book a 30-minute mock interview with a mentor."
      perks={[
        "Practise in a live-style AI interview call with instant feedback",
        "Book a 30-minute mock interview with a real mentor",
        "Answer by typing or with your voice, then get a final report",
      ]}
    >
      <div className="min-h-screen bg-[#f5f0e8]">
        <AppTopBar
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Mock Interview Hub" },
          ]}
          returnTo={{ href: "/dashboard", label: "Exit to Dashboard" }}
        />

        <MockInterviewHub />
      </div>
    </AuthGate>
  );
}
