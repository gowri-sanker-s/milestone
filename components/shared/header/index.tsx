import { oleo } from "@/lib/fonts";
import ModeToggle from "./mode-toggle";
import Sidebar from "./sidebar";
import Link from "next/link";
import UserButton from "./user-button";

const Header = () => {
  return (
    <header className=" text-primary-text bg-primary-bg  border-b border-primary-border py-1 sticky top-0 z-2">
      <div className="flex justify-between items-center wrapper">
        {/* open toggle */}
        <Sidebar />
        {/* logo */}
        <Link
          href={"/"}
          className={`${oleo.className} text-[35px] justify-self-center `}
        >
          milestone books
        </Link>
        {/* empty */}
        <div>
          <UserButton />
        </div>
        {/* <ModeToggle /> */}
      </div>
    </header>
  );
};

export default Header;
