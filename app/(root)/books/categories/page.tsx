import React from "react";
import Link from "next/link";
import { Sparkles, BookOpen, Heart, Compass, ArrowRight } from "lucide-react";
import { getCategoryCounts } from "@/lib/actions/product.action";

export const metadata = {
  title: "Browse by Category - Milestone Books",
  description: "Explore our curated collections, featuring our top rated, newest releases, and special combo offers.",
};

const CategoriesPage = async () => {
  const counts = await getCategoryCounts();

  const categories = [
    {
      name: "Featured Products",
      slug: "featured",
      count: counts.featured,
      description: "Handpicked books that highlight exceptional storytelling and outstanding writing.",
      icon: Sparkles,
      gradient: "from-amber-100/50 to-orange-100/50",
    },
    {
      name: "New Arrivals",
      slug: "new-arrivals",
      count: counts.newArrivals,
      description: "Freshly added titles to keep your reading list up to date with the latest additions.",
      icon: BookOpen,
      gradient: "from-blue-100/50 to-indigo-100/50",
    },
    {
      name: "Best Sellers",
      slug: "best-sellers",
      count: counts.bestSellers,
      description: "Our most popular and highly-rated titles loved by readers worldwide.",
      icon: Heart,
      gradient: "from-rose-100/50 to-red-100/50",
    },
    {
      name: "Combo Offers",
      slug: "combo-offers",
      count: counts.comboOffers,
      description: "Special collections and bundles that pair amazing titles at exceptional value.",
      icon: Compass,
      gradient: "from-emerald-100/50 to-teal-100/50",
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-primary-bg">
      <div className="wrapper">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-sm font-semibold tracking-wider uppercase opacity-75">
            Curated Collections
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-primary-text leading-tight">
            Browse Books by Category
          </h1>
          <p className="text-lg mt-4 opacity-80 leading-relaxed">
            Explore our curated groupings to easily find the style of deal, release, or rating you desire.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {categories.map((category) => {
            const IconComponent = category.icon;

            return (
              <Link
                key={category.slug}
                href={`/books?category=${category.slug}`}
                className="group bg-primary-border/60 hover:bg-primary-border border border-primary-text/10 rounded-2xl p-8 transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                />

                <div>
                  {/* Icon & Count Badge */}
                  <div className="flex justify-between items-start">
                    <div className="p-4 bg-primary-bg text-primary-text rounded-2xl group-hover:scale-105 transition-transform duration-300">
                      <IconComponent size={28} strokeWidth={1.8} />
                    </div>
                    <span className="bg-primary-text/10 text-primary-text text-sm font-semibold px-4 py-1.5 rounded-full">
                      {category.count} {category.count === 1 ? "Book" : "Books"}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-extrabold text-primary-text mt-6 group-hover:underline decoration-primary-text/30 decoration-2 underline-offset-4">
                    {category.name}
                  </h3>
                  <p className="text-base mt-3 opacity-75 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Footer Call to Action */}
                <div className="mt-8 pt-4 border-t border-primary-text/5 flex items-center justify-between text-sm font-semibold text-primary-text/80 group-hover:text-primary-text transition-colors">
                  <span>Browse collection</span>
                  <ArrowRight
                    size={16}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;