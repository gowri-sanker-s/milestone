"use client";
import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
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
import { updateProfile } from "@/lib/actions/user.action";
import { funnel } from "@/lib/fonts";
const ProfileUpdateForm = () => {
  const { data: session, update } = useSession();
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });
  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(values);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };
    await update(newSession);
    toast.success(res.message);
  };
  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={funnel.className}>Email</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder="Email"
                  {...field}
                  className={`rounded-full py-5! pl-5 border-2 border-primary-text/30 focus-visible:border-primary-text focus-visible:border-2 focus-visible:ring-0 font-medium ${funnel.className}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={funnel.className}>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name"
                  {...field}
                  className={`rounded-full py-5! pl-5 border-2 border-primary-text/30 focus-visible:border-primary-text focus-visible:border-2 focus-visible:ring-0 font-medium ${funnel.className}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="bg-primary-text w-full rounded-full text-primary-bg font-bold"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Updating..." : "Update"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileUpdateForm;
