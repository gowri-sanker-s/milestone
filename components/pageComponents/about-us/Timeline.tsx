"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const timeline = [
  {
    year: "2022",
    title: "The Single Shelf",
    description:
      "We launched in a sunlit loft room with exactly one shelf of classics, serving a handful of local bibliophiles who sought a slower, more deliberate reading experience.",
  },
  {
    year: "2024",
    title: "A Gathering Sanctuary",
    description:
      "Word spread. We moved into a physical storefront, hosting intimate community readings, acoustic nights, and silent book circles, cementing our place as a neighborhood haven.",
  },
  {
    year: "2026",
    title: "The Digital Haven",
    description:
      "To reach minds beyond our neighborhood, we created our digital storefront. We ship our books, carefully hand-wrapped with personal notes, to readers all across the world.",
  },
];

const Timeline = () => {
  return (
    <section className="py-20 border-b border-primary-border/40">
      <div className="wrapper">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-widest opacity-60">
            Our Journey
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold">
            Milestone Milestones
          </p>
          <div className="h-1 w-16 bg-primary-text mx-auto rounded-full mt-4" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-border transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {timeline.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.year}
                  className={`flex flex-col md:flex-row relative items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Circle Dot */}
                  <div className="absolute left-4 md:left-1/2 w-6 h-6 bg-primary-bg border-[4px] border-primary-text rounded-full transform -translate-x-[11px] md:-translate-x-1/2 z-1 flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-1.5 bg-primary-bg rounded-full" />
                  </div>

                  {/* Timeline Content */}
                  <div
                    className={`w-full md:w-1/2  md:px-8 ${idx % 2 === 0 ? "sm:pr-12 md:pr-0 pl-12" : "pl-12 md:pl-0"}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-primary-border/30 hover:bg-primary-border/40 border border-primary-text/10 p-6 rounded-3xl transition-colors duration-300"
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-md text-xs font-extrabold opacity-80 bg-primary-text text-primary-bg px-2.5 py-1 mb-3">
                        <Calendar size={12} />
                        {item.year}
                      </span>
                      <h3 className="text-lg font-extrabold mb-2">
                        {item.title}
                      </h3>
                      <p className="opacity-80 text-sm leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Spacer for desktop layout */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
