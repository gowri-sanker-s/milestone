import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
      <p className="text-gray-600 mb-4">
        You do not have permission to access this page.
      </p>
      <Link href="/">
        <Button>
          <ArrowLeft size={20} />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
