import DeleteDialogue from "@/components/shared/delete-dialogue";
import { deleteProduct, getAllProducts } from "@/lib/actions/product.action";
import { formatCurrency, formatId } from "@/lib/utils";
import { Eye, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import Pagination from "@/components/shared/Pagination";

const AdminProductsPage = async (props: {
  searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";
  const { data, totalPages } = await getAllProducts({
    query: searchText,
    page,
    category,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="bg-primary-text text-primary-bg font-semibold text-[15px] p-2 px-4 rounded-md flex gap-2 items-center">
          <Plus size={14} strokeWidth={1.5} />
          Add Product
        </button>
      </div>
      {/* table that displays all the products */}
      <div className="overflow-x-auto mt-6 rounded-2xl border border-primary-text/30 shadow-md ">
        <table className="w-full">
          <thead className="bg-primary-border">
            <tr>
              <th className="px-4 py-3">Product ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Genre</th>
              <th className="px-4 py-3">Language</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr
                key={product.id}
                className="border-b border-primary-text/20 last:border-b-0"
              >
                <td className="px-4 py-4">{formatId(product.id)}</td>
                <td className="px-4 py-4">{product.name}</td>
                <td className="px-4 py-4 capitalize">{String(product.author).toLocaleLowerCase()}</td>
                <td className="px-4 py-4">{product.genres.join(", ")}</td>
                <td className="px-4 py-4">{product.language}</td>
                <td className="px-4 py-4">{product.stock}</td>
                <td className="px-4 py-4">{product.rating}</td>
                <td className="px-4 py-4">{formatCurrency(product.price)}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2 items-center">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-600 text-[13px] flex items-center gap-3 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md"
                    >
                      <Eye size={14} strokeWidth={1.7} />
                      View
                    </Link>
                    <button className="text-green-600 text-[13px] flex items-center gap-3 px-2 py-1 hover:bg-green-600/10 border border-green-600/20 rounded-md">
                      <Pencil size={14} strokeWidth={1.7} />
                      Edit
                    </button>
                    <DeleteDialogue id={product.id} action={deleteProduct} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} urlParamName="page" />
      )}
    </div>
  );
};

export default AdminProductsPage;
