"use client";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/user.action";
import { useSearchParams } from "next/navigation";
import { funnel } from "@/lib/fonts";
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
      <button
        type="submit"
        disabled={pending}
        className={` ${funnel.className} bg-primary-text p-3 rounded-full mt-5 w-full text-primary-bg font-semibold`}
      >
        {pending ? "Submitting..." : "Sign Up"}
      </button>
    );
  };
  return (
    <div className="md:max-w-[85%] mx-auto">
      <h2
        className={`${funnel.className} text-[35px] text-left! w-full font-extrabold justify-self-center leading-[1]`}
      >
        Sign Up
      </h2>
      <p className={`${funnel.className} text-left! w-full text-primary-text`}>
        Fill in your Information below to register with us
      </p>
      <form action={action} className="mt-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="fields">
          <label htmlFor="name" className={`${funnel.className} font-medium`}>
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            // required
            type="text"
            placeholder="Name"
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
            className={`bg-primary-bg p-2 rounded-full border-2 border-r border-primary-text/40 block w-full focus-visible:outline-0 ${funnel.className} pl-5`}
          />
        </div>
        <div className="fields mt-4">
          <label htmlFor="email" className={`${funnel.className} font-medium`}>
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            // required
            type="text"
            placeholder="Email"
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
            className={`bg-primary-bg p-2 rounded-full border-2 border-r border-primary-text/40 block w-full focus-visible:outline-0 ${funnel.className} pl-5`}
          />
        </div>
        <div className="fields mt-4">
          <label
            htmlFor="password"
            className={`${funnel.className} font-medium`}
          >
            Password <span className="text-red-600">*</span>
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="password"
            placeholder="Password"
            defaultValue={signUpDefaultValues.password}
            className={`bg-primary-bg p-2 rounded-full border-2 border-r border-primary-text/40 block w-full focus-visible:outline-0 ${funnel.className} pl-5`}
          />
        </div>
        <div className="fields mt-4">
          <label
            htmlFor="confirmPassword"
            className={`${funnel.className} font-medium`}
          >
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="confirmPassword"
            placeholder="Confirm Password"
            defaultValue={signUpDefaultValues.confirmPassword}
            className={`bg-primary-bg p-2 rounded-full border-2 border-r border-primary-text/40 block w-full focus-visible:outline-0 ${funnel.className} pl-5`}
          />
        </div>
        <SignUpButton />
        {data && !data.success && <p>{data.message}</p>}
        <div
          className={`${funnel.className} flex flex-col sm:flex-row justify-center gap-2 items-center my-8 text-[15px]`}
        >
          <p className={` `}> Already have an account? </p>
          <Link href="/sign-in" target="_self" className="font-bold underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};
