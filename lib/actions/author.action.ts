"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { insertAuthorSchema, updateAuthorSchema } from "../validators";
import { formatErrors } from "../utils";

const PAGE_SIZE = 10;

// Get all authors (paginated, searchable)
export async function getAllAuthors({
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

    const authors = await prisma.author.findMany({
      where: condition,
      orderBy: { name: "asc" },
      skip: skipAmount,
      take: limit,
    });

    const totalAuthors = await prisma.author.count({
      where: condition,
    });

    return {
      success: true,
      authors: authors.map((author) => ({
        ...author,
        createdAt: author.createdAt.toISOString(),
        updatedAt: author.updatedAt.toISOString(),
      })),
      totalPages: Math.ceil(totalAuthors / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("getAllAuthors error:", error);
    return {
      success: false,
      authors: [],
      totalPages: 0,
      currentPage: 1,
      message: "Failed to fetch authors",
    };
  }
}

// Get single author by ID
export async function getAuthorById(id: string) {
  try {
    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) return null;

    return {
      ...author,
      createdAt: author.createdAt.toISOString(),
      updatedAt: author.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("getAuthorById error:", error);
    return null;
  }
}

// Create an author
export async function createAuthor(data: z.infer<typeof insertAuthorSchema>) {
  try {
    const parsed = insertAuthorSchema.parse(data);

    // Check if name already exists (case-insensitive check would be safer but unique is exact)
    const existing = await prisma.author.findFirst({
      where: {
        name: {
          equals: parsed.name,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return { success: false, message: "An author with this name already exists." };
    }

    await prisma.author.create({
      data: {
        name: parsed.name.trim(),
        bio: parsed.bio?.trim() || null,
        image: parsed.image || null,
      },
    });

    revalidatePath("/admin/authors");
    revalidatePath("/books/authors");

    return { success: true, message: "Author created successfully." };
  } catch (error) {
    console.error("createAuthor error:", error);
    return { success: false, message: formatErrors(error) };
  }
}

// Update an author
export async function updateAuthor(data: z.infer<typeof updateAuthorSchema>) {
  try {
    const parsed = updateAuthorSchema.parse(data);

    const authorExists = await prisma.author.findUnique({
      where: { id: parsed.id },
    });

    if (!authorExists) {
      return { success: false, message: "Author not found" };
    }

    // Check name conflict
    const nameConflict = await prisma.author.findFirst({
      where: {
        id: { not: parsed.id },
        name: {
          equals: parsed.name,
          mode: "insensitive",
        },
      },
    });

    if (nameConflict) {
      return { success: false, message: "Another author with this name already exists." };
    }

    const oldName = authorExists.name;
    const newName = parsed.name.trim();

    // Use a transaction to update author and sync with products if the name changes
    await prisma.$transaction(async (tx) => {
      await tx.author.update({
        where: { id: parsed.id },
        data: {
          name: newName,
          bio: parsed.bio?.trim() || null,
          image: parsed.image || null,
        },
      });

      if (oldName !== newName) {
        await tx.product.updateMany({
          where: { author: oldName },
          data: { author: newName },
        });
      }
    });

    revalidatePath("/admin/authors");
    revalidatePath("/books/authors");
    revalidatePath("/books");

    return { success: true, message: "Author updated successfully." };
  } catch (error) {
    console.error("updateAuthor error:", error);
    return { success: false, message: formatErrors(error) };
  }
}

// Delete an author
export async function deleteAuthor(id: string) {
  try {
    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return { success: false, message: "Author not found" };
    }

    // Check if there are products associated with this author name
    const productCount = await prisma.product.count({
      where: { author: author.name },
    });

    if (productCount > 0) {
      return {
        success: false,
        message: `Cannot delete author "${author.name}" because they have ${productCount} associated books. Delete or reassign their books first.`,
      };
    }

    await prisma.author.delete({
      where: { id },
    });

    revalidatePath("/admin/authors");
    revalidatePath("/books/authors");

    return { success: true, message: "Author deleted successfully." };
  } catch (error) {
    console.error("deleteAuthor error:", error);
    return { success: false, message: formatErrors(error) };
  }
}

// Sync authors from existing products (for self-healing / backward compatibility)
export async function syncAuthorsFromProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        author: true,
        images: true,
      },
    });

    const uniqueAuthors = new Map<string, string | null>();
    products.forEach((product) => {
      if (!uniqueAuthors.has(product.author)) {
        uniqueAuthors.set(product.author, product.images[0] || null);
      }
    });

    let syncCount = 0;
    for (const [name, image] of uniqueAuthors.entries()) {
      const exists = await prisma.author.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      });

      if (!exists) {
        await prisma.author.create({
          data: {
            name,
            image,
            bio: `Writer of standard literary works, including publications featured in Milestone Books.`,
          },
        });
        syncCount++;
      }
    }

    if (syncCount > 0) {
      revalidatePath("/admin/authors");
      revalidatePath("/books/authors");
    }

    return { success: true, message: `Synced ${syncCount} new authors.` };
  } catch (error) {
    console.error("syncAuthorsFromProducts error:", error);
    return { success: false, message: "Sync failed" };
  }
}

// Fetch unpaginated list of all authors for select dropdown
export async function getAuthorsList() {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });
    return authors;
  } catch (error) {
    console.error("getAuthorsList error:", error);
    return [];
  }
}

