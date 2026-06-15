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
import BookmarkForm from "@/components/admin/bookmark-form";
import { deleteBookmark, getAllBookmarks } from "@/lib/actions/bookmark.action";

interface Bookmark {
  id: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  height: number | null;
  width: number | null;
  createdAt: string;
  updatedAt: string;
}

const AdminBookmarksPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const searchText = searchParams.get("query") || "";

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  // Fetch bookmarks reactively on query or page change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getAllBookmarks({
        query: searchText,
        page,
        limit: 10,
      });

      if (res.success) {
        setBookmarks(res.bookmarks as any);
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
    const res = await getAllBookmarks({ query: searchText, page, limit: 10 });
    if (res.success) {
      setBookmarks(res.bookmarks as any);
      setTotalPages(res.totalPages);
    }
  };

  const handleEditSuccess = async () => {
    setEditingBookmark(null);
    const res = await getAllBookmarks({ query: searchText, page, limit: 10 });
    if (res.success) {
      setBookmarks(res.bookmarks as any);
      setTotalPages(res.totalPages);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold text-primary-text">Bookmarks</h1>
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
          Add Bookmark
        </button>
      </div>

      {/* Table displaying all bookmarks */}
      <div className="overflow-x-auto mt-6 rounded-2xl border border-primary-text/30 shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-primary-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Bookmark ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Dimensions
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-text/10">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className={`px-6 py-12 whitespace-nowrap text-sm font-normal text-center ${funnel.className} text-primary-text/50`}
                >
                  Loading bookmarks...
                </td>
              </tr>
            ) : !bookmarks || bookmarks.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className={`px-6 py-12 whitespace-nowrap text-sm font-normal text-center ${funnel.className} text-primary-text/50`}
                >
                  No bookmarks found.
                </td>
              </tr>
            ) : (
              bookmarks.map((bookmark) => (
                <tr
                  key={bookmark.id}
                  className="hover:bg-primary-border/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bookmark.images && bookmark.images[0] ? (
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-primary-text/10 bg-primary-border">
                        <Image
                          src={bookmark.images[0]}
                          alt={bookmark.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-primary-text/10 flex items-center justify-center font-bold text-xs text-primary-text/60">
                        {bookmark.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-text/70">
                    {formatId(bookmark.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-text capitalize">
                    {bookmark.name.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-text">
                    ₹ {bookmark.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text/80">
                    {bookmark.width && bookmark.height
                      ? `${bookmark.width} x ${bookmark.height} cm`
                      : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-text/80">
                    {bookmark.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        onClick={() => setEditingBookmark(bookmark)}
                        className="text-blue-600 text-[13px] flex items-center gap-2 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md transition-colors"
                      >
                        <Eye size={14} strokeWidth={1.7} />
                        Edit
                      </button>
                      <DeleteDialogue id={bookmark.id} action={deleteBookmark} />
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

      {/* CREATE BOOKMARK MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-primary-bg max-w-2xl max-h-[90vh] overflow-y-auto border border-primary-text/20">
          <DialogHeader>
            <DialogTitle>Create Bookmark</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <BookmarkForm
              type="Create"
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT BOOKMARK MODAL */}
      <Dialog
        open={!!editingBookmark}
        onOpenChange={(open) => !open && setEditingBookmark(null)}
      >
        <DialogContent className="bg-primary-bg max-w-2xl max-h-[90vh] overflow-y-auto border border-primary-text/20">
          <DialogHeader>
            <DialogTitle>Update Bookmark</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {editingBookmark && (
              <BookmarkForm
                type="Update"
                bookmark={editingBookmark}
                bookmarkId={editingBookmark.id}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingBookmark(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookmarksPage;
