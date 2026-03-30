"use client";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { ProductType } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: ProductType;
  productId?: string;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(insertProductSchema),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Form {...form}>
      <form action="">
        <div className="">
          {/* Name */}
          {/* Slug */}
        </div>
        <div className="">
          {/* Price  */}
          {/* Stock */}
        </div>
        <div className="">
          {/* Author */}
          {/* Language */}
          {/* Pages */}
        </div>
        <div className="">
          {/* Images */}
          {/* is featured */}
          {/* Banner */}
        </div>
        <div className="">{/* Genres */}</div>
        <div className="">{/* Description */}</div>
      </form>
    </Form>
  );
};

export default ProductForm;
