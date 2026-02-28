import FilterComponent from "@/components/pageComponents/allBooks/FilterComponent";
import SearchInput from "@/components/pageComponents/allBooks/SearchInput";
import BookCard from "@/components/shared/BookCard";
import { getAllProducts } from "@/lib/actions/product.action";
import { ProductType } from "@/types/product";
import React from "react";

const page = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await props.searchParams;

  const query = searchParams.query;
  const pageNumber = Number(searchParams.page) || 1;
  const genre = searchParams.genre;
  const author = searchParams.author;
  const language = searchParams.language;

  const { data: latestProducts } = await getAllProducts({
    query,
    page: pageNumber,
    genre,
    author,
    language,
  });

  return (
    <div>
      <div className="top bg-primary-border p-5 min-h-[150px] w-full grid place-items-center">
        <SearchInput />
      </div>
      <div className="wrapper py-8">
        <FilterComponent />
        <div className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5">
          {latestProducts &&
            latestProducts.map((data, index) => {
              return <BookCard key={data.id} data={data} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default page;
