"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, FormEvent } from "react";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || "",
  );

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("query", searchQuery.trim());
    } else {
      params.delete("query");
    }

    // Reset page to 1 on a new search
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative bg-white rounded-full w-full max-w-[50%] mx-auto overflow-clip flex"
    >
      <input
        type="text"
        className="w-full p-3 px-4 focus-visible:outline-0"
        placeholder="Search books, authors, or genres..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        type="submit"
        className="flex gap-2 items-center h-full absolute right-0 top-0 bg-primary-text text-primary-bg px-7 hover:bg-primary-text/90 transition-colors"
      >
        <Search size={16} strokeWidth={1.8} />
        <span className="font-semibold">Search</span>
      </button>
    </form>
  );
};

export default SearchInput;
