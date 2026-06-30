"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formatErrors } from "../utils";

// Toggle product in user's wishlist
export async function toggleWishlistItem(productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "User not authenticated" };
    }

    const userId = session.user.id;

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true, kind: true },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    let isInWishlist = false;
    let message = "";

    if (existingItem) {
      // Remove from wishlist
      await prisma.wishlistItem.delete({
        where: {
          id: existingItem.id,
        },
      });
      isInWishlist = false;
      message = "Removed from wishlist";
    } else {
      // Add to wishlist
      await prisma.wishlistItem.create({
        data: {
          userId,
          productId,
        },
      });
      isInWishlist = true;
      message = "Added to wishlist";
    }

    // Revalidate paths to update pages
    if (product.kind === "bookmark") {
      revalidatePath(`/bookmark-details/${product.slug}`);
    } else {
      revalidatePath(`/book-details/${product.slug}`);
    }
    revalidatePath("/wishlist");
    revalidatePath("/books");
    revalidatePath("/bookmarks");
    revalidatePath("/combos");
    revalidatePath("/");

    return {
      success: true,
      message,
      isInWishlist,
    };
  } catch (error) {
    console.error("toggleWishlistItem error:", error);
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

// Get all wishlist items for the logged-in user
export async function getWishlist() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    const userId = session.user.id;

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return wishlistItems.map((item) => ({
      ...item.product,
      price: Number(item.product.price),
      createdAt: item.product.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("getWishlist error:", error);
    return [];
  }
}

// Check if a specific product is in the user's wishlist
export async function checkIsInWishlist(productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return false;
    }

    const userId = session.user.id;

    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!item;
  } catch (error) {
    console.error("checkIsInWishlist error:", error);
    return false;
  }
}
