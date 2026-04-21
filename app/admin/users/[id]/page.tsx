import React from "react";
import { Metadata } from "next";
import { getUserById } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import { USER_ROLES } from "@/lib/constants";
import UpdateUserForm from "./update-form";
export const metadata: Metadata = {
  title: "Update User",
};
const AdminUserUpdatePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;
  const user = await getUserById(id);

  if (!user) {
    return <div>User not found</div>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Update User</h1>
      <div className="my-6">
        <UpdateUserForm user={user} />
      </div>
    </div>
  );
};

export default AdminUserUpdatePage;
