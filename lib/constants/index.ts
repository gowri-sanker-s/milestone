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
