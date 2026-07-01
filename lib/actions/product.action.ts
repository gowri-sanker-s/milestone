"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";
import { syncAuthorsFromProducts } from "./author.action";
import { syncGenresFromProducts } from "./genre.action";
import { auth } from "@/auth";

export async function getFeaturedProducts(options?: {
  isFeatured?: boolean;
  take?: number;
  kind?: string;
}) {
  try {
    const data = await prisma.product.findMany({
      where: {
        kind: options?.kind ?? "book",
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
  kind = "book",
}: {
  query?: string;
  limit?: number;
  page?: number;
  genre?: string;
  author?: string;
  language?: string;
  category?: string;
  kind?: string;
}) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const condition: any = {
      kind,
      ...(query && { name: { contains: query, mode: "insensitive" as const } }),
      ...(genre && { genres: { has: genre } }),
      ...(author && {
        author: {
          equals: author,
          mode: "insensitive" as const,
        },
      }),
      ...(language && { language }),
    };

    if (category) {
      if (category === "featured") {
        condition.isFeatured = true;
      } else if (category === "best-sellers") {
        condition.rating = { gte: 4.5 };
      } else if (category === "combo-offers") {
        condition.kind = "combo";
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
    await syncGenresFromProducts();

    const dbGenres = await prisma.genre.findMany({
      orderBy: { name: "asc" },
    });

    const products = await prisma.product.findMany({
      select: {
        genres: true,
      },
    });

    const counts: Record<string, number> = {};
    products.forEach((product) => {
      product.genres.forEach((genre) => {
        const key = genre.trim();
        counts[key.toLowerCase()] = (counts[key.toLowerCase()] || 0) + 1;
      });
    });

    return dbGenres.map((genre) => {
      const lowerName = genre.name.trim().toLowerCase();
      return {
        name: genre.name,
        count: counts[lowerName] || 0,
      };
    }).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("getUniqueGenresWithCount error:", error);
    return [];
  }
}

// Get unique authors with counts and sample images
export async function getUniqueAuthorsWithCount() {
  try {
    await syncAuthorsFromProducts();

    const dbAuthors = await prisma.author.findMany({
      orderBy: { name: "asc" },
    });

    const products = await prisma.product.findMany({
      where: {
        kind: "book",
        author: { not: null },
      },
      select: {
        author: true,
        images: true,
      },
    });

    const counts: Record<string, number> = {};
    const firstProductImages: Record<string, string | null> = {};

    products.forEach((product) => {
      if (!product.author) return;
      const key = product.author.trim();
      const lowerKey = key.toLowerCase();
      counts[lowerKey] = (counts[lowerKey] || 0) + 1;
      if (!firstProductImages[lowerKey] && product.images.length > 0) {
        firstProductImages[lowerKey] = product.images[0];
      }
    });

    return dbAuthors.map((author) => {
      const lowerName = author.name.trim().toLowerCase();
      return {
        name: author.name,
        image: author.image || firstProductImages[lowerName] || null,
        count: counts[lowerName] || 0,
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("getUniqueAuthorsWithCount error:", error);
    return [];
  }
}

// Get unique languages
export async function getUniqueLanguages() {
  try {
    const products = await prisma.product.findMany({
      where: {
        kind: "book",
        language: { not: null },
      },
      select: {
        language: true,
      },
    });

    const uniqueLanguages = Array.from(
      new Set(
        products
          .map((product) => product.language)
          .filter((l): l is string => !!l)
      )
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
      prisma.product.count({ where: { kind: "combo" } }),
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

// Bulk import/upsert products from CSV payload
export async function bulkImportProducts(products: any[]) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, message: "Unauthorized. Admin permissions required." };
    }

    let created = 0;
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < products.length; i++) {
      const rowNum = i + 2; // Row 1 is header
      const raw = products[i];

      try {
        const name = String(raw.name || "").trim();
        if (!name) {
          throw new Error("Product name is required");
        }

        // Generate slug if not provided
        let slug = String(raw.slug || "").trim();
        if (!slug) {
          slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }

        const price = Math.floor(Number(raw.price || 0));
        if (isNaN(price) || price < 0) {
          throw new Error("Price must be a positive number");
        }

        const stock = Math.floor(Number(raw.stock || 0));
        if (isNaN(stock) || stock < 0) {
          throw new Error("Stock must be a positive integer");
        }

        const title = raw.title ? String(raw.title).trim() : name;
        if (!title) {
          throw new Error("Title is required");
        }

        const description = String(raw.description || "").trim();
        const author = raw.author ? String(raw.author).trim() : null;
        const language = raw.language ? String(raw.language).trim() : "English";
        const pages = raw.pages ? Math.floor(Number(raw.pages)) : null;
        const kind = raw.kind ? String(raw.kind).trim() : "book";

        let genres: string[] = [];
        if (raw.genres) {
          if (Array.isArray(raw.genres)) {
            genres = raw.genres.map((g: any) => String(g).trim()).filter(Boolean);
          } else {
            genres = String(raw.genres)
              .split(",")
              .map((g: string) => g.trim())
              .filter(Boolean);
          }
        }

        let images: string[] = ["/placeholder-book.jpg"];
        if (raw.images) {
          if (Array.isArray(raw.images)) {
            images = raw.images.map((img: any) => String(img).trim()).filter(Boolean);
          } else {
            images = String(raw.images)
              .split(",")
              .map((img: string) => img.trim())
              .filter(Boolean);
          }
        }

        // Check if slug already exists to decide on update vs create
        const existing = await prisma.product.findUnique({
          where: { slug },
        });

        if (existing) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              name,
              title,
              images,
              description,
              price,
              stock,
              author,
              language,
              pages,
              genres,
              kind,
            },
          });
          updated++;
        } else {
          await prisma.product.create({
            data: {
              name,
              title,
              slug,
              images,
              description,
              price,
              stock,
              author,
              language,
              pages,
              genres,
              kind,
            },
          });
          created++;
        }
      } catch (e: any) {
        failed++;
        errors.push(`Row ${rowNum}: ${e.message}`);
      }
    }

    // Revalidate relevant pages
    revalidatePath("/admin/products");
    revalidatePath("/books");
    revalidatePath("/bookmarks");
    revalidatePath("/combos");
    revalidatePath("/");

    return {
      success: true,
      createdCount: created,
      updatedCount: updated,
      failedCount: failed,
      errors,
    };
  } catch (error) {
    console.error("bulkImportProducts error:", error);
    return { success: false, message: "Critical failure during bulk import process" };
  }
}

