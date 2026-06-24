import React from "react";
import { ProductType } from "@/types/product";
import Link from "next/link";
import AddToCart from "@/components/shared/product/add-cart-button";
import { Cart } from "@/types";

type BookCardProps = {
  data: ProductType;
  cart?: Cart;
};

const BookCard = ({ data, cart }: BookCardProps) => {
  return (
    <Link
      href={`/book-details/${data.slug}`}
      key={data.id}
      className="bg-primary-border p-3 rounded-2xl flex flex-col group/card"
    >
      <div className="img-container rounded-2xl overflow-clip relative">
        <img
          src={data.images[0] ?? "/placeholder-book.jpg"}
          alt={data.name}
          className="img aspect-[4/5] transition-transform duration-300 group-hover/card:scale-105"
        />
        {data.stock < 10 && data.stock > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[#b04a26] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-lg uppercase tracking-wider z-1">
            Limited Stock
          </span>
        )}
        {data.stock <= 0 && (
          <span className="absolute top-2.5 left-2.5 bg-neutral-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-lg uppercase tracking-wider z-10">
            Out of Stock
          </span>
        )}
      </div>
      <div className="details grid pt-4 flex-1">
        <p className="text-[13px] capitalize leading-tight">
          {data.author ? String(data.author).toLocaleLowerCase() : (data.kind === "combo" ? "combo offer" : "")}
        </p>
        <h3 className="font-extrabold text-[19px] leading-tight">
          {data.name}
        </h3>
        <p className="text-[15px] py-2 opacity-80">
          {String(data.description).slice(0, 80)}...
        </p>
        {/* pricing & add to cart */}
        <div className="border-t border-primary-bg pt-3 self-end flex gap-3 items-center justify-between font-semibold text-[17px] w-full">
          <span>₹ {data.price}</span>
          <AddToCart
            cart={cart}
            variant="compact"
            item={{
              productId: data.id,
              name: data.name,
              slug: data.slug,
              qty: 1,
              price: data.price,
              image: data.images[0],
            }}
          />
        </div>
      </div>
    </Link>
  );
};

export default BookCard;

