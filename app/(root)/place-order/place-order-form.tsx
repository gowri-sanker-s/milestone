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
      <button className="flex items-center gap-3 p-2 w-full bg-primary-text text-primary-bg justify-center rounded-lg mt-5" type="submit" disabled={pending}>
        {pending ? <Loader strokeWidth={1.7} /> : <Check strokeWidth={1.7} />} Place Order
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
