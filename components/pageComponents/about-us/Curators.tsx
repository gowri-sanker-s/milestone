"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Coffee } from "lucide-react";

const curatorsData = [
  {
    name: "Elena Vance",
    role: "Lead Fiction & Classics Curator",
    bio: "Elena spent a decade exploring ancient libraries before joining us. She believes the best books are the ones that smell like history and leave you staring at the ceiling at 3 AM.",
    imageText: "EV",
    milestoneBook: "The Shadow of the Wind by Carlos Ruiz Zafón",
    currentRead: "Orlando by Virginia Woolf",
    accentColor: "bg-amber-800/10 text-amber-800 border-amber-800/20",
  },
  {
    name: "Marcus Gray",
    role: "Philosophy & Essays Curator",
    bio: "Marcus is dedicated to writings that challenge the status quo. He keeps our shelves stocked with deep thoughts, structural essays, and historical blueprints.",
    imageText: "MG",
    milestoneBook: "Meditations by Marcus Aurelius",
    currentRead: "The Myth of Sisyphus by Albert Camus",
    accentColor: "bg-emerald-800/10 text-emerald-800 border-emerald-800/20",
  },
  {
    name: "Clara Sutton",
    role: "Poetry & Storytelling Curator",
    bio: "Clara runs our community workshops and local reading circles. She has a magical eye for lyrical prose, stunning illustrations, and stories that spark instant wonder.",
    imageText: "CS",
    milestoneBook: "The Little Prince by Antoine de Saint-Exupéry",
    currentRead: "Devotions by Mary Oliver",
    accentColor: "bg-rose-800/10 text-rose-800 border-rose-800/20",
  },
];

const Curators = () => {
  const [curatorTabs, setCuratorTabs] = useState<{
    [key: string]: "milestone" | "current";
  }>({
    "Elena Vance": "milestone",
    "Marcus Gray": "milestone",
    "Clara Sutton": "milestone",
  });

  const toggleTab = (name: string, tab: "milestone" | "current") => {
    setCuratorTabs((prev) => ({
      ...prev,
      [name]: tab,
    }));
  };

  return (
    <section className="py-20 bg-primary-border/10 border-b border-primary-border/40">
      <div className="wrapper">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-widest opacity-60">
            The Curators
          </h2>
          <p className="text-3xl md:text-4xl font-extrabold">
            Meet the Minds Behind the Shelves
          </p>
          <div className="h-1 w-16 bg-primary-text mx-auto rounded-full mt-4" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {curatorsData.map((curator, idx) => {
            const activeTab = curatorTabs[curator.name];

            return (
              <motion.div
                key={curator.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-primary-bg border border-primary-text/10 p-6 rounded-[2rem] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  {/* Header: Initials Avatar & Name */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-16 w-16 rounded-full bg-primary-text text-primary-bg flex items-center justify-center font-extrabold text-xl tracking-wider shadow-sm border border-primary-text/10 shrink-0">
                      {curator.imageText}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xl text-primary-text leading-tight">
                        {curator.name}
                      </h3>
                      <p className="text-xs font-extrabold opacity-70 mt-1 uppercase tracking-wider">
                        {curator.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="opacity-80 text-sm leading-relaxed mb-6 font-medium">
                    {curator.bio}
                  </p>
                </div>

                {/* Interactive Tab section */}
                <div className="mt-4 pt-5 border-t border-primary-text/10">
                  <div className="flex bg-primary-border/30 p-1 rounded-xl mb-4 border border-primary-text/5 relative">
                    <button
                      onClick={() => toggleTab(curator.name, "milestone")}
                      className={`flex-1 text-center py-2 text-xs font-extrabold rounded-lg z-1 transition-colors duration-200 ${
                        activeTab === "milestone"
                          ? "text-primary-bg bg-primary-text shadow-sm"
                          : "text-primary-text/70 hover:text-primary-text"
                      }`}
                    >
                      Milestone Book
                    </button>
                    <button
                      onClick={() => toggleTab(curator.name, "current")}
                      className={`flex-1 text-center py-2 text-xs font-extrabold rounded-lg z-1 transition-colors duration-200 ${
                        activeTab === "current"
                          ? "text-primary-bg bg-primary-text shadow-sm"
                          : "text-primary-text/70 hover:text-primary-text"
                      }`}
                    >
                      Current Read
                    </button>
                  </div>

                  {/* Dynamic recommendation content */}
                  <div className="h-20 flex flex-col justify-center bg-primary-border/20 rounded-xl p-4 border border-primary-text/5">
                    {activeTab === "milestone" ? (
                      <div className="flex gap-2.5 items-start">
                        <Bookmark
                          size={16}
                          className="text-primary-text shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-60">
                            The Life Changer
                          </p>
                          <p className="text-xs font-extrabold italic mt-0.5 line-clamp-2">
                            {curator.milestoneBook}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2.5 items-start">
                        <Coffee
                          size={16}
                          className="text-primary-text shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-60">
                            On the Nightstand
                          </p>
                          <p className="text-xs font-extrabold italic mt-0.5 line-clamp-2">
                            {curator.currentRead}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Curators;
