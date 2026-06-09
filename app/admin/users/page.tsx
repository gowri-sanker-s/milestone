import { auth } from "@/auth";
import DeleteDialogue from "@/components/shared/delete-dialogue";
import Pagination from "@/components/shared/Pagination";
import { deleteUser, getAllUsers } from "@/lib/actions/user.action";
import { funnel } from "@/lib/fonts";
import { formatId } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Users",
  description: "Admin Users",
};

const UserPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const { page = "1", query: searchText } = await props.searchParams;
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  const { users, totalPages } = await getAllUsers({
    page: Number(page),
    limit: 10,
    query: searchText,
  });

  return (
    <div>
      <div className="flex gap-2 items-center mb-2">
        <h2 className="font-bold text-2xl ">Users</h2>
        {searchText && (
          <p className="text-md text-primary-text/70">
            <sub>Showing results for "{searchText}"</sub>
          </p>
        )}
      </div>

      {/* table to display the users - table with head - id name email role actions */}
      <div className="overflow-x-auto rounded-2xl overflow-scroll border border-primary-text/20">
        <table className="min-w-full divide-y divide-primary-text/50">
          <thead className="bg-primary-border/80">
            <tr>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${funnel.className} uppercase tracking-wider`}
              >
                ID
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${funnel.className} uppercase tracking-wider`}
              >
                Name
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${funnel.className} uppercase tracking-wider`}
              >
                Email
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${funnel.className} uppercase tracking-wider`}
              >
                Role
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${funnel.className} uppercase tracking-wider`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-primary-border/50 divide-y divide-primary-text/50">
            {users?.length === 0 ? (
              <tr className="border-b border-primary-text/20 last:border-b-0">
                <td
                  colSpan={6}
                  className={`px-6 py-4 whitespace-nowrap text-sm font-normal text-center ${funnel.className}`}
                >
                  No users found
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr key={user.id}>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    {formatId(user.id)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    {user.name}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    {user.email}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className} `}
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs  capitalize ${
                        user.role === "admin" ? "bg-black text-white " : ""
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    <div className="flex gap-3 items-center">
                      <button className="">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-blue-600 text-[13px] flex items-center gap-3 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md"
                        >
                          <Eye size={14} strokeWidth={1.7} />
                          View
                        </Link>
                      </button>
                      <DeleteDialogue id={user.id} action={deleteUser} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages && totalPages > 1 && (
        <Pagination
          page={Number(page) || 1}
          totalPages={totalPages}
          // urlParamName="page"
        />
      )}
    </div>
  );
};

export default UserPage;
