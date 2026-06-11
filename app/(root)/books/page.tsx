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
import { Metadata } from "next";

export async function generateMetadata(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const genre = searchParams.genre;
  const author = searchParams.author;
  const category = searchParams.category;
  const language = searchParams.language;

  const selectedGenreList = genre ? genre.split(",").filter(Boolean) : [];
  const selectedAuthorList = author ? author.split(",").filter(Boolean) : [];
  const selectedLanguageList = language ? language.split(",").filter(Boolean) : [];

  const isSingleGenre = selectedGenreList.length === 1;
  const isSingleAuthor = selectedAuthorList.length === 1;
  const isSingleLanguage = selectedLanguageList.length === 1;

  let title = "All Books - Milestone Books";
  let description = "Explore our library of curated books.";

  if (isSingleAuthor && isSingleGenre) {
    title = `${selectedGenreList[0]} Books by ${selectedAuthorList[0]} - Milestone Books`;
    description = `Browse our collection of ${selectedGenreList[0].toLowerCase()} books written by ${selectedAuthorList[0]}.`;
  } else if (isSingleAuthor) {
    title = `Books by ${selectedAuthorList[0]} - Milestone Books`;
    description = `Browse the full collection of books written by ${selectedAuthorList[0]}.`;
  } else if (isSingleGenre) {
    title = `${selectedGenreList[0]} Books - Milestone Books`;
    description = `Explore our curated list of ${selectedGenreList[0]} books.`;
  } else if (category) {
    const categoryTitleMap: { [key: string]: string } = {
      featured: "Featured Books",
      "new-arrivals": "New Arrivals",
      "best-sellers": "Best Sellers",
      "combo-offers": "Combo Offers",
    };
    const catTitle = categoryTitleMap[category] || `${category.replace("-", " ")} Books`;
    title = `${catTitle} - Milestone Books`;
    description = `Discover books from our special ${category} collection.`;
  } else if (isSingleLanguage) {
    title = `${selectedLanguageList[0]} Books - Milestone Books`;
    description = `Browse books written in ${selectedLanguageList[0]}.`;
  } else if (selectedGenreList.length > 1 || selectedAuthorList.length > 1 || selectedLanguageList.length > 1) {
    title = "Filtered Books - Milestone Books";
    description = "Explore books matching your selected filters.";
  }

  return { title, description };
}

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

  // Determine dynamic heading elements based on filters
  const selectedGenreList = genre ? genre.split(",").filter(Boolean) : [];
  const selectedAuthorList = author ? author.split(",").filter(Boolean) : [];
  const selectedLanguageList = language ? language.split(",").filter(Boolean) : [];

  const isSingleGenre = selectedGenreList.length === 1;
  const isSingleAuthor = selectedAuthorList.length === 1;
  const isSingleLanguage = selectedLanguageList.length === 1;

  let subtitle = "Explore Our Library";
  let heading = "Find Books across genres and languages";
  let description = "Discover books written by talented authors from around the world. Click on any book to view details and find your next favorite read.";

  if (isSingleAuthor && isSingleGenre) {
    const singleAuthor = selectedAuthorList[0];
    const singleGenre = selectedGenreList[0];
    subtitle = "Filtered Selection";
    heading = `${singleGenre} Books by ${singleAuthor}`;
    description = `Browse our collection of ${singleGenre.toLowerCase()} books written by ${singleAuthor}.`;
  } else if (isSingleAuthor) {
    const singleAuthor = selectedAuthorList[0];
    subtitle = "Literary Voices";
    heading = `Books by ${singleAuthor}`;
    description = `Browse the full collection of books written by ${singleAuthor} in our library.`;
  } else if (isSingleGenre) {
    const singleGenre = selectedGenreList[0];
    subtitle = "Curated Library";
    heading = `${singleGenre} Books`;
    description = `Explore our curated list of ${singleGenre.toLowerCase()} books, handpicked for quality and relevance.`;
  } else if (category) {
    const categoryTitleMap: { [key: string]: string } = {
      featured: "Featured Books",
      "new-arrivals": "New Arrivals",
      "best-sellers": "Best Sellers",
      "combo-offers": "Combo Offers",
    };
    const categoryDescMap: { [key: string]: string } = {
      featured: "Handpicked books that highlight exceptional storytelling and outstanding writing.",
      "new-arrivals": "Freshly added titles to keep your reading list up to date with the latest additions.",
      "best-sellers": "Our most popular and highly-rated titles loved by readers worldwide.",
      "combo-offers": "Special collections and bundles that pair amazing titles at exceptional value.",
    };
    subtitle = "Curated Collections";
    heading = categoryTitleMap[category] || `${category.replace("-", " ")} Books`;
    description = categoryDescMap[category] || `Discover books from our special ${category} collection.`;
  } else if (isSingleLanguage) {
    const singleLanguage = selectedLanguageList[0];
    subtitle = "Global Editions";
    heading = `${singleLanguage} Books`;
    description = `Browse our selection of books written in ${singleLanguage}.`;
  } else if (selectedGenreList.length > 1 || selectedAuthorList.length > 1 || selectedLanguageList.length > 1) {
    subtitle = "Filtered Search";
    heading = "Filtered Books Collection";
    description = "Showing books matching your selected filters.";
  }

  return (
    <div>
      <div className="wrapper py-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-sm font-semibold tracking-wider uppercase opacity-75">
            {subtitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-primary-text leading-tight">
            {heading}
          </h1>
          <p className="text-lg mt-4 opacity-80 leading-relaxed">
            {description}
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
