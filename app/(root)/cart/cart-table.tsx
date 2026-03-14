"use client";
import { useRouter } from "next/navigation";
import { Cart } from "@/types";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import AddToCart from "@/components/shared/product/add-cart-button";
import { formatCurrency } from "@/lib/utils";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      {!cart || cart.items.length === 0 ? (
        <div>Cart is empty</div>
      ) : (
        <div className="">
          {cart.items.map((item, index) => {
            return (
              <div key={item.productId} className="">
                {item.name}
                <button
                  disabled={isPending}
                  type="button"
                  onClick={() => {
                    startTransition(async () => {
                      const res = await removeItemFromCart(item.productId);

                      if (!res.success) {
                        toast.error(res.message);
                        return;
                      }
                    });
                  }}
                >
                  {isPending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <Minus strokeWidth={1.5} />
                  )}
                </button>
                <span>{item.qty}</span>
                <button
                  disabled={isPending}
                  type="button"
                  onClick={() => {
                    startTransition(async () => {
                      const res = await addItemToCart(item);

                      if (!res.success) {
                        toast.error(res.message);
                        return;
                      }
                    });
                  }}
                >
                  {isPending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <Plus strokeWidth={1.5} />
                  )}
                </button>
                <p>{formatCurrency(item.price)}</p>
              </div>
            );
          })}
          {/* card subtotal */}
          Subtotal {cart.items.reduce((acc, item) => acc + item.qty, 0)}
          {formatCurrency(cart.itemsPrice)}
          {/* proceed to checkout */}
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(() => router.push("/shipping-address"))
            }
          >
            {isPending ? <Loader /> : <ArrowRight />} Proceed to checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartTable;
