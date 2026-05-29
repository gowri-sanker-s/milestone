"use client";

import React, { useTransition } from "react";
import { Cart, CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Minus, Loader } from "lucide-react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import Image from "next/image";
import addCartImg from "@/assets/images/add_cart.png";

const AddToCart = ({
  item,
  cart,
  variant = "default",
}: {
  item: CartItem;
  cart?: Cart;
  variant?: "default" | "compact";
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const triggerFlyAnimation = () => {
    try {
      // Find the book cover image in the page DOM
      const imgSelector = item.image 
        ? `img[src*="${item.image.split('/').pop()}"]`
        : `.left img`;
      
      const imgElement = 
        document.querySelector(imgSelector) || 
        document.querySelector(`.left img`) ||
        document.querySelector(`img`);

      if (imgElement) {
        const rect = imgElement.getBoundingClientRect();
        window.dispatchEvent(
          new CustomEvent("cart-item-flying", {
            detail: {
              startX: rect.left,
              startY: rect.top,
              image: item.image,
            },
          })
        );
      }
    } catch (e) {
      console.warn("Could not fire fly animation", e);
    }
  };

  const handleAddToCart = async () => {
    // Fire the flying animation immediately for delightful instant feedback!
    triggerFlyAnimation();

    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      // Notify other components that cart has been updated
      window.dispatchEvent(new Event("cart-updated"));

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
        // Notify other components that cart has been updated
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        toast.error(res.message);
      }
    });
  };

  // check if item is in cart
  const itemExist =
    cart && cart.items.find((x) => x.productId === item.productId);

  if (variant === "compact") {
    return itemExist ? (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="flex items-center gap-2 bg-primary-text/10 border border-primary-text/5 rounded-full px-2.5 py-1 text-primary-text font-bold text-sm"
      >
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemoveFromCart();
          }}
          className="w-5 h-5 rounded-full hover:bg-primary-text/20 flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
        >
          {isPending ? (
            <Loader className="w-2.5 h-2.5 animate-spin" />
          ) : (
            <Minus className="w-3 h-3" strokeWidth={2.5} />
          )}
        </button>
        <span className="w-4 text-center text-xs font-extrabold select-none leading-none">
          {itemExist.qty}
        </span>
        <button
          type="button"
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          className="w-5 h-5 rounded-full hover:bg-primary-text/20 flex items-center justify-center transition disabled:opacity-40 cursor-pointer"
        >
          {isPending ? (
            <Loader className="w-2.5 h-2.5 animate-spin" />
          ) : (
            <Plus className="w-3 h-3" strokeWidth={2.5} />
          )}
        </button>
      </div>
    ) : (
      <button
        type="button"
        disabled={isPending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart();
        }}
        className="img-container h-7 w-7 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-300 relative disabled:opacity-50"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin text-primary-text" />
        ) : (
          <Image
            src={addCartImg}
            alt="Add to cart"
            className="icon"
          />
        )}
      </button>
    );
  }

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


