import { getMyOrders } from "@/lib/actions/order.action";
import { formatCurrency, formatDate, formatId } from "@/lib/utils";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";

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
      {/* table to display the orders - table with head - id date total paid delivered actions */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-primary-text/50">
          <thead className="bg-primary-border/80">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-primary-border/50 divide-y divide-primary-text/50">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatId(order.id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.createdAt).dateTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(order.totalPrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.isPaid && order?.paidAt
                    ? formatDate(order.paidAt).dateTime
                    : "Not Paid"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.isDelivered && order?.deliveredAt
                    ? formatDate(order.deliveredAt).dateTime
                    : "Not Delivered"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
    </div>
  );
};

export default Orders;
