import BookmarkCard from "@/components/shared/BookmarkCard";
import SearchInput from "@/components/pageComponents/allBooks/SearchInput";
import { getAllBookmarks } from "@/lib/actions/bookmark.action";
import React from "react";
import { getMyCart } from "@/lib/actions/cart.action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks - Milestone Books",
  description: "Explore our collection of beautiful handcrafted bookmarks.",
};

const BookmarksPage = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await props.searchParams;

  const query = searchParams.query;
  const pageNumber = Number(searchParams.page) || 1;

  const res = await getAllBookmarks({
    query,
    page: pageNumber,
    limit: 12,
  });

  const bookmarks = res.success ? res.bookmarks : [];
  const totalPages = res.success ? res.totalPages : 0;
  const cart = await getMyCart();

  return (
    <div>
      <div className="wrapper py-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-sm font-semibold tracking-wider uppercase opacity-75">
            Milestone Accessories
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-primary-text leading-tight">
            Handcrafted Bookmarks
          </h1>
          <p className="text-lg mt-4 opacity-80 leading-relaxed">
            Beautifully designed, high quality bookmarks to keep your reading place in style. Handcrafted to order.
          </p>
        </div>

        {/* Search Input section */}
        {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="w-full sm:w-80">
            <SearchInput />
          </div>
        </div> */}

        {/* Bookmarks Grid */}
        <div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
          {bookmarks && bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} data={bookmark} cart={cart} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 font-semibold opacity-75 text-primary-text">
              No bookmarks found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
