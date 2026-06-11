"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";
import { insertTestimonialSchema, updateTestimonialSchema } from "../validators";
import { formatErrors } from "../utils";

const PAGE_SIZE = 10;

const defaultTestimonials = [
  {
    name: "Anjali Menon",
    description: "Absolutely loved the collection! The books are handpicked and the quality is top-notch.",
  },
  {
    name: "Rajeev Nair",
    description: "A wonderful experience browsing through their latest arrivals. Highly recommended!",
  },
  {
    name: "Sreelal Krishnan",
    description: "The featured books section is perfect for discovering hidden gems. I found my new favorite here!",
  },
  {
    name: "Shyam Sundar",
    description: "Fast delivery, excellent packaging, and a fantastic selection. Can't ask for more.",
  },
  {
    name: "Nimna Vijay",
    description: "A delightful reading experience. The descriptions helped me choose exactly what I wanted.",
  },
];

// Helper to seed default testimonials if empty
export async function syncDefaultTestimonials() {
  try {
    const count = await prisma.testimonial.count();
    if (count === 0) {
      await prisma.testimonial.createMany({
        data: defaultTestimonials,
      });
      return { success: true, message: "Default testimonials seeded." };
    }
    return { success: true, message: "Testimonials already exist." };
  } catch (error) {
    console.error("syncDefaultTestimonials error:", error);
    return { success: false, message: "Sync failed" };
  }
}

// Get all testimonials (paginated, searchable)
export async function getAllTestimonials({
  query,
  page = 1,
  limit = PAGE_SIZE,
}: {
  query?: string;
  page?: number;
  limit?: number;
}) {
  try {
    // Check if empty and seed defaults
    await syncDefaultTestimonials();

    const skipAmount = (Number(page) - 1) * limit;

    const condition = query
      ? {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const testimonials = await prisma.testimonial.findMany({
      where: condition,
      orderBy: { createdAt: "desc" },
      skip: skipAmount,
      take: limit,
    });

    const totalTestimonials = await prisma.testimonial.count({
      where: condition,
    });

    return {
      success: true,
      testimonials: testimonials.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
      totalPages: Math.ceil(totalTestimonials / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("getAllTestimonials error:", error);
    return {
      success: false,
      testimonials: [],
      totalPages: 0,
      currentPage: 1,
      message: "Failed to fetch testimonials",
    };
  }
}

// Get single testimonial by ID
export async function getTestimonialById(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) return null;

    return {
      ...testimonial,
      createdAt: testimonial.createdAt.toISOString(),
      updatedAt: testimonial.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("getTestimonialById error:", error);
    return null;
  }
}

// Create a testimonial
export async function createTestimonial(data: z.infer<typeof insertTestimonialSchema>) {
  try {
    const parsed = insertTestimonialSchema.parse(data);

    await prisma.testimonial.create({
      data: {
        name: parsed.name.trim(),
        description: parsed.description.trim(),
      },
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return { success: true, message: "Testimonial created successfully." };
  } catch (error) {
    console.error("createTestimonial error:", error);
    return { success: false, message: formatErrors(error) };
  }
}

// Update a testimonial
export async function updateTestimonial(data: z.infer<typeof updateTestimonialSchema>) {
  try {
    const parsed = updateTestimonialSchema.parse(data);

    const exists = await prisma.testimonial.findUnique({
      where: { id: parsed.id },
    });

    if (!exists) {
      return { success: false, message: "Testimonial not found" };
    }

    await prisma.testimonial.update({
      where: { id: parsed.id },
      data: {
        name: parsed.name.trim(),
        description: parsed.description.trim(),
      },
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return { success: true, message: "Testimonial updated successfully." };
  } catch (error) {
    console.error("updateTestimonial error:", error);
    return { success: false, message: formatErrors(error) };
  }
}

// Delete a testimonial
export async function deleteTestimonial(id: string) {
  try {
    const exists = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!exists) {
      return { success: false, message: "Testimonial not found" };
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/");

    return { success: true, message: "Testimonial deleted successfully." };
  } catch (error) {
    console.error("deleteTestimonial error:", error);
    return { success: false, message: formatErrors(error) };
  }
}
