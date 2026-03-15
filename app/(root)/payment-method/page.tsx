import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.action";
import PaymentMethodForm from "./payment-method-form";
import CheckoutSteps from "@/components/shared/checkout-steps";

export const metadata: Metadata = {
  title: "Payment Method",
};
const PaymentMethodPage = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("User Not Found");
  const user = await getUserById(session.user.id);
  if (!user) throw new Error("User Not Found");

  return (
    <div>
      <CheckoutSteps current={2} />
      <PaymentMethodForm prefferedMethodType={user.paymentMethod} />
    </div>
  );
};

export default PaymentMethodPage;
