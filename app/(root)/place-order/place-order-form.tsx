"use client";

import { createOrder } from "@/lib/actions/order.action";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async () => {
    const result = await createOrder();
    if (result.redirect) {
      router.push(result.redirect);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <button type="submit" disabled={pending}>
        {pending ? <Loader /> : <Check />} Place Order
      </button>
    );
  };

  return (
    <form action={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
