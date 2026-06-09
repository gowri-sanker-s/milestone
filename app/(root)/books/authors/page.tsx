import React from "react";
import { getUniqueAuthorsWithCount } from "@/lib/actions/product.action";
import AuthorsList from "@/components/pageComponents/authors/AuthorsList";

export const metadata = {
  title: "Browse by Author - Milestone Books",
  description: "Browse our curated list of authors and find books written by your favorite writers.",
};

const AuthorsPage = async () => {
  const authors = await getUniqueAuthorsWithCount();

  return (
    <div className="min-h-screen py-12 bg-primary-bg">
      <div className="wrapper">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-sm font-semibold tracking-wider uppercase opacity-75">
            Literary Voices
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-primary-text leading-tight">
            Browse Books by Author
          </h1>
          <p className="text-lg mt-4 opacity-80 leading-relaxed">
            Discover masterpieces from our curated list of writers. Click on any author to
            explore their publications and contributions in our library.
          </p>
        </div>

        {/* Authors Search & Grid Component */}
        <AuthorsList authors={authors} />
      </div>
    </div>
  );
};

export default AuthorsPage;