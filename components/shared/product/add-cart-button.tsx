import React from "react";
import { CartItem } from "@/types";

const AddToCart = ({ item }: { item: CartItem }) => {
  return (
    <button className="flex gap-2 items-center bg-primary-text text-primary-bg px-8 py-2 rounded-full font-semibold">
      Add to Cart
    </button>
  );
};

export default AddToCart;
