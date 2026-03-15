import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignUpForm } from "./SignUpForm";
import Image from "next/image";
import signUp from "@/assets/images/sign-up.png";

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
      <div className="h-screen w-full grid place-items-center">
        <div className="bg-primary-border p-3 rounded-xl w-[90%] md:w-[80%] mx-auto grid lg:grid-cols-2">
          <div className="lg:block hidden left image-container max-h-[650px] w-full bg-primary-text rounded-xl">
            <Image src={signUp} alt="Sign Up" className="icon" />
          </div>
          <div className="left p-8 ">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
