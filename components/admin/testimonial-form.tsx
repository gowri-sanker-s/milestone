"use client";

import { insertTestimonialSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import z from "zod";
import { createTestimonial, updateTestimonial } from "@/lib/actions/testimonial.action";

type TestimonialFormValues = z.infer<typeof insertTestimonialSchema>;

const testimonialDefaultValues = {
  name: "",
  description: "",
};

interface TestimonialFormProps {
  type: "Create" | "Update";
  testimonial?: {
    id: string;
    name: string;
    description: string;
  };
  testimonialId?: string;
  onSuccess?: (name: string) => void;
  onCancel?: () => void;
}

const TestimonialForm = ({
  type,
  testimonial,
  testimonialId,
  onSuccess,
  onCancel,
}: TestimonialFormProps) => {
  const router = useRouter();

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(insertTestimonialSchema) as any,
    defaultValues:
      testimonial && type === "Update"
        ? {
            name: testimonial.name,
            description: testimonial.description,
          }
        : testimonialDefaultValues,
  });

  const onSubmit: SubmitHandler<TestimonialFormValues> = async (values) => {
    try {
      if (type === "Create") {
        const res = await createTestimonial(values);
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess(values.name);
          } else {
            router.push("/admin/testimonials");
            router.refresh();
          }
        }
      }
      if (type === "Update") {
        if (!testimonialId) {
          toast.error("Testimonial ID is required");
          router.push("/admin/testimonials");
          return;
        }
        const res = await updateTestimonial({ ...values, id: testimonialId });
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess(values.name);
          } else {
            router.push("/admin/testimonials");
            router.refresh();
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation Errors:", errors);
        })}
        className="space-y-6"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reader's Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. John Doe"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonial Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What they say about milestone books..."
                  className="min-h-[100px] resize-y"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-end gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel ? onCancel : () => router.push("/admin/testimonials")}
            className="border border-primary-text/20 hover:bg-primary-border/20 text-[15px] px-6 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-primary-text text-primary-bg font-semibold text-[15px] px-6 py-2 rounded-lg disabled:opacity-50 transition-opacity"
          >
            {form.formState.isSubmitting ? "Saving..." : `${type} Testimonial`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TestimonialForm;
