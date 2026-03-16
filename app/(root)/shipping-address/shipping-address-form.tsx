"use client";

import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ControllerRenderProps, useForm, SubmitHandler } from "react-hook-form";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { updateUserAddress } from "@/lib/actions/user.action";
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
import { toast } from "sonner";
import { funnel } from "@/lib/fonts";

const ShippingAddressForm = ({ address }: { address?: ShippingAddress }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      ...shippingAddressDefaultValues,
      ...address,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    data: z.infer<typeof shippingAddressSchema>,
  ) => {
    startTransition(async () => {
      const result = await updateUserAddress(data);
      if (!result.success) {
        //    show toast
        toast(result.message);
        return;
      }
      router.push("/payment-method");
    });
  };

  return (
    <div className="mt-10">
      <div>
        <h2
          className={`text-[25px] leading-[1] font-semibold ${funnel.className}`}
        >
          Shipping Address
        </h2>
        <p className="text-muted-foreground text-sm mb-5">
          Please enter the shipping address
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "fullName"
                >;
              }) => (
                <FormItem>
                  <FormLabel className={`${funnel.className} font-semibold`}>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
                      {...field}
                      className="rounded-full py-5! pl-5 border-2 border-primary-text/30 focus-visible:border-primary-text focus-visible:border-2 focus-visible:ring-0 font-medium"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Street Address */}
            <FormField
              control={form.control}
              name="streetAddress"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "streetAddress"
                >;
              }) => (
                <FormItem>
                  <FormLabel className={`${funnel.className} font-semibold`}>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Street Address"
                      {...field}
                      className="rounded-full py-5! pl-5 border-2 border-primary-text/30 focus-visible:border-primary-text focus-visible:border-2 focus-visible:ring-0 font-medium"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "city"
                >;
              }) => (
                <FormItem>
                  <FormLabel className={`${funnel.className} font-semibold`}>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City"
                      {...field}
                      className="rounded-full py-5! pl-5 border-2 border-primary-text/30 focus-visible:border-primary-text focus-visible:border-2 focus-visible:ring-0 font-medium"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Postal Code */}
            <FormField
              control={form.control}
              name="postalCode"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "postalCode"
                >;
              }) => (
                <FormItem>
                  <FormLabel className={`${funnel.className} font-semibold`}>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Postal Code"
                      {...field}
                      className="rounded-full py-5! pl-5 border-2 border-primary-text/30 focus-visible:border-primary-text focus-visible:border-2 focus-visible:ring-0 font-medium"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "country"
                >;
              }) => (
                <FormItem>
                  <FormLabel className={`${funnel.className} font-semibold`}>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Country"
                      {...field}
                      className="rounded-full py-5! pl-5 border-2 border-primary-text/30 focus-visible:border-primary-text focus-visible:border-2 focus-visible:ring-0 font-medium"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Latitude */}
            <FormField
              control={form.control}
              name="latitude"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "latitude"
                >;
              }) => (
                <FormItem>
                  <FormLabel className={`${funnel.className} font-semibold`}>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Latitude"
                      {...field}
                      className="rounded-full py-5! pl-5 border-2 border-primary-text/30 focus-visible:border-primary-text focus-visible:border-2 focus-visible:ring-0 font-medium"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Longitude */}
            <FormField
              control={form.control}
              name="longitude"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "longitude"
                >;
              }) => (
                <FormItem>
                  <FormLabel className={`${funnel.className} font-semibold`}>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Longitude"
                      {...field}
                      className="rounded-full py-5! pl-5 border-2 border-primary-text/30 focus-visible:border-primary-text focus-visible:border-2 focus-visible:ring-0 font-medium"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="flex gap-2 self-end bg-primary-text text-primary-bg font-semibold py-5.5 rounded-full"
            >
              {isPending ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <ArrowRight size={18} />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ShippingAddressForm;
