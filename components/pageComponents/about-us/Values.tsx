"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Compass, Heart } from "lucide-react";

const values = [
  {
    icon: BookOpen,
    title: "100% Human Curated",
    description:
      "We don't use recommendation engines or trending charts. Every single book on our shelf is chosen by a human reader who connected with its words.",
  },
  {
    icon: Compass,
    title: "A Sanctuary for Discovery",
    description:
      "Milestone Books is designed for slow discovery. We encourage readers to pause, explore unfamiliar genres, and find stories they didn't know they needed.",
  },
  {
    icon: Heart,
    title: "Moments over Transactions",
    description:
      "A book is not a mere commodity; it is a milestone of who we were when we read it. We package and deliver every volume with the care it deserves.",
  },
];

const Values = () => {
  return (
    <section className="py-20 bg-primary-border/10 border-b border-primary-border/40">
      <div className="wrapper">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-widest opacity-60">
            Our Core Values
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold">
            How we keep the pages turning.
          </p>
          <div className="h-1 w-16 bg-primary-text mx-auto rounded-full mt-4" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-primary-bg/75 border border-primary-text/10 hover:border-primary-text/20 hover:bg-primary-bg p-8 rounded-3xl transition-all duration-300 hover:shadow-lg group flex flex-col h-full hover:-translate-y-1"
              >
                <div className="p-4 bg-primary-border/50 border border-primary-text/5 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-primary-text shrink-0" size={24} />
                </div>
                <h3 className="text-xl font-extrabold mb-3 leading-tight">
                  {val.title}
                </h3>
                <p className="opacity-80 leading-relaxed text-sm font-medium mt-auto">
                  {val.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Values;
