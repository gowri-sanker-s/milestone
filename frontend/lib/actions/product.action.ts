'use server';

import { prisma } from '@/lib/prisma';

export async function getLatestProducts() {
  try {
    const data = await prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    // ✅ Normalize Prisma output
    return data.map((product) => ({
      ...product,
      price: Number(product.price),          // Decimal → number
      createdAt: product.createdAt.toISOString(), // Date → string
    }));
  } catch (error) {
    console.error('getLatestProducts error:', error);
    return [];
  }
}
