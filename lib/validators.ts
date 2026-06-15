import { z } from "zod";
import { PAYMENT_METHODS } from "./constants";

export const signInFormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be atleast 3 Charachters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be atleast 6 Charachters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be atleast 6 Charachters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 Charachters"),
  title: z.string().min(3, "Title must be atleast 3 Charachters"),
  slug: z.string().min(1, "Slug must be at least 1"),
  description: z.string().min(1, "Description must be at least 1"),
  author: z.string().min(3, "Author must be atleast 3 Charachters"),
  language: z.string().min(3, "Language must be atleast 3 Charachters"),
  pages: z.coerce.number().min(1, "Pages must be at least 1"),
  genres: z.preprocess(
    (val) =>
      typeof val === "string" ? val.split(",").map((s) => s.trim()) : val,
    z.array(z.string()).min(1, "Genres must be atleast 1"),
  ),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  stock: z.coerce.number().min(1, "Stock must be at least 1"),
  rating: z.coerce.number().min(0, "Rating must be at least 0"),
  reviewsCount: z.coerce.number().min(0, "Reviews count must be at least 0"),
  images: z.array(z.string()).min(1, "Image must be at least 1"),
  isFeatured: z.boolean().optional(),
  banner: z.string().optional(),
  kind: z.literal("book").default("book").optional(),
});

// update productschema
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "ID is required"),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name must be at least 1"),
  slug: z.string().min(1, "Slug must be at least 1"),
  qty: z.number().nonnegative("Quantity must be at a positive number"),
  price: z.number().min(1, "Price must be at least 1"),
  image: z.string().min(1, "Image must be at least 1"),
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: z.number().min(0, "Items price must be at least 0"),
  taxPrice: z.number().min(0, "Tax price must be at least 0"),
  shippingPrice: z.number().min(0, "Shipping price must be at least 0"),
  sessionCartId: z.string().min(1, "Session cart ID is required"),
  userId: z.string().optional().nullable(),
  totalPrice: z.number().min(0, "Total price must be at least 0"),
});

// schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name must be atleast 3 Charachters"),
  streetAddress: z.string().min(3, "Address must be atleast 3 Charachters"),
  city: z.string().min(3, "City must be atleast 3 Charachters"),
  postalCode: z.string().min(6, "Postal code must be atleast 6 Charachters"),
  country: z.string().min(3, "Country must be atleast 3 Charachters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  itemsPrice: z.number().min(0, "Items price must be at least 0"),
  taxPrice: z.number().min(0, "Tax price must be at least 0"),
  shippingPrice: z.number().min(0, "Shipping price must be at least 0"),
  totalPrice: z.number().min(0, "Total price must be at least 0"),
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid Payment Method",
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  qty: z.number(),
  name: z.string(),
  slug: z.string(),
  image: z.string(),
  price: z.number(),
});

// schema for updation schema profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must atleast be 3 charachters"),
  email: z.string().min(3, "Invalid email"),
});

// schema for updating user
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required").nullable(),
});

// schemas for author CRUD
export const insertAuthorSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  bio: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const updateAuthorSchema = insertAuthorSchema.extend({
  id: z.string().min(1, "ID is required"),
});

// schemas for genre CRUD
export const insertGenreSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

export const updateGenreSchema = insertGenreSchema.extend({
  id: z.string().min(1, "ID is required"),
});

// schemas for testimonial CRUD
export const insertTestimonialSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const updateTestimonialSchema = insertTestimonialSchema.extend({
  id: z.string().min(1, "ID is required"),
});

// schemas for bookmark CRUD
export const insertBookmarkSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(1, "Slug must be at least 1"),
  description: z.string().min(1, "Description must be at least 1"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
  images: z.array(z.string()).min(1, "Image must be at least 1"),
  height: z.coerce.number().min(0.1, "Height must be positive"),
  width: z.coerce.number().min(0.1, "Width must be positive"),
  kind: z.literal("bookmark").default("bookmark"),
  isFeatured: z.boolean().optional(),
  banner: z.string().optional(),
});

export const updateBookmarkSchema = insertBookmarkSchema.extend({
  id: z.string().min(1, "ID is required"),
});

// schemas for combo CRUD
export const insertComboSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(1, "Slug must be at least 1"),
  description: z.string().min(1, "Description must be at least 1"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  stock: z.coerce.number().min(0, "Stock must be at least 0"),
  images: z.array(z.string()).min(1, "Image must be at least 1"),
  bookIds: z.array(z.string()).default([]),
  kind: z.literal("combo").default("combo"),
  isFeatured: z.boolean().optional(),
  banner: z.string().optional().nullable(),
});

export const updateComboSchema = insertComboSchema.extend({
  id: z.string().min(1, "ID is required"),
});
