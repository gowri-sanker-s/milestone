import FilterComponent from "@/components/pageComponents/allBooks/FilterComponent";
import SearchInput from "@/components/pageComponents/allBooks/SearchInput";
import BookCard from "@/components/shared/BookCard";
import {
  getAllProducts,
  getUniqueGenresWithCount,
  getUniqueAuthorsWithCount,
  getUniqueLanguages,
} from "@/lib/actions/product.action";
import { ProductType } from "@/types/product";
import React from "react";
import { getMyCart } from "@/lib/actions/cart.action";

const page = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await props.searchParams;

  const query = searchParams.query;
  const pageNumber = Number(searchParams.page) || 1;
  const genre = searchParams.genre;
  const author = searchParams.author;
  const language = searchParams.language;
  const category = searchParams.category;

  const { data: latestProducts } = await getAllProducts({
    query,
    page: pageNumber,
    genre,
    author,
    language,
    category,
  });

  const cart = await getMyCart();

  const [genresData, authorsData, languages] = await Promise.all([
    getUniqueGenresWithCount(),
    getUniqueAuthorsWithCount(),
    getUniqueLanguages(),
  ]);

  const genres = genresData.map((g) => g.name);
  const authors = authorsData.map((a) => a.name);

  return (
    <div>
      <div className="wrapper py-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-sm font-semibold tracking-wider uppercase opacity-75">
            Explore Our Library
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-primary-text leading-tight">
            Find Books across genres and languages
          </h1>
          <p className="text-lg mt-4 opacity-80 leading-relaxed">
            Discover books written by talented authors from around the world.
            Click on any book to view details and find your next favorite read.
          </p>
        </div>
        <FilterComponent
          genres={genres}
          authors={authors}
          languages={languages}
        />
        <div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
          {latestProducts && latestProducts.length > 0 ? (
            latestProducts.map((data, index) => {
              return <BookCard key={data.id} data={data} cart={cart} />;
            })
          ) : (
            <div className="col-span-full text-center py-10 font-semibold opacity-75">
              No books found matching the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
