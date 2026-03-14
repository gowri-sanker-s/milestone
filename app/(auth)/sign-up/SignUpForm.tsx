"use client";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/user.action";
import { useSearchParams } from "next/navigation";
export const SignUpForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Sign Up"}
      </button>
    );
  };
  return (
    <div>
      {" "}
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input
          id="name"
          name="name"
          // required
          type="text"
          placeholder="Name"
          autoComplete="name"
          defaultValue={signUpDefaultValues.name}
        />
        <input
          id="email"
          name="email"
          // required
          type="text"
          placeholder="Email"
          autoComplete="email"
          defaultValue={signUpDefaultValues.email}
        />
        <input
          id="password"
          name="password"

          type="password"
          autoComplete="password"
          placeholder="Password"
          defaultValue={signUpDefaultValues.password}
        />
        <input
          id="confirmPassword"
          name="confirmPassword"

          type="password"
          autoComplete="confirmPassword"
          placeholder="Confirm Password"
          defaultValue={signUpDefaultValues.confirmPassword}
        />
        <SignUpButton />
        {data && !data.success && <p>{data.message}</p>}
        Already have an account?{" "}
        <Link href="/sign-in" target="_self">
          Sign In
        </Link>
      </form>
    </div>
  );
};
