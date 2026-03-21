import { getMyOrders } from "@/lib/actions/order.action";
import { formatCurrency, formatDate, formatId } from "@/lib/utils";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Pagination from "./Pagination";
import { funnel } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "My Orders",
};
const Orders = async (props: {
  searchParams?: Promise<{ page?: string | string[] | undefined }>;
}) => {
  const searchParams = await props?.searchParams;
  const page = Number(searchParams?.page) || 1;
  const { orders, totalPages } = await getMyOrders({ page });

  console.log(orders, totalPages);

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
            {orders.map((order) => (
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
                  <Link
                    href={`/order/${order.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination
          page={Number(page) || 1}
          totalPages={totalPages}
          // urlParamName="page"
        />
      )}
    </div>
  );
};

export default Orders;
