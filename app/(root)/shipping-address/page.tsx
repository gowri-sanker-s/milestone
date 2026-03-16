import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.action";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import { getUserById } from "@/lib/actions/user.action";
import ShippingAddressForm from "./shipping-address-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("No User ID");
  }

  const user = await getUserById(session.user.id);
  if (!user) {
    throw new Error("No User");
  }

  return (
    <div className="wrapper my-10 w-[75%] mx-auto">
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </div>
  );
};

export default ShippingAddressPage;
