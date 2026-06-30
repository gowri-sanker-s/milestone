"use client";

import React, { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleWishlistItem } from "@/lib/actions/wishlist.action";

type WishlistButtonProps = {
  productId: string;
  initialIsInWishlist: boolean;
  authenticated: boolean;
  variant?: "icon-only" | "with-text";
  slug?: string;
  kind?: string;
};

const WishlistButton = ({
  productId,
  initialIsInWishlist,
  authenticated,
  variant = "icon-only",
  slug = "",
  kind = "book",
}: WishlistButtonProps) => {
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authenticated) {
      toast.error("Please sign in to save items to your wishlist");
      const currentPath = kind === "bookmark" ? `/bookmark-details/${slug}` : `/book-details/${slug}`;
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Optimistic update
    setIsInWishlist((prev) => !prev);

    startTransition(async () => {
      try {
        const res = await toggleWishlistItem(productId);
        if (res.success) {
          setIsInWishlist(res.isInWishlist!);
          toast.success(res.message);
        } else {
          // Rollback on failure
          setIsInWishlist(initialIsInWishlist);
          toast.error(res.message);
        }
      } catch (err) {
        setIsInWishlist(initialIsInWishlist);
        toast.error("Failed to update wishlist. Please try again.");
      }
    });
  };

  if (variant === "with-text") {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex gap-2 items-center px-8 py-2 rounded-full font-semibold transition-all duration-300 active:scale-95 border ${
          isInWishlist
            ? "bg-[#b04a26] text-white border-[#b04a26]"
            : "bg-primary-border text-primary-text hover:bg-primary-border/80 border-transparent"
        }`}
      >
        <Heart
          size={20}
          strokeWidth={1.5}
          className={`${isInWishlist ? "fill-white text-white" : "text-primary-text"}`}
        />
        <span>{isInWishlist ? "Saved" : "Save for Later"}</span>
      </button>
    );
  }

  // Default: icon-only (for lists/grids/cards)
  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center border ${
        isInWishlist
          ? "bg-[#b04a26] text-white border-[#b04a26]"
          : "bg-primary-border text-primary-text hover:bg-primary-border/80 border-transparent"
      }`}
    >
      <Heart
        size={18}
        strokeWidth={1.5}
        className={`${isInWishlist ? "fill-white text-white" : "text-primary-text"}`}
      />
    </button>
  );
};

export default WishlistButton;
