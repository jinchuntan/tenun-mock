"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { companies } from "@/lib/data/company-jobs";

const ITEMS = [...companies, ...companies];

export function PartnersSection() {
  return (
    <section id="partners" className="py-16 md:py-20 bg-beige-100/60 border-y border-beige-300/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-10">
        <p className="text-xs font-semibold text-gold-600 uppercase tracking-widest mb-2">
          Our proven partners.
        </p>
        <h2 className="font-display text-2xl sm:text-3xl text-navy-900 leading-tight mb-3">
          We partner with the companies
          <br className="hidden sm:block" />{" "}
          you want to work for.
        </h2>
        <p className="text-sm text-navy-600 leading-relaxed max-w-xl mx-auto">
          Every candidate is vetted by Tenun before being recommended, so partners
          know you&apos;re more than just another application.
        </p>
      </div>

      <div className="relative overflow-hidden fade-x-mask py-8">
        <div className="flex w-max animate-marquee no-pause items-center">
          {ITEMS.map((company, i) => (
            <Link
              key={`${company.slug}-${i}`}
              href={`/companies/${company.slug}`}
              className="flex-shrink-0 mx-5 flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:scale-125 hover:z-10 transition-all duration-300 ease-out"
              style={{ height: company.logoSize ?? 64 }}
              aria-label={`${company.name} — view open roles`}
            >
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={company.logoSize ?? 64}
                height={company.logoSize ?? 64}
                className="object-contain"
                style={{ maxHeight: company.logoSize ?? 64 }}
                unoptimized
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <Link
          href={`/companies/${companies[0]?.slug ?? ""}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-gold-600 transition-colors"
        >
          Browse all companies <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
