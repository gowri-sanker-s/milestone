import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { getOrderSummary } from "@/lib/actions/order.action";
import { ListOrdered } from "lucide-react";
import { formatCurrency, formatId } from "@/lib/utils";
import Cards from "./Cards";
import MonthlySales from "./MonthlySales";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const Overview = async () => {
  const session = await auth();
  if (!session) throw new Error("User Not Authenticated");
  if (session?.user?.role !== "admin") throw new Error("Unauthorized");
  const {
    orderCount,
    deliveredOrderCount,
    pendingOrderCount,
    productsCount,
    userCount,
    totalSales,
    monthlySales,
    latestSales,
  } = await getOrderSummary();

  console.log({
    orderCount,
    deliveredOrderCount,
    pendingOrderCount,
    productsCount,
    userCount,
    totalSales,
    monthlySales,
    latestSales,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      {/* display cards with value label and an icon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Cards
          keyName="Total Orders"
          value={orderCount.toString()}
          icon={<ListOrdered size={23} strokeWidth={1.5} />}
          color="bg-blue-100"
        />
        <Cards
          keyName="Total Revenue"
          value={formatCurrency(totalSales?._sum?.totalPrice || 0)}
          icon={<ListOrdered size={23} strokeWidth={1.5} />}
          color="bg-blue-100"
        />
        <Cards
          keyName="Delivered Orders"
          value={deliveredOrderCount.toString()}
          icon={<ListOrdered size={23} strokeWidth={1.5} />}
          color="bg-blue-100"
        />
        <Cards
          keyName="Pending Orders"
          value={pendingOrderCount.toString()}
          icon={<ListOrdered size={23} strokeWidth={1.5} />}
          color="bg-blue-100"
        />
        <Cards
          keyName="Product Count"
          value={productsCount.toString()}
          icon={<ListOrdered size={23} strokeWidth={1.5} />}
          color="bg-blue-100"
        />
        <Cards
          keyName="User Count"
          value={userCount.toString()}
          icon={<ListOrdered size={23} strokeWidth={1.5} />}
          color="bg-blue-100"
        />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mt-10">
        <div className="">
          {/* display monthly sales using recharts linechart */}
          <MonthlySales monthlySales={monthlySales} />
        </div>
        <div className="">
          {/* display latest sales */}
          <h1 className="text-2xl font-bold mb-4">Latest Sales</h1>
          <table className="bg-primary-border w-full rounded-2xl overflow-hidden text-primary-text">
            <thead>
              <tr className="bg-primary-text/20 rounded-t-2xl">
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Total Price</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {latestSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-primary-text/50 last:border-none"
                >
                  <td className="px-4 py-3">
                    {sale?.user?.name || "Deleted User"}
                  </td>
                  <td className="px-4 py-3">{formatId(sale.id)}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(sale.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/order/${sale.id}`}>Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
