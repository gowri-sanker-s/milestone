import DeleteDialogue from "@/components/shared/delete-dialogue";
import { deleteProduct, getAllProducts } from "@/lib/actions/product.action";
import { formatCurrency, formatId } from "@/lib/utils";
import { Eye, Pencil, Plus, Upload } from "lucide-react";
import Link from "next/link";
import React from "react";
import Pagination from "@/components/shared/Pagination";
import { funnel } from "@/lib/fonts";

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
        <div className="flex gap-2 items-center ">
          <h1 className="text-2xl font-bold">Products</h1>
          {searchText && (
            <>
              <p className="text-md text-primary-text/70">
                <sub>Showing results for "{searchText}"</sub>
              </p>
              <Link
                href="/admin/products"
                className="text-xs border border-primary-text/30 p-1 px-2 rounded-full"
              >
                Clear Filters
              </Link>
            </>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            className="bg-primary-border text-primary-text border border-primary-text/10 font-semibold text-[15px] p-2 px-4 rounded-md flex gap-2 items-center hover:bg-primary-border/80 transition-colors"
            href="/admin/products/import"
          >
            <Upload size={14} strokeWidth={1.5} />
            Import CSV
          </Link>
          <Link
            className="bg-primary-text text-primary-bg font-semibold text-[15px] p-2 px-4 rounded-md flex gap-2 items-center hover:opacity-95 transition-opacity"
            href="/admin/products/create"
          >
            <Plus size={14} strokeWidth={1.5} />
            Add Product
          </Link>
        </div>
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
            {data?.length === 0 ? (
              <tr className="border-b border-primary-text/20 last:border-b-0">
                <td
                  colSpan={9}
                  className={`px-6 py-4 whitespace-nowrap text-sm font-normal text-center ${funnel.className}`}
                >
                  No products found
                </td>
              </tr>
            ) : (
              data.map((product, index) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock < 10 && product.stock > 0;
                return (
                  <tr
                    key={product.id}
                    className={`border-b border-primary-text/20 last:border-b-0 transition-colors ${
                      isOutOfStock
                        ? "bg-red-500/5 hover:bg-red-500/10"
                        : isLowStock
                          ? "bg-amber-500/5 hover:bg-amber-500/10"
                          : "hover:bg-primary-text/5"
                    }`}
                  >
                    <td className="px-4 py-4">{formatId(product.id)}</td>
                    <td className="px-4 py-4 font-medium">{product.name}</td>
                    <td className="px-4 py-4 capitalize">
                      {String(product.author).toLocaleLowerCase()}
                    </td>
                    <td className="px-4 py-4">{product.genres.join(", ")}</td>
                    <td className="px-4 py-4">{product.language}</td>
                    <td className="px-4 py-4">
                      {isOutOfStock ? (
                        <span className="bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {product.stock}
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {product.stock}
                        </span>
                      ) : (
                        <span className="bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold px-2.5 py-1 rounded-full">
                          {product.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">{product.rating}</td>
                    <td className="px-4 py-4">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2 items-center">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-blue-600 text-[13px] flex items-center gap-3 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md"
                        >
                          <Eye size={14} strokeWidth={1.7} />
                          Edit
                        </Link>
                        <DeleteDialogue
                          id={product.id}
                          action={deleteProduct}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
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

export default AdminProductsPage;
