"use client";
import { formatCurrency } from "@/lib/utils";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
// create a custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
        <p className="label">
          <span className="text-primary-text font-semibold block text-sm">
            Date: {label}
          </span>
          <span className="text-primary-text font-semibold block">
            {`Total Revenue: ${formatCurrency(payload[0].value)}`}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const MonthlySales = ({ monthlySales }: { monthlySales: any[] }) => {
  return (
    <div>
      {" "}
      <h1 className="text-2xl font-bold mb-4">Monthly Sales Revenue</h1>
      <LineChart data={monthlySales} height={350}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} fontWeight={600} />
        <YAxis
          tickFormatter={(value) => String(formatCurrency(value))}
          fontSize={12}
          fontWeight={600}
        />
        <Tooltip content={<CustomTooltip />} />
        {/* <Legend

          iconType="circle"
          iconSize={10}
          wrapperStyle={{ fontSize: 12, fontWeight: 600, marginTop: 0 }}
        /> */}
        <Line
          type="monotone"
          dataKey="totalSales"
          stroke="#442917"
          strokeWidth={1.5}
        />
      </LineChart>
    </div>
  );
};

export default MonthlySales;
