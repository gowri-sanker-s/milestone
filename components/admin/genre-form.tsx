"use client";

import { insertGenreSchema } from "@/lib/validators";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import z from "zod";
import { createGenre, updateGenre } from "@/lib/actions/genre.action";

type GenreFormValues = z.infer<typeof insertGenreSchema>;

const genreDefaultValues = {
  name: "",
};

interface GenreFormProps {
  type: "Create" | "Update";
  genre?: {
    id: string;
    name: string;
  };
  genreId?: string;
  onSuccess?: (name: string) => void;
  onCancel?: () => void;
}

const GenreForm = ({ type, genre, genreId, onSuccess, onCancel }: GenreFormProps) => {
  const router = useRouter();

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(insertGenreSchema) as any,
    defaultValues:
      genre && type === "Update"
        ? {
            name: genre.name,
          }
        : genreDefaultValues,
  });

  const onSubmit: SubmitHandler<GenreFormValues> = async (values) => {
    try {
      if (type === "Create") {
        const res = await createGenre(values);
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess(values.name);
          } else {
            router.push("/admin/genres");
            router.refresh();
          }
        }
      }
      if (type === "Update") {
        if (!genreId) {
          toast.error("Genre ID is required");
          router.push("/admin/genres");
          return;
        }
        const res = await updateGenre({ ...values, id: genreId });
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess(values.name);
          } else {
            router.push("/admin/genres");
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
              <FormLabel>Genre Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Science Fiction"
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
            onClick={onCancel ? onCancel : () => router.push("/admin/genres")}
            className="border border-primary-text/20 hover:bg-primary-border/20 text-[15px] px-6 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-primary-text text-primary-bg font-semibold text-[15px] px-6 py-2 rounded-lg disabled:opacity-50 transition-opacity"
          >
            {form.formState.isSubmitting ? "Saving..." : `${type} Genre`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GenreForm;
