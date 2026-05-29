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
      <div className="img-container rounded-2xl overflow-clip">
        <img
          src={data.images[0] ?? "/placeholder-book.jpg"}
          alt={data.name}
          className="img aspect-[4/5] transition-transform duration-300 group-hover/card:scale-105"
        />
      </div>
      <div className="details grid pt-4 flex-1">
        <p className="text-[13px] capitalize leading-tight">
          {String(data.author).toLocaleLowerCase()}
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

