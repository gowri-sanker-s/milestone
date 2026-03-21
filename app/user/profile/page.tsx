import React from "react";
import ProfileUpdateForm from "./profile-update-form";
import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Profile",
};
const Profile = async () => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <ProfileUpdateForm />
    </SessionProvider>
  );
};

export default Profile;
