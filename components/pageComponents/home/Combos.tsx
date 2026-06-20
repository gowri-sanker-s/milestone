import { getAllCombos } from "@/lib/actions/combo.action";
import React from "react";
import type { ProductType } from "@/types/product";
import { getMyCart } from "@/lib/actions/cart.action";
import BookCard from "@/components/shared/BookCard";
import Link from "next/link";

const Combos = async () => {
  const combosResponse = await getAllCombos({
    limit: 6,
  });

  const latestCombos = (combosResponse?.success && combosResponse.combos ? combosResponse.combos : []) as ProductType[];

  const cart = await getMyCart();

  if (latestCombos.length === 0) return null;

  return (
    <div className="wrapper py-10 border-t border-primary-border/40">
      <h2 className="font-extrabold text-[30px] text-center">
        Special Combo Offers
      </h2>
      <p className="md:max-w-[70%] mx-auto text-center py-3">
        Discover curated book bundles and special collections that pair amazing titles at an exceptional value. Perfect for gifting or building your personal library!
      </p>
      <div className="grid xs:grid-cols-2 md:grid-cols-3 gap-6 pt-5">
        {latestCombos.map((data) => (
          <BookCard key={data.id} data={data} cart={cart} />
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Link
          href="/combos"
          className="p-2.5 px-8 rounded-full bg-primary-text text-primary-bg hover:bg-primary-text/90 font-semibold transition-transform hover:scale-105 shadow-sm inline-block"
        >
          View More Combos
        </Link>
      </div>
    </div>
  );
};

export default Combos;
