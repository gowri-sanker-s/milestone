import React from "react";
import { Metadata } from "next";
import {
  getAllAuthors,
  syncAuthorsFromProducts,
} from "@/lib/actions/author.action";
import AuthorsTable from "@/components/admin/authors-table";

export const metadata: Metadata = {
  title: "Admin Authors - Milestone Books",
  description: "Manage authors list",
};

interface AuthorsPageProps {
  searchParams: Promise<{ page?: string; query?: string }>;
}

const AdminAuthorsPage = async (props: AuthorsPageProps) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";

  // Auto-sync authors from products to ensure consistency
  await syncAuthorsFromProducts();

  const { authors = [], totalPages = 0 } = await getAllAuthors({
    query: searchText,
    page,
    limit: 10,
  });

  return (
    <div>
      <AuthorsTable
        authors={authors as any}
        totalPages={totalPages}
        currentPage={page}
        initialSearchText={searchText}
      />
    </div>
  );
};

export default AdminAuthorsPage;
