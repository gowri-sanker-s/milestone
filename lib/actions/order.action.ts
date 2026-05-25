"use server";

import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.action";
import { prisma } from "../../lib/prisma";
import { insertOrderSchema } from "../validators";
import { CartItem } from "@/types";
import { formatErrors } from "../utils";
import { createPhonePePayment, checkPhonePeStatus } from "./phonepe.action";
import { PAGE_SIZE, SERVER_URL } from "../constants";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";

type SalesDataType = {
  month: string;
  totalSales: number;
}[];
// create order and create order items
export const createOrder = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User Not Authenticated");

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User Not Found");

    const user = await getUserById(userId);
    if (!user) throw new Error("User Not Found");

    if (!cart || cart?.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
        redirect: "/cart",
      };
    }
    if (!user.address) {
      return {
        success: false,
        message: "Address not found",
        redirect: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "Payment method not found",
        redirect: "/payment-method",
      };
    }
    // create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
      isPaid: false,
      isDelivered: false,
    });

    // create a transaction to create an order and order item in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({
        data: order,
      });
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      //   clear cart
      await tx.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: [],
          totalPrice: 0,
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
        },
      });

      return insertedOrder.id;
    });
    if (!insertedOrderId) throw new Error("Order Not Created");

    if (user.paymentMethod === "PhonePe") {
      try {
        const phonePeRedirectUrl = await createPhonePePayment(
          insertedOrderId,
          cart.totalPrice,
          `${SERVER_URL}/order/${insertedOrderId}`,
        );
        return {
          success: true,
          message: "Redirecting to PhonePe...",
          redirect: phonePeRedirectUrl,
        };
      } catch (error) {
        console.error("PhonePe Initiation Error", error);
        return {
          success: true,
          message:
            "Order created, but failed to initiate PhonePe payment. Redirecting to order details...",
          redirect: `/order/${insertedOrderId}`,
        };
      }
    }

    return {
      success: true,
      message: "Order created successfully",
      redirect: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatErrors(error),
    };
  }
};

// get orderbyId
export const getOrderById = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: { id },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true, id: true } },
    },
  });

  return order;
};

// verify order payment status
export const verifyOrderPayment = async (orderId: string) => {
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Order not found");

  if (order.isPaid) return { success: true };

  if (order.paymentMethod === "PhonePe") {
    const isPaid = await checkPhonePeStatus(order.id);
    if (isPaid) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
      });
      return { success: true, message: "Payment verified successfully" };
    } else {
      return { success: false, message: "Payment not completed" };
    }
  }

  return { success: false, message: "Payment verification not applicable" };
};

// get users orders
export const getMyOrders = async ({
  limit = PAGE_SIZE,
  page = 1,
}: {
  limit?: number;
  page?: number;
}) => {
  const session = await auth();
  if (!session) throw new Error("User Not Authenticated");

  const userId = session.user?.id;
  if (!userId) throw new Error("User Not Found");

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderitems: true,
    },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: "desc" },
  });

  const dataCount = await prisma.order.count({
    where: { userId },
  });

  return { orders, totalPages: Math.ceil(dataCount / limit) };
};

// get sales data and order summary
export const getOrderSummary = async () => {
  // get count for each resource
  const orderCount = await prisma.order.count();
  const deliveredOrderCount = await prisma.order.count({
    where: { isDelivered: true },
  });
  const pendingOrderCount = await prisma.order.count({
    where: { isDelivered: false },
  });
  const productsCount = await prisma.product.count();
  const userCount = await prisma.user.count();

  // calc total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: { isPaid: true },
  });

  const monthlySalesRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Number }>
  >` SELECT 
    to_char("createdAt", 'MM/YY') AS "month",
    sum("totalPrice") AS "totalSales"
  FROM "Order"
  WHERE "isPaid" = true
  GROUP BY to_char("createdAt", 'MM/YY')
  ORDER BY to_char("createdAt", 'MM/YY')  `;

  const monthlySales: SalesDataType = monthlySalesRaw.map((sale) => ({
    month: sale.month,
    totalSales: Number(sale.totalSales),
  }));

  // get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true, id: true } },
    },
    where: { isPaid: true },
    take: 6,
  });

  return {
    orderCount,
    deliveredOrderCount,
    pendingOrderCount,
    productsCount,
    userCount,
    totalSales,
    monthlySales,
    latestSales,
  };
};

// get all orders
export const getAllOrders = async ({
  limit = PAGE_SIZE,
  page = 1,
  query,
}: {
  limit?: number;
  page?: number;
  query?: string;
}) => {
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== "all"
      ? {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            } as Prisma.StringFilter,
          },
        }
      : {};
  const orders = await prisma.order.findMany({
    where: { ...queryFilter },
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
    },
  });

  const dataCount = await prisma.order.count();

  return { orders, totalPages: Math.ceil(dataCount / limit) };
};

// delete order
export const deleteOrder = async (id: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id },
    });
    if (!order) throw new Error("Order not found");
    await prisma.order.delete({
      where: { id },
    });
    revalidatePath("/admin/orders");
    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

// update COD order to paid
export const updateCODOrderToPaid = async (id: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id },
    });
    if (!order) throw new Error("Order not found");
    if (order.isPaid)
      return { success: false, message: "Order is already paid" };
    await prisma.order.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });
    revalidatePath(`/order/${id}`);
    return { success: true, message: "Order marked as paid" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

// update COD order to delivered
export const updateCODOrderToDelivered = async (id: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id },
    });
    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid");
    if (order.isDelivered)
      return { success: false, message: "Order is already delivered" };
    await prisma.order.update({
      where: { id },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });
    revalidatePath(`/order/${id}`);
    return { success: true, message: "Order marked as delivered" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};
