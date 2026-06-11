import React from "react";
import { Metadata } from "next";
import { getAllGenres, syncGenresFromProducts } from "@/lib/actions/genre.action";
import GenresTable from "@/components/admin/genres-table";

export const metadata: Metadata = {
  title: "Admin Genres - Milestone Books",
  description: "Manage genres list",
};

interface GenresPageProps {
  searchParams: Promise<{ page?: string; query?: string }>;
}

const AdminGenresPage = async (props: GenresPageProps) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";

  // Auto-sync genres from products to ensure consistency
  await syncGenresFromProducts();

  const { genres = [], totalPages = 0 } = await getAllGenres({
    query: searchText,
    page,
    limit: 10,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-primary-text">Genres</h1>
      <GenresTable
        genres={genres as any}
        totalPages={totalPages}
        currentPage={page}
        initialSearchText={searchText}
      />
    </div>
  );
};

export default AdminGenresPage;
