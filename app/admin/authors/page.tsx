"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Eye, Plus } from "lucide-react";
import { formatId } from "@/lib/utils";
import { funnel } from "@/lib/fonts";
import DeleteDialogue from "@/components/shared/delete-dialogue";
import Pagination from "@/components/shared/Pagination";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuthorForm from "@/components/admin/author-form";
import { deleteAuthor, getAllAuthors, syncAuthorsFromProducts } from "@/lib/actions/author.action";

interface Author {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

const AdminAuthorsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const searchText = searchParams.get("query") || "";

  const [authors, setAuthors] = useState<Author[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  // Fetch authors reactively on query or page change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Ensure local db is synced from products
      await syncAuthorsFromProducts();
      const res = await getAllAuthors({
        query: searchText,
        page,
        limit: 10,
      });

      if (res.success) {
        setAuthors(res.authors as any);
        setTotalPages(res.totalPages);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [searchText, page]);

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCreateSuccess = async () => {
    setIsCreateOpen(false);
    // Refetch data
    const res = await getAllAuthors({ query: searchText, page, limit: 10 });
    if (res.success) {
      setAuthors(res.authors as any);
      setTotalPages(res.totalPages);
    }
  };

  const handleEditSuccess = async () => {
    setEditingAuthor(null);
    // Refetch data
    const res = await getAllAuthors({ query: searchText, page, limit: 10 });
    if (res.success) {
      setAuthors(res.authors as any);
      setTotalPages(res.totalPages);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold text-primary-text">Authors</h1>
          {searchText && (
            <>
              <p className="text-md text-primary-text/70">
                <sub>Showing results for "{searchText}"</sub>
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
          Add Author
        </button>
      </div>

      {/* Table displaying all authors */}
      <div className="overflow-x-auto mt-6 rounded-2xl border border-primary-text/30 shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-primary-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Author ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Biography
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-text/10">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className={`px-6 py-12 whitespace-nowrap text-sm font-normal text-center ${funnel.className} text-primary-text/50`}
                >
                  Loading authors...
                </td>
              </tr>
            ) : !authors || authors.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className={`px-6 py-12 whitespace-nowrap text-sm font-normal text-center ${funnel.className} text-primary-text/50`}
                >
                  No authors found.
                </td>
              </tr>
            ) : (
              authors.map((author) => (
                <tr
                  key={author.id}
                  className="hover:bg-primary-border/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {author.image ? (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-primary-text/10 bg-primary-border">
                        <Image
                          src={author.image}
                          alt={author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-text/10 flex items-center justify-center font-bold text-xs text-primary-text/60">
                        {author.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-text/70">
                    {formatId(author.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-text capitalize">
                    {author.name.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-text/80 max-w-md truncate">
                    {author.bio || (
                      <span className="italic text-primary-text/40">
                        No biography provided.
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => setEditingAuthor(author)}
                        className="text-blue-600 text-[13px] flex items-center gap-2 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md transition-colors"
                      >
                        <Eye size={14} strokeWidth={1.7} />
                        Edit
                      </button>
                      <DeleteDialogue id={author.id} action={deleteAuthor} />
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
            page={page}
            totalPages={totalPages}
            urlParamName="page"
          />
        </div>
      )}

      {/* CREATE AUTHOR MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-primary-bg max-w-2xl max-h-[90vh] overflow-y-auto border border-primary-text/20">
          <DialogHeader>
            <DialogTitle>Create Author</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <AuthorForm
              type="Create"
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT AUTHOR MODAL */}
      <Dialog
        open={!!editingAuthor}
        onOpenChange={(open) => !open && setEditingAuthor(null)}
      >
        <DialogContent className="bg-primary-bg max-w-2xl max-h-[90vh] overflow-y-auto border border-primary-text/20">
          <DialogHeader>
            <DialogTitle>Update Author</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {editingAuthor && (
              <AuthorForm
                type="Update"
                author={editingAuthor}
                authorId={editingAuthor.id}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingAuthor(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAuthorsPage;
