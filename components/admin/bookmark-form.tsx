"use client";

import { insertBookmarkSchema } from "@/lib/validators";
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
import { Textarea } from "@/components/ui/textarea";
import { createBookmark, updateBookmark } from "@/lib/actions/bookmark.action";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import slugify from "slugify";

type BookmarkFormValues = z.infer<typeof insertBookmarkSchema>;

const bookmarkDefaultValues = {
  name: "",
  title: "",
  slug: "",
  description: "",
  price: 0,
  stock: 0,
  images: [] as string[],
  height: 0,
  width: 0,
  kind: "bookmark" as const,
};

interface BookmarkFormProps {
  type: "Create" | "Update";
  bookmark?: {
    id: string;
    name: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    height: number | null;
    width: number | null;
  };
  bookmarkId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BookmarkForm = ({
  type,
  bookmark,
  bookmarkId,
  onSuccess,
  onCancel,
}: BookmarkFormProps) => {
  const router = useRouter();

  const form = useForm<BookmarkFormValues>({
    resolver: zodResolver(insertBookmarkSchema) as any,
    defaultValues:
      bookmark && type === "Update"
        ? {
            name: bookmark.name,
            title: bookmark.title,
            slug: bookmark.slug,
            description: bookmark.description,
            price: bookmark.price,
            stock: bookmark.stock,
            images: bookmark.images,
            height: bookmark.height || 0,
            width: bookmark.width || 0,
            kind: "bookmark" as const,
          }
        : bookmarkDefaultValues,
  });

  const onSubmit: SubmitHandler<BookmarkFormValues> = async (values) => {
    try {
      if (type === "Create") {
        const res = await createBookmark(values);
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/admin/bookmarks");
            router.refresh();
          }
        }
      }
      if (type === "Update") {
        if (!bookmarkId) {
          toast.error("Bookmark ID is required");
          return;
        }
        const res = await updateBookmark({ ...values, id: bookmarkId });
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/admin/bookmarks");
            router.refresh();
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const images = form.watch("images") || [];
  const mainImage = images[0] || "";

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation Errors:", errors);
        })}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bookmark Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Classic Wooden Bookmark"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Elegant Handcrafted Cedarwood Bookmark"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="classic-wooden-bookmark"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={() => {
                    const generatedSlug = slugify(form.getValues("name"), {
                      lower: true,
                      strict: true,
                    });
                    form.setValue("slug", generatedSlug);
                    toast.success("Slug generated!");
                  }}
                  className="bg-primary-border border border-primary-text/20 text-primary-text hover:bg-primary-border/80 shrink-0 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Generate Slug
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="150" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Height */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="15.2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Width */}
          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" placeholder="4.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Bookmark Image</FormLabel>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 border border-primary-text/20 rounded-xl bg-primary-border/10">
                {mainImage ? (
                  <div className="relative h-28 w-28 rounded-lg overflow-hidden border-2 border-primary-text/20 shrink-0 bg-primary-border">
                    <Image
                      src={mainImage}
                      alt="Bookmark preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => form.setValue("images", [])}
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="h-28 w-28 rounded-lg bg-primary-text/10 border border-dashed border-primary-text/30 flex items-center justify-center text-primary-text/50 font-medium text-xs text-center shrink-0">
                    No Image
                  </div>
                )}

                <div className="grid gap-2">
                  <span className="text-xs opacity-75">
                    Upload a high quality product photo. Max size 4MB.
                  </span>
                  <FormControl className="upload-field">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("images", [res[0].url]);
                        toast.success("Image uploaded successfully!");
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Image Upload Failed: ${error.message}`);
                      }}
                    />
                  </FormControl>
                </div>
              </div>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the material, design, and style of the bookmark..."
                  className="min-h-24 resize-y"
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
            onClick={onCancel ? onCancel : () => router.push("/admin/bookmarks")}
            className="border border-primary-text/20 hover:bg-primary-border/20 text-[15px] px-6 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-primary-text text-primary-bg font-semibold text-[15px] px-6 py-2 rounded-lg disabled:opacity-50 transition-opacity"
          >
            {form.formState.isSubmitting ? "Saving..." : `${type} Bookmark`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookmarkForm;
