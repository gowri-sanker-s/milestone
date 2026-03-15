"use client";
import { useRouter } from "next/navigation";
import { Cart } from "@/types";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.action";
import { ArrowRight, Loader, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { funnel } from "@/lib/fonts";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEmpty = !cart || cart.items.length === 0;
  const total = (cart?.itemsPrice ?? 0) + (cart?.shippingPrice ?? 0);
  return (
    <div className=" py-5 px-4">
      <div className="">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 ">
            <ShoppingCart className="w-16 h-16 opacity-30" />
            <p className="text-xl font-medium">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
            {/* ── Left: Items ── */}
            <div className="bg-primary-border border-primary-text/10 border rounded-2xl overflow-hidden shadow-sm">
              {/* Header */}
              <div className="px-6 py-5 border-b border-primary-text/10 flex items-baseline gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Cart
                </h2>
                <span className="text-sm  font-normal">
                  {cart.items.length}{" "}
                  {cart.items.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Column labels */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-widest  border-b border-primary-text/10">
                <span>Product</span>
                <span className="text-center w-28">Quantity</span>
                <span className="text-right w-24">Price</span>
              </div>

              {/* Items */}
              <ul className="divide-y divide-primary-text/10">
                {cart.items.map((item) => (
                  <li
                    key={item.productId}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-4"
                  >
                    {/* Name */}
                    <div className="flex gap-3 items-center">
                      <div className="img-container h-[70px] w-[90px] rounded-xl overflow-clip">
                        <img src={item.image} alt={item.name} className="img" />
                      </div>
                      <p
                        className={`${funnel.className} font-semibold text-[20px] truncate pr-2`}
                      >
                        {item.name}
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 w-28 justify-center">
                      <button
                        disabled={isPending}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId,
                            );
                            if (!res.success) toast.error(res.message);
                          })
                        }
                        className="w-9 h-9 rounded-full border border-primary-text/10 flex items-center justify-center  hover:bg-neutral-100 hover:border-neutral-300 transition disabled:opacity-40"
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Minus className="w-4 h-4" strokeWidth={2} />
                        )}
                      </button>

                      <span className="w-5 text-center text-[15px] font-semibold text-neutral-800">
                        {item.qty}
                      </span>

                      <button
                        disabled={isPending}
                        type="button"
                        onClick={() =>
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.success) toast.error(res.message);
                          })
                        }
                        className="w-9 h-9 rounded-full border border-primary-text/10 flex items-center justify-center  hover:bg-neutral-100 hover:border-neutral-300 transition disabled:opacity-40"
                      >
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" strokeWidth={2} />
                        )}
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-[18px] font-bold text-neutral-900 text-right w-24">
                      {formatCurrency(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Right: Summary ── */}
            <div className="bg-primary-border border-primary-text/10 border rounded-2xl shadow-sm p-6 flex flex-col gap-5 sticky top-6">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">
                Order Summary
              </h3>

              <div className="flex flex-col gap-3 text-sm text-neutral-600">
                <div className="flex justify-between">
                  <span>
                    Items ({cart.items.reduce((acc, item) => acc + item.qty, 0)}
                    )
                  </span>
                  <span className="font-medium text-neutral-800">
                    {formatCurrency(cart.itemsPrice ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    {cart?.shippingPrice}
                  </span>
                </div>
              </div>

              <div className="border-t border-primary-text/10 pt-4 flex justify-between font-bold text-neutral-900 text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
                className="w-full flex items-center justify-center gap-2 bg-primary-text text-white text-sm font-semibold py-3 px-5 rounded-xl transition disabled:opacity-50"
              >
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTable;
