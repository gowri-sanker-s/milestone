"use client";

import { Grip } from "lucide-react";
import React, { useState } from "react";
import PillSelector from "./PillSelector";
import { oleo } from "@/lib/fonts";

const FilterComponent = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

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
        className={`absolute top-10 grid gap-6  right-0 min-w-[400px] bg-primary-border shadow-lg rounded-xl p-4 px-6 transition-all duration-300 ease-in-out transform
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
