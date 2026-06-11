import React from "react";
import { Metadata } from "next";
import { getAuthorById } from "@/lib/actions/author.action";
import AuthorForm from "@/components/admin/author-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Update Author - Milestone Books",
};

interface AdminAuthorUpdatePageProps {
  params: Promise<{
    id: string;
  }>;
}

const AdminAuthorUpdatePage = async (props: AdminAuthorUpdatePageProps) => {
  const { id } = await props.params;
  const author = await getAuthorById(id);

  if (!author) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-primary-border/20 rounded-2xl border border-primary-text/10">
        <h2 className="text-xl font-bold text-primary-text mb-4">Author not found</h2>
        <Link
          href="/admin/authors"
          className="flex items-center gap-2 text-sm font-semibold text-primary-text border border-primary-text/20 px-4 py-2 rounded-lg hover:bg-primary-border/20 transition-all"
        >
          <ChevronLeft size={16} />
          Back to Authors List
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/authors"
          className="p-2 border border-primary-text/20 rounded-lg hover:bg-primary-border/20 transition-all text-primary-text"
          aria-label="Back to authors"
        >
          <ChevronLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold">Update Author</h1>
      </div>
      <div className="bg-primary-border/20 p-6 rounded-2xl border border-primary-text/10 shadow-sm">
        <AuthorForm type="Update" author={author} authorId={id} />
      </div>
    </div>
  );
};

export default AdminAuthorUpdatePage;
