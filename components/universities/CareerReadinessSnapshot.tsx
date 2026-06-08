"use client";

import Link from "next/link";
import { ArrowRight, Gauge } from "lucide-react";
import type { Translations } from "@/lib/i18n";
import { readinessBand, readinessColor, type ReadinessMetric } from "@/lib/university-data";

type Uni = Translations["universities"];

/** Section 2 — a simple readiness dashboard (mock values, real-data ready). */
export function CareerReadinessSnapshot({
  uni,
  metrics,
}: {
  uni: Uni;
  metrics: ReadinessMetric[];
}) {
  const bandLabel = { low: uni.bandLow, mid: uni.bandMid, high: uni.bandHigh };

  return (
    <section>
      <SectionHeading icon={<Gauge size={18} className="text-[#d4a017]" aria-hidden="true" />} title={uni.readinessTitle} subtitle={uni.readinessSubtitle} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => {
          const color = readinessColor(m.value);
          const band = readinessBand(m.value);
          return (
            <div key={m.id} className="bg-white rounded-2xl border border-beige-300 shadow-sm p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-navy-900">{uni.readiness[m.id]}</p>
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color, backgroundColor: `${color}1a` }}
                >
                  {bandLabel[band]}
                </span>
              </div>

              <div className="mt-3 flex items-end gap-2">
                <span className="text-2xl font-bold text-navy-900 leading-none">{m.value}</span>
                <span className="text-xs text-navy-400 mb-0.5">/ 100</span>
              </div>

              <div
                className="mt-2 h-2 w-full rounded-full bg-beige-200 overflow-hidden"
                role="progressbar"
                aria-valuenow={m.value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={uni.readiness[m.id]}
              >
                <div className="h-full rounded-full transition-all" style={{ width: `${m.value}%`, backgroundColor: color }} />
              </div>

              <Link
                href={m.href}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-navy-900 transition-colors"
              >
                {uni.improve} <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-lg font-bold text-navy-900">
        {icon} {title}
      </h2>
      <p className="text-sm text-navy-500 mt-1">{subtitle}</p>
    </div>
  );
}
