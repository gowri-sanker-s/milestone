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
    <div>
        <h2>Shopping cart</h2>
      <CartTable cart={cart} />
    </div>
  );
};

export default CartPage;
