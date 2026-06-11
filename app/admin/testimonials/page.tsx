"use client";

import React, { useState, useEffect } from "react";
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
import TestimonialForm from "@/components/admin/testimonial-form";
import { deleteTestimonial, getAllTestimonials } from "@/lib/actions/testimonial.action";

interface Testimonial {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const AdminTestimonialsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const searchText = searchParams.get("query") || "";

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Fetch testimonials reactively on query or page change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await getAllTestimonials({
        query: searchText,
        page,
        limit: 10,
      });

      if (res.success) {
        setTestimonials(res.testimonials as any);
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
    const res = await getAllTestimonials({ query: searchText, page, limit: 10 });
    if (res.success) {
      setTestimonials(res.testimonials as any);
      setTotalPages(res.totalPages);
    }
  };

  const handleEditSuccess = async () => {
    setEditingTestimonial(null);
    // Refetch data
    const res = await getAllTestimonials({ query: searchText, page, limit: 10 });
    if (res.success) {
      setTestimonials(res.testimonials as any);
      setTotalPages(res.totalPages);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold text-primary-text">Testimonials</h1>
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
          Add Testimonial
        </button>
      </div>

      {/* Table displaying all testimonials */}
      <div className="max-w-full overflow-x-auto mt-6 rounded-2xl border border-primary-text/30 shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-primary-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-[15%]">
                ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-[20%]">
                Reader's Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider w-[45%]">
                Message
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider w-[20%]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-text/10">
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className={`px-6 py-12 whitespace-nowrap text-sm font-normal text-center ${funnel.className} text-primary-text/50`}
                >
                  Loading testimonials...
                </td>
              </tr>
            ) : !testimonials || testimonials.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className={`px-6 py-12 whitespace-nowrap text-sm font-normal text-center ${funnel.className} text-primary-text/50`}
                >
                  No testimonials found.
                </td>
              </tr>
            ) : (
              testimonials.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-primary-border/10 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-text/70">
                    {formatId(t.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-text">
                    {t.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-primary-text/80 break-words max-w-[300px]">
                    {t.description.length > 100
                      ? `${t.description.substring(0, 100)}...`
                      : t.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-center">
                    <div className="flex gap-2 items-center justify-center">
                      <button
                        onClick={() => setEditingTestimonial(t)}
                        className="text-blue-600 text-[13px] flex items-center gap-2 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md transition-colors"
                      >
                        <Eye size={14} strokeWidth={1.7} />
                        Edit
                      </button>
                      <DeleteDialogue id={t.id} action={deleteTestimonial} />
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

      {/* CREATE TESTIMONIAL MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-primary-bg max-w-xl border border-primary-text/20">
          <DialogHeader>
            <DialogTitle>Create Testimonial</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <TestimonialForm
              type="Create"
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT TESTIMONIAL MODAL */}
      <Dialog
        open={!!editingTestimonial}
        onOpenChange={(open) => !open && setEditingTestimonial(null)}
      >
        <DialogContent className="bg-primary-bg max-w-xl border border-primary-text/20">
          <DialogHeader>
            <DialogTitle>Update Testimonial</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            {editingTestimonial && (
              <TestimonialForm
                type="Update"
                testimonial={editingTestimonial}
                testimonialId={editingTestimonial.id}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingTestimonial(null)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTestimonialsPage;
