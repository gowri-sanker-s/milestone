"use server";

import { prisma } from "@/lib/prisma";

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
    return data;
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
}: {
  query?: string;
  limit?: number;
  page?: number;
  genre?: string;
  author?: string;
  language?: string;
}) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const condition = {
      ...(query && { name: { contains: query, mode: "insensitive" as const } }),
      ...(genre && { genres: { has: genre } }),
      ...(author && { author }),
      ...(language && { language }),
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
