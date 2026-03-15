import { Metadata } from "next";
import React from "react";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.action";
export const metadata = {
  title: "Your Cart",
};
const CartPage = async () => {
  const cart = await getMyCart();
  return (
    <div className="wrapper mt-10">
      <div className="">
        <CartTable cart={cart} />
      </div>
    </div>
  );
};

export default CartPage;
