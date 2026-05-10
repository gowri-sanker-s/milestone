import React from "react";

import AdminSidebar from "./admin-sidebar";
import Link from "next/link";
import { oleo } from "@/lib/fonts";
import UserButton from "./user-button";
import { Input } from "@/components/ui/input";
import AdminSearch from "@/app/admin/admin-search";

const AdminHeader = () => {
  return (
    <header className=" text-primary-text bg-primary-bg  border-b border-primary-border py-1 sticky top-0 z-2">
      <div className="grid grid-cols-3 items-center wrapper">
        {/* open toggle */}
        <AdminSidebar />
        {/* logo */}
        <Link
          href={"/"}
          className={`${oleo.className} text-[35px] justify-self-center `}
        >
          milestone books
        </Link>
        {/* empty */}
        <div className="flex gap-5 items-center justify-self-end">
          <AdminSearch />
          <UserButton />
        </div>
        {/* <ModeToggle /> */}
      </div>
    </header>
  );
};

export default AdminHeader;
