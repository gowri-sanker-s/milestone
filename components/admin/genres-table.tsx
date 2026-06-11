"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Eye, Plus } from "lucide-react";
import { formatId } from "@/lib/utils";
import { funnel } from "@/lib/fonts";
import DeleteDialogue from "@/components/shared/delete-dialogue";
import Pagination from "@/components/shared/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GenreForm from "@/components/admin/genre-form";
import { deleteGenre } from "@/lib/actions/genre.action";

interface Genre {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface GenresTableProps {
  genres: Genre[];
  totalPages: number;
  currentPage: number;
  initialSearchText: string;
}

const GenresTable = ({
  genres,
  totalPages,
  currentPage,
  initialSearchText,
}: GenresTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    router.refresh();
  };

  const handleEditSuccess = () => {
    setEditingGenre(null);
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold  text-primary-text">Genres</h1>

          {initialSearchText && (
            <>
              <p className="text-md text-primary-text/70">
                <sub>Showing results for "{initialSearchText}"</sub>
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs border border-primary-text/30 p-1 px-2 rounded-full hover:bg-primary-border/20 transition"
              >
                Clear Filters
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary-text text-primary-bg font-semibold text-[15px] p-2 px-4 rounded-md flex gap-2 items-center hover:opacity-90 transition"
        >
          <Plus size={14} strokeWidth={1.5} />
          Add Genre
        </button>
      </div>

      {/* Table displaying all genres */}
      <div className="overflow-x-auto mt-6 rounded-2xl border border-primary-text/30 shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-primary-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Genre ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-text/10">
            {!genres || genres.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className={`px-6 py-12 whitespace-nowrap text-sm font-normal text-center ${funnel.className} text-primary-text/50`}
                >
                  No genres found.
                </td>
              </tr>
            ) : (
              genres.map((g) => (
                <tr
                  key={g.id}
                  className="hover:bg-primary-border/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-text/70">
                    {formatId(g.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-text capitalize">
                    {g.name.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setEditingGenre(g)}
                        className="text-blue-600 text-[13px] flex items-center gap-2 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md transition-colors"
                      >
                        <Eye size={14} strokeWidth={1.7} />
                        Edit
                      </button>
                      <DeleteDialogue id={g.id} action={deleteGenre} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            urlParamName="page"
          />
        </div>
      )}

      {/* CREATE GENRE MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-primary-bg max-w-xl border border-primary-text/20">
          <DialogHeader>
            <DialogTitle>Create Genre</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <GenreForm
              type="Create"
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT GENRE MODAL */}
      <Dialog
        open={!!editingGenre}
        onOpenChange={(open) => !open && setEditingGenre(null)}
      >
        <DialogContent className="bg-primary-bg max-w-xl border border-primary-text/20">
          <DialogHeader>
            <DialogTitle>Update Genre</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {editingGenre && (
              <GenreForm
                type="Update"
                genre={editingGenre}
                genreId={editingGenre.id}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingGenre(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenresTable;
