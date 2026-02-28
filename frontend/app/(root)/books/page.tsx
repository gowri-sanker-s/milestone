import FilterComponent from "@/components/pageComponents/allBooks/FilterComponent";
import BookCard from "@/components/shared/BookCard";
import { getFeaturedProducts } from "@/lib/actions/product.action";
import { ProductType } from "@/types/product";
import { Search } from "lucide-react";
import React from "react";

const page = async () => {
  const latestProducts: ProductType[] = await getFeaturedProducts();
  return (
    <div>
      <div className="top bg-primary-border p-5 min-h-[150px] w-full grid place-items-center">
        <div className="relative bg-white  rounded-full w-full max-w-[50%] mx-auto overflow-clip">
          <input
            type="text"
            className="w-full p-3 px-4 focus-visible:outline-0"
            placeholder="Search books, authors, or genres..."
          />
          <button className="flex gap-2 items-center h-full absolute right-0 top-0 bg-primary-text text-primary-bg px-7">
            <Search size={16} strokeWidth={1.8} />
            <span className="font-semibold">Search</span>
          </button>
        </div>
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
