"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { oleo } from "@/lib/fonts";
import aboutHero from "@/assets/images/about_hero.png";
import { Sparkles, ArrowRight } from "lucide-react";

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

const Hero = () => {
  return (
    <section className="relative py-16 md:py-18 border-b border-primary-border/40">
      <div className="wrapper flex lg:flex-row flex-col gap-12">
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
            className="text-[40px] sm:text-[52px] md:text-[68px] font-extrabold leading-[1.05] tracking-tight"
          >
            Stories that shape our <br />
            <span
              className={`${oleo.className} text-[44px] sm:text-[56px] md:text-[72px] font-normal block mt-2 text-primary-text`}
            >
              milestones.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-lg opacity-85 max-w-xl leading-relaxed font-medium"
          >
            Milestone Books is more than a bookstore. We are a quiet rebellion
            against the fast-paced noise, dedicated to curation, craftsmanship,
            and the enduring magic of the written word.
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
          className="flex justify-center relative"
          initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative background shape */}
          <div className="h-[clamp(230px,40vh,400px)] w-[clamp(320px,60vw,600px)]">
            <Image
              src={aboutHero}
              alt="Cozy reading nook at Milestone Books"
              placeholder="blur"
              priority
              className="icon"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
