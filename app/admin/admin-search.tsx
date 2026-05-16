"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
      ? "/admin/users"
      : "/admin/products";

  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);
  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="w-[200px] rounded-full border border-primary-text/20 shadow-lg"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const url = `${formActionUrl}?query=${queryValue}`;
            window.location.href = url;
          }
        }}
      />
      <button className="sr-only">Search</button>
    </form>
  );
};

export default AdminSearch;
