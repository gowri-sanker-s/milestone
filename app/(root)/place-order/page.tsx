import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { getMyCart } from "@/lib/actions/cart.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderForm from "./place-order-form";
import { funnel } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Place Order",
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();

  if (!session?.user?.id) throw new Error("User Not Found");

  const user = await getUserById(session.user.id);

  if (!cart || cart?.items.length === 0) redirect("/cart");
  if (!user?.address) redirect("/shipping-address");
  if (!user?.paymentMethod) redirect("/payment-method");

  const userAddress = user?.address as ShippingAddress;

  return (
    <div className="wrapper my-10 w-[75%] mx-auto">
      <CheckoutSteps current={3} />

      <div>
        <h2
          className={`text-[25px] leading-[1] font-semibold ${funnel.className}`}
        >
          Place Order
        </h2>
        <p className="text-muted-foreground text-sm mb-5">
          Please review your order and confirm the details.
        </p>
      </div>

      <div className="grid grid-cols-[1.5fr_2fr] items-start gap-4">
        <div className="left">
          {/* shipping address */}
          <div className="border border-primary-text/30 rounded-xl p-5 bg-primary-border">
            <h3 className="text-xl font-bold mb-3">Shipping Address</h3>

            <p className={`${funnel.className} font-semibold capitalize`}>{userAddress.fullName}</p>
            <p className={`${funnel.className} font-semibold capitalize`}>{userAddress.streetAddress}</p>
            <p className={`${funnel.className} font-semibold capitalize`}>{userAddress.city}</p>
            <p className={`${funnel.className} font-semibold capitalize`}>{userAddress.postalCode}</p>
            <p className={`${funnel.className} font-semibold capitalize`}>{userAddress.country}</p>
            {/* edit button redirect to shippin */}
            <Link
              href="/shipping-address"
              className={`mt-5! inline-block rounded-xl border border-primary-text/30 font-semibold min-w-[80px] text-center p-2 px-5 ${funnel.className}`}
            >
              Edit
            </Link>
          </div>

          {/* payment method */}
          <div className="border border-primary-text/30 rounded-xl p-5 mt-5 bg-primary-border">
            <h3 className="text-xl font-bold mb-3">Payment Method</h3>
            <p className={`${funnel.className} font-semibold capitalize`}>{user?.paymentMethod}</p>
            {/* edit button redirect to payment method */}
            <Link
              href="/payment-method"
              className={`mt-5! inline-block rounded-xl border border-primary-text/30 font-semibold min-w-[80px] text-center p-2 px-5 ${funnel.className}`}
            >
              Edit
            </Link>
          </div>
        </div>
        <div className="right self-stretch">
          {/* Order Items */}
          <div className="border border-primary-text/30 rounded-xl p-5 bg-primary-border h-full">
            {/* Header */}
            <div className="px-4 pb-4 sm:pb-5 border-b border-primary-text/10 flex items-baseline gap-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Order Items
              </h3>
              <span className="text-sm font-normal opacity-60">
                {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[355px] overflow-scroll">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-primary-border">
                  <tr className="border-b border-primary-text/10">
                    <th className="text-left px-4 sm:px-6 py-3 text-xs font-semibold uppercase tracking-widest opacity-50">
                      Product
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-widest opacity-50 w-20">
                      Qty
                    </th>
                    <th className="text-right px-4 sm:px-6 py-3 text-xs font-semibold uppercase tracking-widest opacity-50 w-24">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-text/10">
                  {cart.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-[44px] w-[52px] flex-shrink-0 rounded-xl overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span
                            className={`${funnel.className} font-semibold text-[15px]`}
                          >
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-center px-4 py-4 text-[15px]">
                        {item.qty}
                      </td>
                      <td className="text-right px-4 sm:px-6 py-4 text-[15px] font-bold">
                        {formatCurrency(item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* order summary */}
      {/* display text items price, tax price, shipping price, total price */}
      <div className="border border-primary-text/30 rounded-xl p-5 bg-primary-border mt-5">
        <h3 className="text-xl font-bold">Order Summary</h3>
        <p className="flex justify-between items-center py-2">
          Items Price:{" "}
          <span className="font-semibold">
            {formatCurrency(cart.itemsPrice)}
          </span>
        </p>
        <p className="flex justify-between items-center py-2">
          Tax Price:{" "}
          <span className="font-semibold">{formatCurrency(cart.taxPrice)}</span>
        </p>
        <p className="flex justify-between items-center py-2">
          Shipping Price:{" "}
          <span className="font-semibold">
            {formatCurrency(cart.shippingPrice)}
          </span>
        </p>
        <p className="flex justify-between items-center py-2">
          Total Price:{" "}
          <span className="font-semibold">
            {formatCurrency(cart.totalPrice)}
          </span>
        </p>
        <PlaceOrderForm />
      </div>
    </div>
  );
};

export default PlaceOrderPage;
