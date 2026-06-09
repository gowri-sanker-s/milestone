import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { getUniqueGenresWithCount } from "@/lib/actions/product.action";

export const metadata = {
  title: "Browse by Genre - Milestone Books",
  description: "Explore books by genre, including memoirs, self-help, essays, fiction, and more.",
};

const GenresPage = async () => {
  const genres = await getUniqueGenresWithCount();

  return (
    <div className="min-h-screen py-12 bg-primary-bg">
      <div className="wrapper">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-sm font-semibold tracking-wider uppercase opacity-75">
            Curated Library
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-primary-text leading-tight">
            Browse Books by Genre
          </h1>
          <p className="text-lg mt-4 opacity-80 leading-relaxed">
            Find your next favorite read by exploring genres dynamically compiled from our collection.
            Every book is handpicked for quality and relevance.
          </p>
        </div>

        {/* Genres Grid */}
        {genres.length === 0 ? (
          <div className="bg-primary-border/40 rounded-2xl p-12 text-center border border-primary-text/10">
            <h3 className="text-xl font-semibold opacity-75">No genres found</h3>
            <p className="mt-2 opacity-60 text-sm">
              There are no genres or products in the library yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {genres.map((genre) => (
              <Link
                key={genre.name}
                href={`/books?genre=${encodeURIComponent(genre.name)}`}
                className="group bg-primary-border/60 hover:bg-primary-border border border-primary-text/10 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  {/* Icon & Count Badge */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-primary-bg text-primary-text rounded-xl group-hover:scale-105 transition-transform duration-300">
                      <BookOpen size={20} strokeWidth={1.8} />
                    </div>
                    <span className="bg-primary-text/10 text-primary-text text-xs font-semibold px-3 py-1 rounded-full">
                      {genre.count} {genre.count === 1 ? "Book" : "Books"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-primary-text mt-5 group-hover:text-primary-text/90">
                    {genre.name}
                  </h3>
                  <p className="text-xs mt-2 opacity-75 leading-relaxed">
                    Explore our collection of {genre.name.toLowerCase()} books.
                  </p>
                </div>

                {/* Footer Call to Action */}
                <div className="mt-6 pt-4 border-t border-primary-text/5 flex items-center justify-between text-xs font-semibold text-primary-text/80 group-hover:text-primary-text transition-colors">
                  <span>Explore books</span>
                  <ArrowRight
                    size={14}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenresPage;