import { deleteOrder, getAllOrders } from "@/lib/actions/order.action";
import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import Pagination from "../../../components/shared/Pagination";
import { funnel } from "@/lib/fonts";
import { formatCurrency, formatDate, formatId } from "@/lib/utils";
import Link from "next/link";
import { Eye, Trash } from "lucide-react";
import DeleteDialogue from "@/components/shared/delete-dialogue";
export const metadata: Metadata = {
  title: "Admin Orders",
  description: "Admin Orders",
};

const AdminOrders = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page = "1" } = await props.searchParams;
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");

  const orders = await getAllOrders({ page: Number(page), limit: 10 });

  console.log(orders);
  return (
    <div className="">
      <h2 className="font-bold text-2xl mb-6">Orders</h2>

      {/* table to display the orders - table with head - id date total paid delivered actions */}
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
                Date
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${funnel.className} uppercase tracking-wider`}
              >
                Total
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${funnel.className} uppercase tracking-wider`}
              >
                Paid
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${funnel.className} uppercase tracking-wider`}
              >
                Delivered
              </th>
              <th
                className={`px-6 py-3 text-left text-sm font-semibold ${funnel.className} uppercase tracking-wider`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-primary-border/50 divide-y divide-primary-text/50">
            {orders?.orders.length === 0 ? (
              <tr className="border-b border-primary-text/20 last:border-b-0">
                <td
                  colSpan={6}
                  className={`px-6 py-4 whitespace-nowrap text-sm font-normal text-center ${funnel.className}`}
                >
                  No orders found
                </td>
              </tr>
            ) : (
              orders?.orders.map((order) => (
                <tr key={order.id}>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    {formatId(order.id)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    {formatDate(order.createdAt).dateTime}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    {order.isPaid && order?.paidAt
                      ? formatDate(order.paidAt).dateTime
                      : "Not Paid"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    {order.isDelivered && order?.deliveredAt
                      ? formatDate(order.deliveredAt).dateTime
                      : "Not Delivered"}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-normal ${funnel.className}`}
                  >
                    <div className="flex gap-3 items-center">
                      <button className="">
                        <Link
                          href={`/order/${order.id}`}
                          className="text-blue-600 text-[13px] flex items-center gap-3 px-2 py-1 hover:bg-blue-600/10 border border-blue-600/20 rounded-md"
                        >
                          <Eye size={14} strokeWidth={1.7} />
                          View
                        </Link>
                      </button>
                      <DeleteDialogue id={order.id} action={deleteOrder} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {orders?.totalPages > 1 && (
        <Pagination
          page={Number(page) || 1}
          totalPages={orders?.totalPages}
          // urlParamName="page"
        />
      )}
    </div>
  );
};

export default AdminOrders;
