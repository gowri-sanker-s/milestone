"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { insertReviewSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { formatErrors } from "../utils";

// Create or update a review
export async function createOrUpdateReview(data: any) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, message: "User not authenticated" };
    }

    const userId = session.user?.id;
    if (!userId) {
      return { success: false, message: "User not found" };
    }

    // Parse data and attach userId
    const parsedData = insertReviewSchema.parse({
      ...data,
      userId,
    });

    // Check if product exists and get its details
    const product = await prisma.product.findUnique({
      where: { id: parsedData.productId },
      select: { slug: true, kind: true },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    // Check if the user purchased this product in a completed/paid order
    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId,
        isPaid: true,
        orderitems: {
          some: {
            productId: parsedData.productId,
          },
        },
      },
    });

    const isVerifiedPurchase = !!hasPurchased;

    // Use a transaction to create/update the review and update product aggregates
    await prisma.$transaction(async (tx) => {
      // Upsert the review
      await tx.review.upsert({
        where: {
          userId_productId: {
            userId,
            productId: parsedData.productId,
          },
        },
        update: {
          rating: parsedData.rating,
          description: parsedData.description,
          isVerifiedPurchase,
        },
        create: {
          userId,
          productId: parsedData.productId,
          rating: parsedData.rating,
          description: parsedData.description,
          isVerifiedPurchase,
        },
      });

      // Calculate aggregate rating and count
      const stats = await tx.review.aggregate({
        where: { productId: parsedData.productId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const avgRating = stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0;
      const reviewsCount = stats._count.rating ?? 0;

      // Update product rating and count
      await tx.product.update({
        where: { id: parsedData.productId },
        data: {
          rating: avgRating,
          reviewsCount,
        },
      });
    });

    // Revalidate paths to update pages
    if (product.kind === "bookmark") {
      revalidatePath(`/bookmark-details/${product.slug}`);
    } else {
      revalidatePath(`/book-details/${product.slug}`);
    }

    return {
      success: true,
      message: "Review submitted successfully",
    };
  } catch (error: any) {
    console.error("createOrUpdateReview error:", error);
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

// Fetch all reviews for a product
export async function getProductReviews(productId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("getProductReviews error:", error);
    return [];
  }
}

// Fetch current user's review for a product if it exists
export async function getUserReviewForProduct(productId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    const review = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (!review) return null;

    return {
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("getUserReviewForProduct error:", error);
    return null;
  }
}
