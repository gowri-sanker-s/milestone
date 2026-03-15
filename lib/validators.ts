import { z } from "zod";

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
