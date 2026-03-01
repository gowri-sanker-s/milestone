import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import { CredentialsSignInForm } from "./CredentialsSignInForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: `Sign In`,
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
      <h1>Sign In</h1>
      <p>Sign in to your account</p>
      <CredentialsSignInForm />
    </div>
  );
};

export default page;
