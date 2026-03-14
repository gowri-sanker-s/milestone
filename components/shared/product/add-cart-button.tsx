"use client";

import React, { useTransition } from "react";
import { Cart, CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Minus, Loader } from "lucide-react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(`${item.name} ${res.message}`, {
        action: {
          label: "Go to Cart",
          onClick: () => router.push("/cart"),
        },
      });
    });
  };
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };
  // check if item is in cart
  const itemExist =
    cart && cart.items.find((x) => x.productId === item.productId);

  return itemExist ? (
    <>
      <button type="button" onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className="animate-spin" />
        ) : (
          <Minus strokeWidth={1.5} />
        )}
      </button>
      <span>{itemExist.qty}</span>
      <button type="button" onClick={handleAddToCart}>
        {isPending ? (
          <Loader className="animate-spin" />
        ) : (
          <Plus strokeWidth={1.5} />
        )}
      </button>
    </>
  ) : (
    <button
      onClick={handleAddToCart}
      className="flex gap-2 items-center bg-primary-text hover:bg-primary-text/90 transition-colors text-primary-bg px-8 py-2 rounded-full font-semibold cursor-pointer"
    >
      {isPending ? <Loader className="animate-spin" /> : "Add to Cart"}
    </button>
  );
};

export default AddToCart;
