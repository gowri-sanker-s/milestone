"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { oleo } from "@/lib/fonts";
import aboutHero from "@/assets/images/about_hero.png";
import {
  BookOpen,
  Compass,
  Heart,
  Calendar,
  ArrowRight,
  Bookmark,
  Sparkles,
  Award,
  Users,
  Coffee,
} from "lucide-react";

// Curators configuration
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

// Values configuration
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

// Timeline configuration
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

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Page = () => {
  // Store active tab ('milestone' | 'current') for each curator
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
    <div className="bg-primary-bg min-h-screen text-primary-text overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative py-16 md:py-24 border-b border-primary-border/40">
        <div className="wrapper flex gap-12 items-center">
          <motion.div
            className="flex-1 flex flex-col items-start space-y-6"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full text-[13px] font-extrabold opacity-85 bg-primary-border/60 p-1.5 px-5 border border-primary-text/10"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>Behind the Covers</span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-[44px] sm:text-[56px] md:text-[72px] font-extrabold leading-[1.05] tracking-tight"
            >
              Stories that shape <br />
              <span
                className={`${oleo.className} text-[48px] sm:text-[60px] md:text-[76px] font-normal block mt-2 text-primary-text/90`}
              >
                our milestones.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg opacity-85 max-w-xl leading-relaxed font-medium"
            >
              Milestone Books is more than a bookstore. We are a quiet rebellion
              against the fast-paced noise, dedicated to curation,
              craftsmanship, and the enduring magic of the written word.
            </motion.p>
            <motion.div variants={fadeInUp} className="pt-4 flex gap-4">
              <Link
                href="/books"
                className="group flex items-center gap-2 p-3 px-6 rounded-full bg-primary-text text-primary-bg font-extrabold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore the Library</span>
                <ArrowRight
                  size={16}
                  className="transform group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className=" relative"
            initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Decorative background shape */}
            <div className="h-[400px] w-[600px]">
              <Image
                src={aboutHero}
                alt="Cozy reading nook at Milestone Books"
                placeholder="blur"
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Our Philosophy / Core Values */}
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

      {/* 3. The Story Timeline */}
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
                      className={`w-full md:w-1/2  md:px-8 ${idx % 2 === 0 ? "pr-12 md:pr-0" : "pl-12 md:pl-0"}`}
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

      {/* 4. Behind the Bookcase (Team/Curators) */}
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
                        className={`flex-1 text-center py-2 text-xs font-extrabold rounded-lg z-10 transition-colors duration-200 ${
                          activeTab === "milestone"
                            ? "text-primary-bg bg-primary-text shadow-sm"
                            : "text-primary-text/70 hover:text-primary-text"
                        }`}
                      >
                        Milestone Book
                      </button>
                      <button
                        onClick={() => toggleTab(curator.name, "current")}
                        className={`flex-1 text-center py-2 text-xs font-extrabold rounded-lg z-10 transition-colors duration-200 ${
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

      {/* 5. Call To Action (CTA) */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-border/30 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="wrapper max-w-3xl space-y-8">
          <h2 className={`text-4xl md:text-5xl font-extrabold leading-tight`}>
            Every milestone in your life is <br />
            accompanied by a story.
          </h2>
          <p className="opacity-80 max-w-xl mx-auto leading-relaxed text-sm font-medium">
            Find the volume that marks your next milestone. Let us pack and ship
            a piece of literary sanctuary directly to your home.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/books"
              className="p-3.5 px-8 rounded-full bg-primary-text text-primary-bg font-extrabold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Browse Curated Catalog
            </Link>
            <Link
              href="/contact-us"
              className="p-3.5 px-8 rounded-full bg-primary-border/60 hover:bg-primary-border border border-primary-text/10 text-primary-text font-extrabold transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
