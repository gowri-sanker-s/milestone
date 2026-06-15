"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { insertBookmarkSchema, updateBookmarkSchema } from "../validators";
import { getAllProducts } from "./product.action";

export async function getAllBookmarks({
  query,
  limit = 10,
  page = 1,
}: {
  query?: string;
  limit?: number;
  page?: number;
}) {
  try {
    const skipAmount = (Number(page) - 1) * limit;

    const condition: any = {
      kind: "bookmark",
      ...(query && { name: { contains: query, mode: "insensitive" as const } }),
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
      success: true,
      bookmarks: data.map((bookmark) => ({
        ...bookmark,
        createdAt: bookmark.createdAt.toISOString(),
      })),
      totalPages: Math.ceil(dataCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("getAllBookmarks error:", error);
    return { success: false, bookmarks: [], totalPages: 0, currentPage: 1 };
  }
}

export async function getBookmarkBySlug(slug: string) {
  try {
    const data = await prisma.product.findFirst({
      where: {
        slug,
        kind: "bookmark",
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
    console.error("getBookmarkBySlug error:", error);
    return null;
  }
}

export async function getBookmarkById(id: string) {
  try {
    const data = await prisma.product.findFirst({
      where: {
        id,
        kind: "bookmark",
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
    console.error("getBookmarkById error:", error);
    return null;
  }
}

export async function createBookmark(data: z.infer<typeof insertBookmarkSchema>) {
  try {
    const bookmark = insertBookmarkSchema.parse(data);
    await prisma.product.create({
      data: {
        ...bookmark,
        kind: "bookmark",
        // fill required book schema fields with null/empty defaults
        author: null,
        language: null,
        pages: null,
        genres: [],
      },
    });
    revalidatePath("/admin/bookmarks");
    revalidatePath("/bookmarks");
    return { success: true, message: "Bookmark created successfully" };
  } catch (error) {
    console.error("createBookmark error:", error);
    return { success: false, message: "Failed to create bookmark" };
  }
}

export async function updateBookmark(data: z.infer<typeof updateBookmarkSchema>) {
  try {
    const bookmark = updateBookmarkSchema.parse(data);
    const bookmarkExist = await prisma.product.findFirst({
      where: { id: bookmark.id, kind: "bookmark" },
    });
    if (!bookmarkExist) {
      return { success: false, message: "Bookmark not found" };
    }
    await prisma.product.update({
      where: { id: bookmark.id },
      data: {
        ...bookmark,
        kind: "bookmark",
      },
    });
    revalidatePath("/admin/bookmarks");
    revalidatePath("/bookmarks");
    revalidatePath(`/bookmark-details/${bookmark.slug}`);
    return { success: true, message: "Bookmark updated successfully" };
  } catch (error) {
    console.error("updateBookmark error:", error);
    return { success: false, message: "Failed to update bookmark" };
  }
}

export async function deleteBookmark(id: string) {
  try {
    const bookmarkExists = await prisma.product.findFirst({
      where: { id, kind: "bookmark" },
    });
    if (!bookmarkExists) {
      return { success: false, message: "Bookmark not found" };
    }
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/bookmarks");
    revalidatePath("/bookmarks");
    return { success: true, message: "Bookmark deleted successfully" };
  } catch (error) {
    console.error("deleteBookmark error:", error);
    return { success: false, message: "Failed to delete bookmark" };
  }
}
