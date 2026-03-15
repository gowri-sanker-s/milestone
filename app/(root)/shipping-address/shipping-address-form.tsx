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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        <p className="text-muted-foreground text-sm">
          Please enter the shipping address
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
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
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street Address" {...field} />
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
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
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
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Postal Code" {...field} />
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
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
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
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Latitude"
                      {...field}
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
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Longitude"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
    </div>
  );
};

export default ShippingAddressForm;
