import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignUpForm } from "./SignUpForm";
export const metadata: Metadata = {
  title: `Sign Up`,
  description: `${APP_DESCRIPTION}`,
};
const page = async (props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const session = await auth();
  const { callbackUrl } = await props.searchParams;
  if (session) {
    redirect(callbackUrl || "/");
  }
  return (
    <div>
      <h1>Sign Up</h1>
      <p>Sign up to your account</p>
      <SignUpForm />
    </div>
  );
};

export default page;
