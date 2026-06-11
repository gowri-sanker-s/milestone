import React from "react";
import Link from "next/link";
import { Eye, Plus, BookOpen } from "lucide-react";
import { Metadata } from "next";
import { getAllAuthors, syncAuthorsFromProducts, deleteAuthor } from "@/lib/actions/author.action";
import { formatId } from "@/lib/utils";
import { funnel } from "@/lib/fonts";
import DeleteDialogue from "@/components/shared/delete-dialogue";
import Pagination from "@/components/shared/Pagination";
import Image from "next/image";

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

  const { authors, totalPages } = await getAllAuthors({
    query: searchText,
    page,
    limit: 10,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">Authors</h1>
          {searchText && (
            <>
              <p className="text-md text-primary-text/70">
                <sub>Showing results for "{searchText}"</sub>
              </p>
              <Link
                href="/admin/authors"
                className="text-xs border border-primary-text/30 p-1 px-2 rounded-full hover:bg-primary-border/20 transition"
              >
                Clear Filters
              </Link>
            </>
          )}
        </div>
        <button>
          <Link
            className="bg-primary-text text-primary-bg font-semibold text-[15px] p-2 px-4 rounded-md flex gap-2 items-center hover:opacity-90 transition"
            href="/admin/authors/create"
          >
            <Plus size={14} strokeWidth={1.5} />
            Add Author
          </Link>
        </button>
      </div>

      {/* Table displaying all authors */}
      <div className="overflow-x-auto mt-6 rounded-2xl border border-primary-text/30 shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-primary-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Author ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Biography</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-text/10">
            {!authors || authors.length === 0 ? (
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
                    {author.bio || <span className="italic text-primary-text/40">No biography provided.</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-normal">
                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/admin/authors/${author.id}`}
                        className="text-blue-600 text-[13px] flex items-center gap-2 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md transition-colors"
                      >
                        <Eye size={14} strokeWidth={1.7} />
                        Edit
                      </Link>
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
          <Pagination page={page} totalPages={totalPages} urlParamName="page" />
        </div>
      )}
    </div>
  );
};

export default AdminAuthorsPage;
