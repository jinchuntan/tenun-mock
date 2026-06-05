"use client";

import { motion } from "framer-motion";
import { Search, ListChecks, Route } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Search in plain language",
    body: "No job title needed. Type what you enjoy — 'I like working with numbers' or 'I want to make things look good.' Tenun maps it to 6 real careers.",
  },
  {
    icon: ListChecks,
    title: "See what it actually takes",
    body: "Click any role to see the required skills, salary range, the secret sauce that sets top candidates apart, and an honest fit check.",
  },
  {
    icon: Route,
    title: "Get your personalised path",
    body: "Sign in and upload your CV. We show exactly how you fit, what to improve, and match you to open roles at top Malaysian companies.",
  },
];

export function ThreeStepsSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-gold-600 uppercase tracking-widest mb-2">
            Simple. Fast. No fluff.
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-navy-900 leading-tight">
            From curious to
            <br className="hidden sm:block" />{" "}
            career-ready in 3 steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-beige-100 border border-beige-300/60 p-7 hover:shadow-lg hover:shadow-navy-900/5 hover:border-gold-300 transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-beige-300/70 shadow-sm">
                    <Icon className="w-5 h-5 text-gold-600" />
                  </span>
                  <h3 className="font-bold text-navy-900 text-base">{step.title}</h3>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed">{step.body}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
