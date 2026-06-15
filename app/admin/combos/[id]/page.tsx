import ComboForm from "@/components/admin/combo-form";
import { getComboById } from "@/lib/actions/combo.action";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const EditComboPage = async ({ params }: Props) => {
  const { id } = await params;
  const combo = await getComboById(id);

  if (!combo) return notFound();

  return (
    <div className="max-w-4xl mx-auto font-normal">
      <h1 className="text-2xl font-bold mb-6">Edit Combo Offer</h1>
      <div className="bg-primary-bg border border-primary-text/10 rounded-2xl p-6 shadow-sm">
        <ComboForm type="Update" combo={combo as any} comboId={combo.id} />
      </div>
    </div>
  );
};

export default EditComboPage;
