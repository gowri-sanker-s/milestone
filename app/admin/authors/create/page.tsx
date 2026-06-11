import React from "react";
import { Metadata } from "next";
import AuthorForm from "@/components/admin/author-form";

export const metadata: Metadata = {
  title: "Create Author - Milestone Books",
  description: "Add a new author profile",
};

const AdminAuthorCreatePage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Author</h1>
      <div className="bg-primary-border/20 p-6 rounded-2xl border border-primary-text/10 shadow-sm">
        <AuthorForm type="Create" />
      </div>
    </div>
  );
};

export default AdminAuthorCreatePage;
