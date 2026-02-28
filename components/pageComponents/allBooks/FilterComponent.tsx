"use client";

import { Grip } from "lucide-react";
import React, { useState, useEffect } from "react";
import PillSelector from "./PillSelector";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const FilterComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filterOpen, setFilterOpen] = useState(false);

  // Initialize state from URL
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get("genre") ? searchParams.get("genre")!.split(",") : [],
  );
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(
    searchParams.get("author") ? searchParams.get("author")!.split(",") : [],
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    searchParams.get("language")
      ? searchParams.get("language")!.split(",")
      : [],
  );

  // Update URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedGenres.length > 0) {
      params.set("genre", selectedGenres.join(","));
    } else {
      params.delete("genre");
    }

    if (selectedAuthors.length > 0) {
      params.set("author", selectedAuthors.join(","));
    } else {
      params.delete("author");
    }

    if (selectedLanguages.length > 0) {
      params.set("language", selectedLanguages.join(","));
    } else {
      params.delete("language");
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [selectedGenres, selectedAuthors, selectedLanguages, pathname, router]);

  return (
    <div className="filter-section flex w-full justify-between relative">
      <div className="left">
        <h2 className={`font-extrabold text-[30px]`}>Explore Our Library</h2>
      </div>
      <button
        type="button"
        onClick={() => setFilterOpen((prev) => !prev)}
        className="flex gap-2 items-center cursor-pointer"
      >
        <Grip size={20} strokeWidth={1.8} />
        <span className="font-semibold text-[17px]">Filters</span>
      </button>

      <div
        className={`absolute top-10 grid gap-6 z-10 right-0 min-w-[400px] bg-primary-border shadow-lg rounded-xl p-4 px-6 transition-all duration-300 ease-in-out transform
        ${
          filterOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <PillSelector
          title="Genres"
          options={[
            "Fiction",
            "Non-Fiction",
            "Science Fiction",
            "Fantasy",
            "Mystery",
          ]}
          selected={selectedGenres}
          setSelected={setSelectedGenres}
        />

        <PillSelector
          title="Authors"
          options={[
            "J.K. Rowling",
            "George R.R. Martin",
            "Agatha Christie",
            "Dan Brown",
            "Stephen King",
          ]}
          selected={selectedAuthors}
          setSelected={setSelectedAuthors}
        />

        <PillSelector
          title="Languages"
          options={["English", "Spanish", "French", "German", "Hindi"]}
          selected={selectedLanguages}
          setSelected={setSelectedLanguages}
        />
      </div>
    </div>
  );
};

export default FilterComponent;
