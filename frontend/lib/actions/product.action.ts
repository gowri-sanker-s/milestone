'use server';

import { prisma } from '@/lib/prisma';

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
        createdAt: 'desc',
      },
    });

    return data.map((product) => ({
      ...product,
      price: Number(product.price),
      createdAt: product.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('getFeaturedProducts error:', error);
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
        console.error('getProductBySlug error:', error);
        return null;
    }
}
