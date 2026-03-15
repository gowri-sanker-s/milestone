"use client";

import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { ArrowRight, Loader } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/lib/actions/user.action";
const PaymentMethodForm = ({
  prefferedMethodType,
}: {
  prefferedMethodType: string | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: prefferedMethodType || DEFAULT_PAYMENT_METHOD,
    },
  });

  const onSubmit = (values: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const result = await updateUserPaymentMethod(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      router.push("/place-order");
    });
  };
  return (
    <div>
      <>
        {/* form similar to shipping-address */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="">
              <FormField
                control={form.control}
                name="type"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof paymentMethodSchema>,
                    "type"
                  >;
                }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {PAYMENT_METHODS.map((paymentMethod) => (
                          <FormItem
                            key={paymentMethod}
                            className="flex items-center gap-3"
                          >
                            <RadioGroupItem value={paymentMethod} />
                            <FormLabel>{paymentMethod}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="flex gap-2">
              {isPending ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <ArrowRight size={18} />
              )}
              Continue
            </Button>
          </form>
        </Form>
      </>
    </div>
  );
};

export default PaymentMethodForm;
