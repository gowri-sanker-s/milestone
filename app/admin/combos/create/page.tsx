import ComboForm from "@/components/admin/combo-form";
import React from "react";

const CreateComboPage = () => {
  return (
    <div className="max-w-4xl mx-auto font-normal">
      <h1 className="text-2xl font-bold mb-6">Create Combo Offer</h1>
      <div className="bg-primary-bg border border-primary-text/10 rounded-2xl p-6 shadow-sm">
        <ComboForm type="Create" />
      </div>
    </div>
  );
};

export default CreateComboPage;
