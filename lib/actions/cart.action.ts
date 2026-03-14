"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { formatErrors } from "../utils";
import { auth } from "@/auth";
import { prisma } from "../prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "../generated/prisma/client";

// calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    const session = await auth();
    const userId = session?.user?.id;

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    const cart = await getMyCart();

    // ---------- CREATE CART ----------
    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId,
        sessionCartId,
        items: [item],
        ...calcPrice([item]),
      });

      await prisma.cart.create({ data: newCart });

      revalidatePath(`/book-details/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    }

    // ---------- EXISTING CART ----------
    const items = cart.items as CartItem[];
    const existItem = items.find((x) => x.productId === item.productId);

    let message = "added to cart";

    if (existItem) {
      if (existItem.qty + 1 > product.stock) {
        return {
          success: false,
          message: `${product.name} stock is not enough`,
        };
      }

      existItem.qty += 1;
      message = "updated in cart";
    } else {
      if (product.stock < 1) {
        return {
          success: false,
          message: `${product.name} out of stock`,
        };
      }

      items.push(item);
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items,
        ...calcPrice(items),
      },
    });

    revalidatePath(`/book-details/${product.slug}`);

    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    // get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // get user cart
    const cart = await getMyCart();

    if (!cart) throw new Error("Cart not found");

    // check for item
    const item = (cart.items as CartItem[]).find(
      (x) => x.productId === productId,
    );

    if (!item) throw new Error("Item not found");

    // check if only one qty
    if (item.qty === 1) {
      // remove item
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== productId,
      );
    } else {
      // reduce quantity
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
        item.qty - 1;
    }

    // update cart in db
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/book-details/${product.slug}`);

    return {
      success: true,
      message: `${product.name} removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

export async function getMyCart() {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session not found");

    // get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get user cart from db
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });
    if (!cart) return undefined;

    return {
      ...cart,
      items: cart.items as unknown as CartItem[],
    };
  } catch (error) {}
}
