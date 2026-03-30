"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFeaturedProducts(options?: {
  isFeatured?: boolean;
  take?: number;
}) {
  try {
    const data = await prisma.product.findMany({
      where: {
        ...(options?.isFeatured !== undefined && {
          isFeatured: options.isFeatured,
        }),
      },
      take: options?.take ?? undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return data.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("getFeaturedProducts error:", error);
    return [];
  }
}
export async function getProductBySlug(slug: string) {
  try {
    const data = await prisma.product.findUnique({
      where: {
        slug,
      },
    });
    return data ? { ...data, price: Number(data.price) } : null;
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return null;
  }
}

export async function getAllProducts({
  query,
  limit = 10,
  page = 1,
  genre,
  author,
  language,
  category,
}: {
  query?: string;
  limit?: number;
  page?: number;
  genre?: string;
  author?: string;
  language?: string;
  category?: string;
}) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const condition = {
      ...(query && { name: { contains: query, mode: "insensitive" as const } }),
      ...(genre && { genres: { has: genre } }),
      ...(author && { author }),
      ...(language && { language }),
      ...(category && { category }),
    };

    const data = await prisma.product.findMany({
      where: condition,
      orderBy: { createdAt: "desc" },
      skip: skipAmount,
      take: limit,
    });

    const dataCount = await prisma.product.count({
      where: condition,
    });

    return {
      data: data.map((product) => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
      })),
      totalPages: Math.ceil(dataCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("getAllProducts error:", error);
    return { data: [], totalPages: 0, currentPage: 1 };
  }
}

// delete a product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });
    if (!productExists) {
      return { success: false, message: "Product not found" };
    }
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("deleteProduct error:", error);
    return { success: false, message: "Failed to delete product" };
  }
}
