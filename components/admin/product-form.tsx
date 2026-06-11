"use client";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { ProductType } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import React, { useState, useEffect, useRef } from "react";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { getAuthorsList } from "@/lib/actions/author.action";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AuthorForm from "@/components/admin/author-form";
import { Search, Plus, ChevronsUpDown, Check } from "lucide-react";
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
import { createProduct, updateProduct } from "@/lib/actions/product.action";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
type ProductFormValues = z.infer<typeof insertProductSchema>;

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: ProductType;
  productId?: string;
}) => {
  const router = useRouter();
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [isAuthorDropdownOpen, setIsAuthorDropdownOpen] = useState(false);
  const [authorSearchQuery, setAuthorSearchQuery] = useState("");
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      const res = await getAuthorsList();
      setAuthors(res);
    };
    fetchAuthors();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAuthorDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(insertProductSchema) as any,
    defaultValues:
      product && type === "Update" ? (product as any) : productDefaultValues,
  });

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    console.log("called");

    try {
      if (type === "Create") {
        const res = await createProduct(values);
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          router.push("/admin/products");
        }
      }
      if (type === "Update") {
        if (!productId) {
          toast.error("Product ID is required");
          router.push("/admin/products");
          return;
        }
        const res = await updateProduct({ ...values, id: productId });
        if (!res.success) {
          toast.error(res.message);
          return;
        } else {
          toast.success(res.message);
          router.push("/admin/products");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
    }
  };
  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");
  return (
    <>
      <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation Errors:", errors);
        })}
        className="grid grid-cols-1 md:grid-cols-2 items-start gap-4"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="flex gap-3 items-center">
                  <Input
                    placeholder="Slug"
                    {...field}
                    value={field.value ?? ""}
                  />
                  <Button
                    type="button"
                    className="bg-black text-white font-semibold p-2 px-4 rounded-md"
                    onClick={() => {
                      form.setValue(
                        "slug",
                        slugify(form.getValues("name"), {
                          lower: true,
                          strict: true,
                        }),
                      );
                    }}
                  >
                    Generate Slug
                  </Button>
                </div>
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
            <FormItem className="lg:col-span-2">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Title"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price  */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Price"
                  {...field}
                  value={field.value ?? ""}
                />
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
                <Input
                  type="number"
                  placeholder="Stock"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Author */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => {
            const filteredAuthors = authors.filter((author) =>
              author.name.toLowerCase().includes(authorSearchQuery.toLowerCase())
            );

            return (
              <FormItem className="relative flex flex-col">
                <FormLabel>Author</FormLabel>
                <div ref={dropdownRef} className="relative w-full">
                  <FormControl>
                    <button
                      type="button"
                      onClick={() => setIsAuthorDropdownOpen(!isAuthorDropdownOpen)}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-primary-text/20 bg-background px-3 py-2 text-sm text-left focus:outline-none focus:border-primary-text transition-colors"
                    >
                      {field.value ? (
                        <span className="capitalize">{field.value.toLowerCase()}</span>
                      ) : (
                        <span className="text-primary-text/45">Select author...</span>
                      )}
                      <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
                    </button>
                  </FormControl>

                  {isAuthorDropdownOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border border-primary-text/20 bg-primary-bg shadow-lg flex flex-col">
                      <div className="flex items-center border-b border-primary-text/10 px-3 py-2">
                        <Search className="mr-2 h-4 w-4 opacity-50 shrink-0" />
                        <input
                          type="text"
                          placeholder="Search author..."
                          value={authorSearchQuery}
                          onChange={(e) => setAuthorSearchQuery(e.target.value)}
                          className="flex h-8 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-primary-text/45"
                        />
                      </div>
                      
                      <div className="overflow-y-auto flex-1 py-1 max-h-40">
                        {filteredAuthors.length === 0 ? (
                          <div className="relative flex select-none items-center px-4 py-2 text-sm text-primary-text/50 italic">
                            No authors found
                          </div>
                        ) : (
                          filteredAuthors.map((author) => (
                            <button
                              key={author.id}
                              type="button"
                              onClick={() => {
                                field.onChange(author.name);
                                setIsAuthorDropdownOpen(false);
                                setAuthorSearchQuery("");
                              }}
                              className="relative flex w-full select-none items-center justify-between rounded-sm px-4 py-2 text-sm hover:bg-primary-border/60 text-left capitalize transition-colors"
                            >
                              <span>{author.name.toLowerCase()}</span>
                              {field.value?.toLowerCase() === author.name.toLowerCase() && (
                                <Check className="h-4 w-4 text-primary-text" />
                              )}
                            </button>
                          ))
                        )}
                      </div>

                      <div className="border-t border-primary-text/10 pt-1 pb-1 bg-primary-border/20">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAuthorDropdownOpen(false);
                            setShowAddAuthorModal(true);
                          }}
                          className="relative flex w-full select-none items-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold text-primary-text hover:bg-primary-border/60 text-left transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add New Author...
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {/* Language */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input
                  placeholder="Language"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Pages */}
        <FormField
          control={form.control}
          name="pages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pages</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Page"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Genres */}
        <FormField
          control={form.control}
          name="genres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genres (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Genre1, Genre2"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Images */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Images</FormLabel>
              <div className="border border-primary-text/20 min-h-28 rounded-md">
                <div className="flex gap-5">
                  {images?.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt="Product Image"
                      width={100}
                      height={100}
                      className="w-20 h-20 object-cover object-center rounded-sm"
                    />
                  ))}
                </div>
                <FormControl className="upload-field">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue("images", [...images, res[0].url]);
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Image Upload Failed: ${error}`);
                    }}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* is featured */}
        <div className="flex items-center gap-10">
          <p>Featured Product</p>
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Is Featured</FormLabel> */}

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
        {/* Banner */}
        {isFeatured && banner && (
          <Image
            src={banner}
            alt="Banner"
            width={100}
            height={100}
            className="w-20 h-20 object-cover object-center rounded-sm"
          />
        )}
        {isFeatured && !banner && (
          <FormField
            control={form.control}
            name="banner"
            render={() => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Banner</FormLabel>
                <FormControl className="upload-field border border-primary-text/20 min-h-28 rounded-md">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue("banner", res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(`Banner Image Upload Failed: ${error}`);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid gap-4 items-start">{/* Genres */}</div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl className="min-h-48">
                <Textarea
                  placeholder="Description"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="lg:col-span-2 bg-primary-text text-primary-bg font-semibold text-[15px] disabled:opacity-50"
        >
          {form.formState.isSubmitting ? "Saving..." : `${type} Product`}
        </Button>
      </form>
    </Form>
      <Dialog open={showAddAuthorModal} onOpenChange={setShowAddAuthorModal}>
        <DialogContent className="bg-primary-bg max-w-2xl max-h-[90vh] overflow-y-auto border border-primary-text/20">
          <DialogHeader>
            <DialogTitle>Add New Author</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <AuthorForm
              type="Create"
              onSuccess={async (newAuthorName) => {
                setShowAddAuthorModal(false);
                const res = await getAuthorsList();
                setAuthors(res);
                form.setValue("author", newAuthorName);
                toast.success(`Author "${newAuthorName}" added and selected.`);
              }}
              onCancel={() => setShowAddAuthorModal(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductForm;
