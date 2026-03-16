"use server";

import { auth } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.action";
import { prisma } from "../../lib/prisma";
import { insertOrderSchema } from "../validators";
import { CartItem } from "@/types";
import { formatErrors } from "../utils";

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

  if (!order) {
    throw new Error("Order Not Found");
  }

  return order;
};
