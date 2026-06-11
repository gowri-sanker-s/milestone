"use client";

import { insertAuthorSchema } from "@/lib/validators";
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
import { createAuthor, updateAuthor } from "@/lib/actions/author.action";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

type AuthorFormValues = z.infer<typeof insertAuthorSchema>;

const authorDefaultValues = {
  name: "",
  bio: "",
  image: "",
};

interface AuthorFormProps {
  type: "Create" | "Update";
  author?: {
    id: string;
    name: string;
    bio: string | null;
    image: string | null;
  };
  authorId?: string;
  onSuccess?: (name: string) => void;
  onCancel?: () => void;
}

const AuthorForm = ({
  type,
  author,
  authorId,
  onSuccess,
  onCancel,
}: AuthorFormProps) => {
  const router = useRouter();

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(insertAuthorSchema) as any,
    defaultValues:
      author && type === "Update"
        ? {
            name: author.name,
            bio: author.bio || "",
            image: author.image || "",
          }
        : authorDefaultValues,
  });

  const onSubmit: SubmitHandler<AuthorFormValues> = async (values) => {
    try {
      if (type === "Create") {
        const res = await createAuthor(values);
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess(values.name);
          } else {
            router.push("/admin/authors");
            router.refresh();
          }
        }
      }
      if (type === "Update") {
        if (!authorId) {
          toast.error("Author ID is required");
          router.push("/admin/authors");
          return;
        }
        const res = await updateAuthor({ ...values, id: authorId });
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess(values.name);
          } else {
            router.push("/admin/authors");
            router.refresh();
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const image = form.watch("image");

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation Errors:", errors);
        })}
        className="space-y-6 "
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Nimna Vijay"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image */}
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Author Image</FormLabel>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 border border-primary-text/20 rounded-xl bg-primary-border/10">
                {image ? (
                  <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-primary-text/20 shrink-0 bg-primary-border">
                    <Image
                      src={image}
                      alt="Author profile preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => form.setValue("image", "")}
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="h-28 w-28 rounded-full bg-primary-text/10 border border-dashed border-primary-text/30 flex items-center justify-center text-primary-text/50 font-medium text-xs text-center shrink-0">
                    No Image
                  </div>
                )}

                <div className="grid gap-2">
                  <span className="text-xs opacity-75">
                    Upload a profile picture for the author. Max size 4MB.
                  </span>
                  <FormControl className="upload-field">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("image", res[0].url);
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

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the author's background, achievements, and literary style..."
                  className="min-h-36 resize-y"
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
            onClick={onCancel ? onCancel : () => router.push("/admin/authors")}
            className="border border-primary-text/20 hover:bg-primary-border/20 text-[15px] px-6 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-primary-text text-primary-bg font-semibold text-[15px] px-6 py-2 rounded-lg disabled:opacity-50 transition-opacity"
          >
            {form.formState.isSubmitting ? "Saving..." : `${type} Author`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AuthorForm;
