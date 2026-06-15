"use client";

import { insertComboSchema, updateComboSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { getAllProducts } from "@/lib/actions/product.action";
import { createCombo, updateCombo } from "@/lib/actions/combo.action";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import slugify from "slugify";
import { Search, Check, Layers, BookOpen } from "lucide-react";

type ComboFormValues = z.infer<typeof insertComboSchema>;

const comboDefaultValues = {
  name: "",
  title: "",
  slug: "",
  description: "",
  price: 0,
  stock: 0,
  images: [] as string[],
  bookIds: [] as string[],
  kind: "combo" as const,
  isFeatured: false,
  banner: "",
};

interface ComboFormProps {
  type: "Create" | "Update";
  combo?: {
    id: string;
    name: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    bookIds: string[];
    isFeatured: boolean;
    banner: string | null;
  };
  comboId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ComboForm = ({
  type,
  combo,
  comboId,
  onSuccess,
  onCancel,
}: ComboFormProps) => {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getAllProducts({ kind: "book", limit: 1000 });
        if (res && res.data) {
          setBooks(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
        toast.error("Failed to load books database");
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, []);

  const form = useForm<ComboFormValues>({
    resolver: zodResolver(insertComboSchema) as any,
    defaultValues:
      combo && type === "Update"
        ? {
            name: combo.name,
            title: combo.title,
            slug: combo.slug,
            description: combo.description,
            price: combo.price,
            stock: combo.stock,
            images: combo.images,
            bookIds: combo.bookIds || [],
            kind: "combo" as const,
            isFeatured: combo.isFeatured || false,
            banner: combo.banner || "",
          }
        : comboDefaultValues,
  });

  const onSubmit: SubmitHandler<ComboFormValues> = async (values) => {
    try {
      if (type === "Create") {
        const res = await createCombo(values);
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/admin/combos");
            router.refresh();
          }
        }
      }
      if (type === "Update") {
        if (!comboId) {
          toast.error("Combo ID is required");
          return;
        }
        const res = await updateCombo({ ...values, id: comboId });
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/admin/combos");
            router.refresh();
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const images = form.watch("images") || [];
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");
  const selectedBookIds = form.watch("bookIds") || [];

  const handleToggleBook = (bookId: string) => {
    if (selectedBookIds.includes(bookId)) {
      form.setValue(
        "bookIds",
        selectedBookIds.filter((id) => id !== bookId)
      );
    } else {
      form.setValue("bookIds", [...selectedBookIds, bookId]);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(bookSearchQuery.toLowerCase()) ||
    (book.author && book.author.toLowerCase().includes(bookSearchQuery.toLowerCase()))
  );

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation Errors:", errors);
        })}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Combo Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Malayalam Memoirs Combo"
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
                    placeholder="e.g. Exclusive Collection of Malayalam Biography Copy"
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
                    placeholder="malayalam-memoirs-combo"
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
                <FormLabel>Combo Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="499" {...field} />
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
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Searchable books checklist */}
        <div className="border border-primary-text/20 rounded-xl p-4 bg-primary-border/10">
          <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
            <BookOpen size={16} /> Select Books Included in Combo ({selectedBookIds.length} selected)
          </label>
          <div className="flex items-center border border-primary-text/20 rounded-md bg-primary-bg px-3 py-2 mb-3">
            <Search className="mr-2 h-4 w-4 opacity-50 shrink-0" />
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={bookSearchQuery}
              onChange={(e) => setBookSearchQuery(e.target.value)}
              className="flex h-8 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-primary-text/45"
            />
          </div>

          <div className="max-h-60 overflow-y-auto border border-primary-text/10 rounded-md p-2 bg-primary-bg space-y-1.5 font-normal">
            {loadingBooks ? (
              <div className="text-sm text-center py-4 opacity-50">Loading books list...</div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-sm text-center py-4 opacity-50 italic">No books found</div>
            ) : (
              filteredBooks.map((book) => {
                const isSelected = selectedBookIds.includes(book.id);
                return (
                  <div
                    key={book.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors border ${
                      isSelected
                        ? "bg-primary-border/50 border-primary-text/30"
                        : "hover:bg-primary-border/20 border-transparent"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggleBook(book.id)}
                      id={`book-${book.id}`}
                    />
                    <label
                      htmlFor={`book-${book.id}`}
                      className="flex-1 flex items-center gap-3 cursor-pointer min-w-0"
                    >
                      {book.images?.[0] && (
                        <div className="w-8 h-10 relative rounded-sm overflow-hidden shrink-0 border border-primary-text/10">
                          <img
                            src={book.images[0]}
                            alt={book.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-primary-text">{book.name}</p>
                        {book.author && (
                          <p className="text-xs text-primary-text/60 truncate capitalize font-normal">
                            {book.author.toLowerCase()}
                          </p>
                        )}
                      </div>
                    </label>
                    {isSelected && <Check className="h-4 w-4 text-emerald-600 mr-1 shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
          <FormField
            control={form.control}
            name="bookIds"
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Featured Combo Checkbox */}
        <div className="flex items-center gap-10 border border-primary-text/20 p-4 rounded-xl bg-primary-border/10">
          <div className="flex-1">
            <p className="text-sm font-semibold">Featured Combo Offer</p>
            <p className="text-xs text-primary-text/60">Highlight this combo offer on the main page banner/spotlight.</p>
          </div>
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Banner upload if featured */}
        {isFeatured && (
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem className="border border-primary-text/20 p-4 rounded-xl bg-primary-border/10">
                <FormLabel>Banner Image (for Featured Spotlight)</FormLabel>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
                  {banner ? (
                    <div className="relative h-20 w-40 rounded-lg overflow-hidden border border-primary-text/20 shrink-0 bg-primary-border">
                      <img
                        src={banner}
                        alt="Banner preview"
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => form.setValue("banner", "")}
                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 w-40 rounded-lg bg-primary-text/10 border border-dashed border-primary-text/30 flex items-center justify-center text-primary-text/50 font-medium text-xs text-center shrink-0">
                      No Banner
                    </div>
                  )}

                  <div className="grid gap-2">
                    <span className="text-xs opacity-75">
                      Upload a wide spotlight banner image.
                    </span>
                    <FormControl className="upload-field">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: { url: string }[]) => {
                          form.setValue("banner", res[0].url);
                          toast.success("Banner image uploaded successfully!");
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Banner Upload Failed: ${error.message}`);
                        }}
                      />
                    </FormControl>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Combo Gallery Images */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Combo Gallery Images</FormLabel>
              <div className="border border-primary-text/20 rounded-xl p-4 bg-primary-border/10">
                <div className="flex flex-wrap gap-4 mb-4">
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <div key={index} className="relative h-24 w-20 rounded-md overflow-hidden border border-primary-text/25 bg-primary-border group">
                        <img
                          src={image}
                          alt={`Combo gallery ${index}`}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            form.setValue("images", images.filter((_, idx) => idx !== index));
                          }}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="h-24 w-20 rounded-md bg-primary-text/10 border border-dashed border-primary-text/30 flex items-center justify-center text-primary-text/50 font-medium text-xs text-center shrink-0">
                      No Images
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 font-normal">
                  <span className="text-xs opacity-75">
                    Upload one or more promotional images for the combo. Max size 4MB.
                  </span>
                  <FormControl className="upload-field">
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue("images", [...images, res[0].url]);
                        toast.success("Gallery image added!");
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
                  placeholder="Provide a detailed description of what books are included, the pricing discount savings, etc..."
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
            onClick={onCancel ? onCancel : () => router.push("/admin/combos")}
            className="border border-primary-text/20 hover:bg-primary-border/20 text-[15px] px-6 py-2 rounded-lg font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-primary-text text-primary-bg font-semibold text-[15px] px-6 py-2 rounded-lg disabled:opacity-50 transition-opacity"
          >
            {form.formState.isSubmitting ? "Saving..." : `${type} Combo Offer`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ComboForm;
