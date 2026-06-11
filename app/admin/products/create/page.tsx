import ProductForm from "@/components/admin/product-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Product",
  description: "Create a new product",
};

const CreateProductPage = () => {
  return (
    <div>
      {" "}
      <div className="my-6">
        <ProductForm type="Create" />
      </div>
    </div>
  );
};

export default CreateProductPage;
