import React from "react";
import { Metadata } from "next";
import { getProductById } from "@/lib/actions/product.action";
import ProductForm from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Update Product",
};
const AdminProductUpdatePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;
  const product = await getProductById(id);

  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Update Product</h1>
      <div className="my-6">
        <ProductForm type="Update" product={product} productId={id} />
      </div>
    </div>
  );
};

export default AdminProductUpdatePage;
