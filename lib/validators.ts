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
