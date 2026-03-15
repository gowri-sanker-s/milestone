"use client";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.action";
import { useSearchParams } from "next/navigation";
import { funnel } from "@/lib/fonts";
import google from "@/assets/icons/google.svg";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
export const CredentialsSignInForm = () => {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        disabled={pending}
        className={` ${funnel.className} bg-primary-text p-3 rounded-full mt-5 w-full text-primary-bg font-semibold`}
      >
        {pending ? "Signing In..." : "Sign In"}
      </button>
    );
  };
  return (
    <div className="md:max-w-[85%] mx-auto">
      <h2
        className={`${funnel.className} text-[35px] text-left! w-full font-extrabold justify-self-center leading-[1]`}
      >
        Sign In
      </h2>
      <p className={`${funnel.className} text-left! w-full text-primary-text`}>
        Welcome back! Please enter your details.
      </p>
      <form action={action} className="mt-5">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="field">
          <label htmlFor="email" className={`${funnel.className} font-medium`}>
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            required
            type="email"
            placeholder="Email"
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
            className={`bg-primary-bg p-2 rounded-full border-2 border-r border-primary-text/40 block w-full focus-visible:outline-0 ${funnel.className} pl-5`}
          />
        </div>
        <div className="fied mt-4">
          <label
            htmlFor="password"
            className={`${funnel.className} font-medium`}
          >
            Password <span className="text-red-600">*</span>
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              required
              type={showPassword ? "text" : "password"}
              autoComplete="password"
              placeholder="Password"
              defaultValue={signInDefaultValues.password}
              className={`bg-primary-bg p-2 rounded-full border-2 border-r border-primary-text/40 block w-full focus-visible:outline-0 ${funnel.className} pl-5`}
            />
            {/* toggle eye based on onclick */}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="text-primary-text" strokeWidth={1.5} />
              ) : (
                <Eye className="text-primary-text" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
        <div
          className={`${funnel.className} flex flex-col md:flex-row gap-2 items-center justify-between`}
        >
          <div className="flex gap-2">
            <input type="checkbox" id="remember" name="remember" className="" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <Link href="/forgot-password">Forgot Password?</Link>
        </div>
        <SignInButton />
        {data && !data.success && <p>{data.message}</p>}
        <div className="flex relative min-h-[80px]">
          <div className="absolute top-1/2 left-0 w-full border-t border-primary-text"></div>
          <p
            className={`${funnel.className} text-[14px] font-medium absolute top-1/2 left-1/2 transform -translate-1/2 bg-primary-border sm:px-3`}
          >
            Or Sign in with
          </p>
        </div>
        <button
          type="button"
          disabled
          className="disabled:opacity-70 disabled:cursor-not-allowed w-full bg-white rounded-full p-3 flex gap-3 items-center justify-center"
        >
          <Image height={25} width={25} src={google} alt="Google" />
          <p
            className={`${funnel.className} text-[14px] sm:text-[16px] font-medium`}
          >
            Sign In with Google
          </p>
        </button>

        <div
          className={`${funnel.className} flex flex-col sm:flex-row justify-center gap-2 items-center my-8 text-[15px]`}
        >
          <p className={` `}>Don't have an account?</p>
          <Link href="/sign-up" target="_self" className="font-bold underline">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};
