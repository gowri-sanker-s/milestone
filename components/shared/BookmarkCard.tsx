import React from "react";
import Link from "next/link";
import AddToCart from "@/components/shared/product/add-cart-button";
import { Cart } from "@/types";

type BookmarkCardProps = {
  data: {
    id: string;
    name: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    height: number | null;
    width: number | null;
    stock: number;
  };
  cart?: Cart;
};

const BookmarkCard = ({ data, cart }: BookmarkCardProps) => {
  return (
    <Link
      href={`/bookmark-details/${data.slug}`}
      key={data.id}
      className="bg-primary-border p-3 rounded-2xl flex flex-col group/card"
    >
      <div className="img-container rounded-2xl overflow-clip aspect-[4/5] bg-primary-bg relative">
        <img
          src={data.images[0] ?? "/placeholder-book.jpg"}
          alt={data.name}
          className="img w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
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
        <p className="text-[12px] font-bold text-primary-text/60 uppercase tracking-wider leading-tight">
          {data.width && data.height
            ? `${data.width} × ${data.height} cm`
            : "Standard Size"}
        </p>
        <h3 className="font-extrabold text-[19px] leading-tight mt-1 text-primary-text">
          {data.name}
        </h3>
        <p className="text-[14px] py-2 opacity-80 text-primary-text/90 line-clamp-2">
          {data.description}
        </p>
        {/* pricing & add to cart */}
        <div className="border-t border-primary-bg pt-3 self-end flex gap-3 items-center justify-between font-semibold text-[17px] w-full text-primary-text">
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

export default BookmarkCard;
