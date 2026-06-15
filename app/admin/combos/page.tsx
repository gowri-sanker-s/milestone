import DeleteDialogue from "@/components/shared/delete-dialogue";
import { deleteCombo, getAllCombos } from "@/lib/actions/combo.action";
import { formatCurrency, formatId } from "@/lib/utils";
import { Eye, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import Pagination from "@/components/shared/Pagination";
import { funnel } from "@/lib/fonts";

const AdminCombosPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const { combos, totalPages } = await getAllCombos({
    query: searchText,
    page,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center ">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles size={24} className="text-primary-text" />
            Combo Offers
          </h1>
          {searchText && (
            <>
              <p className="text-md text-primary-text/70 font-normal">
                <sub>Showing results for "{searchText}"</sub>
              </p>
              <Link
                href="/admin/combos"
                className="text-xs border border-primary-text/30 p-1 px-2 rounded-full font-semibold"
              >
                Clear Filters
              </Link>
            </>
          )}
        </div>
        <button>
          <Link
            className="bg-primary-text text-primary-bg font-semibold text-[15px] p-2 px-4 rounded-md flex gap-2 items-center"
            href="/admin/combos/create"
          >
            <Plus size={14} strokeWidth={1.5} />
            Add Combo Offer
          </Link>
        </button>
      </div>
      {/* table that displays all the combos */}
      <div className="overflow-x-auto mt-6 rounded-2xl border border-primary-text/30 shadow-md ">
        <table className="w-full">
          <thead className="bg-primary-border font-bold">
            <tr>
              <th className="px-4 py-3">Combo ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Included Books</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="font-normal">
            {!combos || combos.length === 0 ? (
              <tr className="border-b border-primary-text/20 last:border-b-0">
                <td
                  colSpan={7}
                  className={`px-6 py-4 whitespace-nowrap text-sm font-normal text-center ${funnel.className}`}
                >
                  No combo offers found
                </td>
              </tr>
            ) : (
              combos.map((combo) => (
                <tr
                  key={combo.id}
                  className="border-b border-primary-text/20 last:border-b-0"
                >
                  <td className="px-4 py-4">{formatId(combo.id)}</td>
                  <td className="px-4 py-4 font-semibold">{combo.name}</td>
                  <td className="px-4 py-4 text-sm font-semibold">
                    {combo.bookIds ? `${combo.bookIds.length} books` : "0 books"}
                  </td>
                  <td className="px-4 py-4">{combo.stock}</td>
                  <td className="px-4 py-4 font-bold">{formatCurrency(combo.price)}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-primary-text">
                    {combo.isFeatured ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-4 font-semibold">
                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/admin/combos/${combo.id}`}
                        className="text-blue-600 text-[13px] flex items-center gap-2 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md font-semibold"
                      >
                        <Eye size={14} strokeWidth={1.7} />
                        Edit
                      </Link>
                      <DeleteDialogue id={combo.id} action={deleteCombo} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} urlParamName="page" />
      )}
    </div>
  );
};

export default AdminCombosPage;
