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
    <div>
      <CheckoutSteps current={3} />

      <h2 className="text-2xl font-bold">Place Order</h2>
      {/* shipping address */}
      <div>
        <h3 className="text-xl font-bold">Shipping Address</h3>
        <p>{userAddress.fullName}</p>
        <p>{userAddress.streetAddress}</p>
        <p>{userAddress.city}</p>
        <p>{userAddress.postalCode}</p>
        <p>{userAddress.country}</p>
        {/* edit button redirect to shippin */}
        <Link href="/shipping-address">Edit</Link>
      </div>

      {/* payment method */}
      <div>
        <h3 className="text-xl font-bold">Payment Method</h3>
        <p>{user?.paymentMethod}</p>
        {/* edit button redirect to payment method */}
        <Link href="/payment-method">Edit</Link>
      </div>

      {/* order items */}
      <div>
        <h3 className="text-xl font-bold">Order Items</h3>
        {cart.items.map((item) => (
          <div key={item.productId}>
            <img src={item.image} alt={item.name} className="img" />
            <p>{item.name}</p>
            <p>{item.qty}</p>
            <p>{item.price}</p>
          </div>
        ))}
      </div>

      {/* order summary */}
      {/* display text items price, tax price, shipping price, total price */}
      <div>
        <h3 className="text-xl font-bold">Order Summary</h3>
        <p>Items Price: {formatCurrency(cart.itemsPrice)}</p>
        <p>Tax Price: {formatCurrency(cart.taxPrice)}</p>
        <p>Shipping Price: {formatCurrency(cart.shippingPrice)}</p>
        <p>Total Price: {formatCurrency(cart.totalPrice)}</p>
        <PlaceOrderForm />
      </div>
    </div>
  );
};

export default PlaceOrderPage;
