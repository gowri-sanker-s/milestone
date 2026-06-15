"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { insertComboSchema, updateComboSchema } from "../validators";

export async function getAllCombos({
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
      kind: "combo",
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
      combos: data.map((combo) => ({
        ...combo,
        price: Number(combo.price),
        createdAt: combo.createdAt.toISOString(),
      })),
      totalPages: Math.ceil(dataCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("getAllCombos error:", error);
    return { success: false, combos: [], totalPages: 0, currentPage: 1 };
  }
}

export async function getComboBySlug(slug: string) {
  try {
    const data = await prisma.product.findFirst({
      where: {
        slug,
        kind: "combo",
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
    console.error("getComboBySlug error:", error);
    return null;
  }
}

export async function getComboById(id: string) {
  try {
    const data = await prisma.product.findFirst({
      where: {
        id,
        kind: "combo",
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
    console.error("getComboById error:", error);
    return null;
  }
}

export async function createCombo(data: z.infer<typeof insertComboSchema>) {
  try {
    const combo = insertComboSchema.parse(data);
    await prisma.product.create({
      data: {
        ...combo,
        kind: "combo",
        author: null,
        language: null,
        pages: null,
        genres: [],
      },
    });
    revalidatePath("/admin/combos");
    revalidatePath("/books");
    return { success: true, message: "Combo offer created successfully" };
  } catch (error) {
    console.error("createCombo error:", error);
    return { success: false, message: "Failed to create combo offer" };
  }
}

export async function updateCombo(data: z.infer<typeof updateComboSchema>) {
  try {
    const combo = updateComboSchema.parse(data);
    const comboExist = await prisma.product.findFirst({
      where: { id: combo.id, kind: "combo" },
    });
    if (!comboExist) {
      return { success: false, message: "Combo offer not found" };
    }
    await prisma.product.update({
      where: { id: combo.id },
      data: {
        ...combo,
        kind: "combo",
      },
    });
    revalidatePath("/admin/combos");
    revalidatePath("/books");
    revalidatePath(`/book-details/${combo.slug}`);
    return { success: true, message: "Combo offer updated successfully" };
  } catch (error) {
    console.error("updateCombo error:", error);
    return { success: false, message: "Failed to update combo offer" };
  }
}

export async function deleteCombo(id: string) {
  try {
    const comboExists = await prisma.product.findFirst({
      where: { id, kind: "combo" },
    });
    if (!comboExists) {
      return { success: false, message: "Combo offer not found" };
    }
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/combos");
    revalidatePath("/books");
    return { success: true, message: "Combo offer deleted successfully" };
  } catch (error) {
    console.error("deleteCombo error:", error);
    return { success: false, message: "Failed to delete combo offer" };
  }
}
