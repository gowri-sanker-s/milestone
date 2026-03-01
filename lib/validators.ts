import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// export const signUpFormSchema = z.object({
//   name: z.string().min(3),
//   email: z.string().email(),
//   password: z.string().min(6),
// });
