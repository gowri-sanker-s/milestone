"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { insertGenreSchema, updateGenreSchema } from "../validators";
import { formatErrors } from "../utils";

const PAGE_SIZE = 10;

// Get all genres (paginated, searchable)
export async function getAllGenres({
  query,
  page = 1,
  limit = PAGE_SIZE,
}: {
  query?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const condition = query
      ? {
          name: {
            contains: query,
            mode: "insensitive" as const,
          },
        }
      : {};

    const genres = await prisma.genre.findMany({
      where: condition,
      orderBy: { name: "asc" },
      skip: skipAmount,
      take: limit,
    });

    const totalGenres = await prisma.genre.count({
      where: condition,
    });

    return {
      success: true,
      genres: genres.map((g) => ({
        ...g,
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
      })),
      totalPages: Math.ceil(totalGenres / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("getAllGenres error:", error);
    return {
      success: false,
      genres: [],
      totalPages: 0,
      currentPage: 1,
      message: "Failed to fetch genres",
    };
  }
}

// Fetch all genres unpaginated for selects
export async function getGenresList() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });
    return genres;
  } catch (error) {
    console.error("getGenresList error:", error);
    return [];
  }
}

// Get single genre by ID
export async function getGenreById(id: string) {
  try {
    const genre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) return null;

    return {
      ...genre,
      createdAt: genre.createdAt.toISOString(),
      updatedAt: genre.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("getGenreById error:", error);
    return null;
  }
}

// Create a genre
export async function createGenre(data: z.infer<typeof insertGenreSchema>) {
  try {
    const parsed = insertGenreSchema.parse(data);

    // Check conflict
    const existing = await prisma.genre.findFirst({
      where: {
        name: {
          equals: parsed.name,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return { success: false, message: "A genre with this name already exists." };
    }

    await prisma.genre.create({
      data: {
        name: parsed.name.trim(),
      },
    });

    revalidatePath("/admin/genres");
    revalidatePath("/books/genres");

    return { success: true, message: "Genre created successfully." };
  } catch (error) {
    console.error("createGenre error:", error);
    return { success: false, message: formatErrors(error) };
  }
}

// Update a genre
export async function updateGenre(data: z.infer<typeof updateGenreSchema>) {
  try {
    const parsed = updateGenreSchema.parse(data);

    const genreExists = await prisma.genre.findUnique({
      where: { id: parsed.id },
    });

    if (!genreExists) {
      return { success: false, message: "Genre not found" };
    }

    // Check name conflict
    const nameConflict = await prisma.genre.findFirst({
      where: {
        id: { not: parsed.id },
        name: {
          equals: parsed.name,
          mode: "insensitive",
        },
      },
    });

    if (nameConflict) {
      return { success: false, message: "Another genre with this name already exists." };
    }

    const oldName = genreExists.name;
    const newName = parsed.name.trim();

    // Update in transaction and update products genres array
    await prisma.$transaction(async (tx) => {
      await tx.genre.update({
        where: { id: parsed.id },
        data: {
          name: newName,
        },
      });

      if (oldName !== newName) {
        // Fetch products that have the old genre
        const productsToUpdate = await tx.product.findMany({
          where: {
            genres: {
              has: oldName,
            },
          },
          select: {
            id: true,
            genres: true,
          },
        });

        for (const product of productsToUpdate) {
          const updatedGenres = product.genres.map((g) =>
            g.toLowerCase() === oldName.toLowerCase() ? newName : g
          );
          await tx.product.update({
            where: { id: product.id },
            data: {
              genres: updatedGenres,
            },
          });
        }
      }
    });

    revalidatePath("/admin/genres");
    revalidatePath("/books/genres");
    revalidatePath("/books");

    return { success: true, message: "Genre updated successfully." };
  } catch (error) {
    console.error("updateGenre error:", error);
    return { success: false, message: formatErrors(error) };
  }
}

// Delete a genre
export async function deleteGenre(id: string) {
  try {
    const genre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      return { success: false, message: "Genre not found" };
    }

    // Check if there are products with this genre
    const productCount = await prisma.product.count({
      where: {
        genres: {
          has: genre.name,
        },
      },
    });

    if (productCount > 0) {
      return {
        success: false,
        message: `Cannot delete genre "${genre.name}" because it is associated with ${productCount} books.`,
      };
    }

    await prisma.genre.delete({
      where: { id },
    });

    revalidatePath("/admin/genres");
    revalidatePath("/books/genres");

    return { success: true, message: "Genre deleted successfully." };
  } catch (error) {
    console.error("deleteGenre error:", error);
    return { success: false, message: formatErrors(error) };
  }
}

// Sync genres from existing products
export async function syncGenresFromProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        genres: true,
      },
    });

    const uniqueGenres = new Set<string>();
    products.forEach((product) => {
      product.genres.forEach((g) => uniqueGenres.add(g));
    });

    let syncCount = 0;
    for (const name of uniqueGenres) {
      const exists = await prisma.genre.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      });

      if (!exists) {
        await prisma.genre.create({
          data: {
            name,
          },
        });
        syncCount++;
      }
    }

    if (syncCount > 0) {
      revalidatePath("/admin/genres");
      revalidatePath("/books/genres");
    }

    return { success: true, message: `Synced ${syncCount} new genres.` };
  } catch (error) {
    console.error("syncGenresFromProducts error:", error);
    return { success: false, message: "Sync failed" };
  }
}
