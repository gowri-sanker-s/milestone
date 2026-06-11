"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";

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
    return data
      ? {
          ...data,
          price: Number(data.price),
          createdAt: data.createdAt.toISOString(),
        }
      : null;
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return null;
  }
}

export async function getProductById(id: string) {
  try {
    const data = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    return data
      ? {
          ...data,
          price: Number(data.price),
          createdAt: data.createdAt.toISOString(),
        }
      : null;
  } catch (error) {
    console.error("getProductById error:", error);
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

    const condition: any = {
      ...(query && { name: { contains: query, mode: "insensitive" as const } }),
      ...(genre && { genres: { has: genre } }),
      ...(author && { author }),
      ...(language && { language }),
    };

    if (category) {
      if (category === "featured") {
        condition.isFeatured = true;
      } else if (category === "best-sellers") {
        condition.rating = { gte: 4.5 };
      } else if (category === "combo-offers") {
        condition.price = { gte: 250 };
      }
    }

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

// create product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({
      data: product,
    });
    revalidatePath("/admin/products");
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    console.error("createProduct error:", error);
    return { success: false, message: "Failed to create product" };
  }
}
// update product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExist = await prisma.product.findFirst({
      where: { id: product.id },
    });
    if (!productExist) {
      return { success: false, message: "Product not found" };
    }
    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });
    revalidatePath("/admin/products");
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    console.error("updateProduct error:", error);
    return { success: false, message: "Failed to update product" };
  }
}

// Get unique genres with counts
export async function getUniqueGenresWithCount() {
  try {
    const products = await prisma.product.findMany({
      select: {
        genres: true,
      },
    });

    const counts: Record<string, number> = {};
    products.forEach((product) => {
      product.genres.forEach((genre) => {
        counts[genre] = (counts[genre] || 0) + 1;
      });
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    })).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("getUniqueGenresWithCount error:", error);
    return [];
  }
}

// Get unique authors with counts and sample images
export async function getUniqueAuthorsWithCount() {
  try {
    const products = await prisma.product.findMany({
      select: {
        author: true,
        images: true,
      },
    });

    const dbAuthors = await prisma.author.findMany();
    const dbAuthorsMap = new Map(dbAuthors.map((a) => [a.name.toLowerCase(), a]));

    const authorsData: Record<string, { count: number; image: string | null }> = {};
    
    // Add counts and default images from products
    products.forEach((product) => {
      const author = product.author;
      const matchedAuthor = dbAuthorsMap.get(author.toLowerCase());
      const customImage = matchedAuthor?.image;

      if (!authorsData[author]) {
        authorsData[author] = { 
          count: 0, 
          image: customImage || product.images[0] || null 
        };
      }
      authorsData[author].count += 1;
    });

    // Ensure all database-registered authors are represented (even if they have 0 books)
    dbAuthors.forEach((dbAuthor) => {
      const existingKey = Object.keys(authorsData).find(
        (k) => k.toLowerCase() === dbAuthor.name.toLowerCase()
      );
      
      if (!existingKey) {
        authorsData[dbAuthor.name] = { 
          count: 0, 
          image: dbAuthor.image || null 
        };
      } else if (dbAuthor.image) {
        // Prefer database author profile image over standard product cover image
        authorsData[existingKey].image = dbAuthor.image;
      }
    });

    return Object.entries(authorsData).map(([name, data]) => ({
      name,
      count: data.count,
      image: data.image,
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("getUniqueAuthorsWithCount error:", error);
    return [];
  }
}

// Get unique languages
export async function getUniqueLanguages() {
  try {
    const products = await prisma.product.findMany({
      select: {
        language: true,
      },
    });

    const uniqueLanguages = Array.from(
      new Set(products.map((product) => product.language).filter(Boolean))
    );

    return uniqueLanguages.sort();
  } catch (error) {
    console.error("getUniqueLanguages error:", error);
    return [];
  }
}

// Get dynamic counts for the promotional categories
export async function getCategoryCounts() {
  try {
    const [featured, newArrivals, bestSellers, comboOffers] = await Promise.all([
      prisma.product.count({ where: { isFeatured: true } }),
      prisma.product.count(),
      prisma.product.count({ where: { rating: { gte: 4.5 } } }),
      prisma.product.count({ where: { price: { gte: 250 } } }),
    ]);

    return {
      featured,
      newArrivals,
      bestSellers,
      comboOffers,
    };
  } catch (error) {
    console.error("getCategoryCounts error:", error);
    return { featured: 0, newArrivals: 0, bestSellers: 0, comboOffers: 0 };
  }
}

