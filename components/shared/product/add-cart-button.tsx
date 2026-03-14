"use client";
import React from "react";
import { CartItem } from "@/types";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/sonner";
import { addItemToCart } from "@/lib/actions/cart.action";
const AddToCart = ({ item }: { item: CartItem }) => {
  const { toast } = useToast();
  const router = useRouter();
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message,
      });
      return;
    }
    toast({
      description: `${item.name} added to cart`,
      action: (
        <ToastAction onClick={() => router.push("/cart")}>
          Go TO Cart
        </ToastAction>
      ),
    });
  };
  return (
    <button
      onClick={handleAddToCart}
      className="flex gap-2 items-center bg-primary-text hover:bg-primary-text/90 transition-colors text-primary-bg px-8 py-2 rounded-full font-semibold cursor-pointer"
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
