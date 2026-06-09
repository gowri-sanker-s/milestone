"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, BookUser } from "lucide-react";

interface Author {
  name: string;
  count: number;
  image: string | null;
}

interface AuthorsListProps {
  authors: Author[];
}

// Function to generate initials
const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const AuthorsList = ({ authors }: AuthorsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search Input Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:max-w-md">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-text/50"
          />
          <input
            type="text"
            placeholder="Search authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-primary-border/40 hover:bg-primary-border/60 focus:bg-primary-bg border border-primary-text/20 focus:border-primary-text rounded-xl text-primary-text placeholder-primary-text/45 transition-all text-sm outline-none"
          />
        </div>
        <div className="text-sm font-semibold opacity-75">
          Showing {filteredAuthors.length} of {authors.length} authors
        </div>
      </div>

      {/* Grid of Authors */}
      {filteredAuthors.length === 0 ? (
        <div className="bg-primary-border/40 rounded-2xl p-12 text-center border border-primary-text/10">
          <h3 className="text-lg font-semibold opacity-75">No authors found</h3>
          <p className="mt-1 opacity-60 text-sm">
            Try searching for another name or check your spelling.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAuthors.map((author) => {
            const initials = getInitials(author.name);

            return (
              <Link
                key={author.name}
                href={`/books?author=${encodeURIComponent(author.name)}`}
                className="group bg-primary-border/60 hover:bg-primary-border border border-primary-text/10 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar/Thumbnail */}
                  {author.image ? (
                    <div className="h-16 w-16 rounded-full overflow-hidden border border-primary-text/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={author.image}
                        alt={author.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-primary-text/10 text-primary-text flex items-center justify-center font-extrabold text-lg tracking-wider shrink-0 group-hover:bg-primary-text/15 transition-colors duration-300">
                      {initials}
                    </div>
                  )}

                  {/* Name and Count */}
                  <div>
                    <h3 className="font-extrabold text-lg text-primary-text leading-tight group-hover:text-primary-text/90 capitalize">
                      {author.name.toLowerCase()}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold opacity-70">
                      <BookUser size={13} />
                      <span>
                        {author.count} {author.count === 1 ? "Book" : "Books"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="mt-5 pt-3 border-t border-primary-text/5 flex items-center justify-between text-xs font-semibold text-primary-text/80 group-hover:text-primary-text transition-colors">
                  <span>View books</span>
                  <ArrowRight
                    size={14}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuthorsList;
