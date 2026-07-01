"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formatErrors } from "../utils";

// Cron job function to cleanup unpaid PhonePe orders older than 1 hour
export async function cleanupExpiredOrders() {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Find all expired unpaid PhonePe orders
    const expiredOrders = await prisma.order.findMany({
      where: {
        paymentMethod: "PhonePe",
        isPaid: false,
        isCancelled: false,
        createdAt: {
          lt: oneHourAgo,
        },
      },
      include: {
        orderitems: true,
      },
    });

    if (expiredOrders.length === 0) {
      return {
        success: true,
        message: "No expired orders found",
        cancelledCount: 0,
      };
    }

    const cancelledIds: string[] = [];

    // Process each expired order
    for (const order of expiredOrders) {
      await prisma.$transaction(async (tx) => {
        // 1. Mark the order as cancelled
        await tx.order.update({
          where: { id: order.id },
          data: {
            isCancelled: true,
            cancelledAt: new Date(),
          },
        });

        // 2. Revert stock counts for all items in the order
        for (const item of order.orderitems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.qty,
              },
            },
          });
        }
      });

      cancelledIds.push(order.id);

      // Revalidate cache paths for products in this order
      for (const item of order.orderitems) {
        revalidatePath(`/book-details/${item.slug}`);
        revalidatePath(`/bookmark-details/${item.slug}`);
      }
    }

    // Revalidate lists & admin dashboards
    revalidatePath("/admin/orders");
    revalidatePath("/books");
    revalidatePath("/bookmarks");
    revalidatePath("/combos");
    revalidatePath("/");

    console.log(`[Cron Cleanup] Successfully cancelled ${expiredOrders.length} unpaid PhonePe orders:`, cancelledIds);

    return {
      success: true,
      message: `Successfully cancelled ${expiredOrders.length} unpaid PhonePe orders`,
      cancelledCount: expiredOrders.length,
      cancelledIds,
    };
  } catch (error) {
    console.error("[Cron Cleanup] Critical error running cleanup job:", error);
    return {
      success: false,
      message: formatErrors(error),
      cancelledCount: 0,
    };
  }
}
