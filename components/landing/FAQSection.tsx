"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "What is Tenun?",
    a: "Tenun is a career discovery platform that helps students and fresh graduates find the right job title — even when they don't know what they're looking for. You describe what you enjoy doing, and Tenun maps it to real job titles with salary ranges, required skills, and a step-by-step path to get there. Tenun is powered by TalentBank, Malaysia's leading talent placement platform.",
  },
  {
    q: "How does Tenun find the right job for me?",
    a: "You type what you enjoy in plain language. Tenun uses AI to map your description to 6 real job titles, then explains what each one actually involves — day-to-day tasks, salary ranges, required skills, and the 'secret sauce' that separates good candidates from great ones.",
  },
  {
    q: "Do I need to know my job title to use Tenun?",
    a: "No — that's the whole point. Most job boards assume you already know what to search for. Tenun starts from what you enjoy doing ('I like working with data' or 'I want to design things') and works backwards to find the right career path for you.",
  },
  {
    q: "What companies are hiring through Tenun?",
    a: "Tenun partners with Unilever, Maybank, Petronas, Shell, Lazada, EY, American Express, and Top Glove in Malaysia. These companies post jobs directly through TalentBank's network rather than blindly on LinkedIn, so every candidate they see has been career-matched and vetted.",
  },
  {
    q: "Is Tenun free to use?",
    a: "Yes. Discovering jobs, exploring career paths, and reading full role breakdowns are all free. Creating an account (with Google) lets you save your results, upload your CV, and get matched to live job openings at our partner companies.",
  },
  {
    q: "How is Tenun different from LinkedIn or JobStreet?",
    a: "LinkedIn and JobStreet require you to know your job title. Tenun doesn't. We also give you the full roadmap — what skills you need, what the secret advantage is for each role, and which real companies are hiring. Think of it less like a job board and more like a career GPS.",
  },
];

function FAQItem({
  item, isOpen, onToggle,
}: {
  item: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl bg-beige-100 border border-beige-300/60 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-navy-900 text-sm">{item.q}</span>
        <ChevronDown
          className={`w-4 h-4 text-navy-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-navy-600 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  // First item open by default; multiple can be open at once
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const mid = Math.ceil(FAQ_ITEMS.length / 2);
  const columns = [
    FAQ_ITEMS.slice(0, mid).map((item, i) => ({ item, index: i })),
    FAQ_ITEMS.slice(mid).map((item, i) => ({ item, index: i + mid })),
  ];

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-gold-600 uppercase tracking-widest mb-2">
            FAQ
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-navy-900">
            Questions we get a lot.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {columns.map((col, ci) => (
            <div key={ci} className="space-y-4">
              {col.map(({ item, index }) => (
                <FAQItem
                  key={item.q}
                  item={item}
                  isOpen={open.has(index)}
                  onToggle={() => toggle(index)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
