import Link from "next/link";
import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/user.action";
const UserButton = async () => {
  const session = await auth();
  if (!session) {
    return <Link href="/sign-in">Sign In</Link>;
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";
  return (
    <div>
      {firstInitial}{" "}
      <form action={signOutUser}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
};

export default UserButton;
