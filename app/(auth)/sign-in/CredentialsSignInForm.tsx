"use client";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.action";
import { useSearchParams } from "next/navigation";
export const CredentialsSignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <button type="submit" disabled={pending}>
        {pending ? "Signing In..." : "Sign In"}
      </button>
    );
  };
  return (
    <div>
      {" "}
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input
          id="email"
          name="email"
          required
          type="email"
          placeholder="Email"
          autoComplete="email"
          defaultValue={signInDefaultValues.email}
        />
        <input
          id="password"
          name="password"
          required
          type="password"
          autoComplete="password"
          placeholder="Password"
          defaultValue={signInDefaultValues.password}
        />
        <SignInButton />
        {data && !data.success && <p>{data.message}</p>}
        Don't have an account?{" "}
        <Link href="/sign-up" target="_self">
          Sign Up
        </Link>
      </form>
    </div>
  );
};
