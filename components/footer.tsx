"use client";

import React from "react";
import Link from "next/link";

const WEAVER_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Career discovery", href: "/" },
  { label: "Build CV", href: "/profile?upload=true&from=landing" },
  { label: "FAQ", href: "/#faq" },
];

const EMPLOYER_LINKS = [
  { label: "Why Tenun?", href: "/employers#why" },
  { label: "Post a role", href: "/employers#employer-form" },
  { label: "Candidate matching", href: "/employers#candidate-signal" },
  { label: "Recruiter preview", href: "/employers#portal-preview" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-beige-200 border-t border-beige-300/70 text-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="text-2xl font-black tracking-tight">Tenun</span>
            <p className="text-navy-600 text-sm max-w-sm leading-relaxed mt-4">
              Career discovery for students and fresh graduates who don&apos;t know
              their job title yet. Built with TalentBank, Malaysia&apos;s leading
              talent placement platform.
            </p>
          </div>

          {/* For Weavers */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-navy-900">For Weavers</h4>
            <ul className="space-y-2.5 text-sm text-navy-600">
              {WEAVER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-gold-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-navy-900">For Employers</h4>
            <ul className="space-y-2.5 text-sm text-navy-600">
              {EMPLOYER_LINKS.map((link) =>
                link.href.startsWith("mailto:") ? (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-gold-600 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-gold-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-beige-300/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-500">
            &copy; {currentYear} Tenun. All rights reserved.
          </p>
          <p className="text-xs text-navy-500">
            Tenun helps you explore possibilities. It does not guarantee employment outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
}
