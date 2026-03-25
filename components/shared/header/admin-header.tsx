import React from "react";

import AdminSidebar from "./admin-sidebar";
import Link from "next/link";
import { oleo } from "@/lib/fonts";
import UserButton from "./user-button";
import { Input } from "@/components/ui/input";

const AdminHeader = () => {
  return (
    <header className=" text-primary-text bg-primary-bg  border-b border-primary-border py-1 sticky top-0 z-2">
      <div className="flex justify-between items-center wrapper">
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
        <div className="flex gap-5 items-center">
          <>
            <Input
              type="search"
              placeholder="Search"
              className="w-[200px] rounded-full border border-primary-text/20 shadow-lg"
            />
          </>
          <UserButton />
        </div>
        {/* <ModeToggle /> */}
      </div>
    </header>
  );
};

export default AdminHeader;
