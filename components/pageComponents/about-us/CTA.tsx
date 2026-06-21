import React from "react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-24 text-center relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-border/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="wrapper max-w-3xl space-y-8">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
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
  );
};

export default CTA;
