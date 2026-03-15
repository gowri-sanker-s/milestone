import Link from "next/link";
import { auth } from "@/auth";
import UserDropdown from "./user-dropdown";
import { LogIn } from "lucide-react";
const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className="bg-primary-text p-3 px-3 rounded-xl text-primary-bg font-semibold text-[20px]">
        <Link href="/sign-in" className="">
          <LogIn size={16} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return <UserDropdown user={session.user} />;
};

export default UserButton;
