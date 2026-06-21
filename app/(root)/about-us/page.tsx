import React from "react";
import Hero from "@/components/pageComponents/about-us/Hero";
import Values from "@/components/pageComponents/about-us/Values";
import Timeline from "@/components/pageComponents/about-us/Timeline";
import Curators from "@/components/pageComponents/about-us/Curators";
import CTA from "@/components/pageComponents/about-us/CTA";

export const metadata = {
  title: "About Us | Milestone Books",
  description:
    "Learn about Milestone Books, our story, core values, and the human curators who carefully select every book on our shelves.",
};

const Page = () => {
  return (
    <div className="bg-primary-bg min-h-screen text-primary-text overflow-hidden">
      <Hero />
      <Values />
      <Timeline />
      <Curators />
      <CTA />
    </div>
  );
};

export default Page;

