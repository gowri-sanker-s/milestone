"use server";

import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  paymentMethodSchema,
  updateProfileSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync, compareSync } from "bcrypt-ts-edge";
import { mergeOpenCart } from "./cart.action";
import { prisma } from "../../lib/prisma";
import { formatErrors } from "../utils";
import { ShippingAddress } from "@/types";
import z from "zod";

// sign in with user credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const callbackUrl = formData.get("callbackUrl")?.toString() || "/";

    const existingUser = await prisma.user.findFirst({
      where: { email: user.email },
    });

    if (existingUser && existingUser.password) {
      const isMatch = compareSync(user.password, existingUser.password);
      if (isMatch) {
        await mergeOpenCart(existingUser.id);
      }
    }

    await signIn("credentials", { ...user, redirectTo: callbackUrl });

    return {
      success: true,
      message: "User signed in successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Invalid credentials",
    };
  }
}

// sign out
export async function signOutUser() {
  await signOut({ redirectTo: "/" });
  //   try {
  //     return {
  //       success: true,
  //       message: "User signed out successfully",
  //     };
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: "Failed to sign out",
  //     };
  //   }
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    await mergeOpenCart(createdUser.id);
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });
    return {
      success: true,
      message: "User signed up successfully",
    };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

// get user buy id
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    return null;
  }
}

// update user address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No User ID");
    const user = await getUserById(session.user.id);
    if (!user) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        address,
      },
    });
    return {
      success: true,
      message: "User address updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

// update user payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No User ID");
    const user = await getUserById(session.user.id);
    if (!user) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });
    return {
      success: true,
      message: "User payment method updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}

// update user profile
export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No User ID");
    const user = await getUserById(session.user.id);
    if (!user) throw new Error("User not found");

    const updatedUser = updateProfileSchema.parse(data);
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: updatedUser.name,
        // email: updatedUser.email,
      },
    });
    return {
      success: true,
      message: "User profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}
