export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Milestone Books";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Ecomerce store build using Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const signInDefaultValues = {
  email: "",
  password: "",
};
export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
  latitude: 0,
  longitude: 0,
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(",").map((x) => x.trim())
  : ["PhonePe"];

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD?.trim() || "PhonePe";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const productDefaultValues = {
  name: "",
  title: "",
  slug: "",
  description: "",
  author: "",
  language: "",
  pages: 0,
  genres: [],
  price: 0,
  stock: 0,
  rating: 0,
  reviewsCount: 0,
  images: [],
  isFeatured: false,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ").map((x) => x.trim())
  : ["user", "admin"];
