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
      <div className="max-w-md mx-auto">
        <h2 className="font-bold text-2xl mb-6">Update Profile</h2>
        <ProfileUpdateForm />
      </div>
    </SessionProvider>
  );
};

export default Profile;
