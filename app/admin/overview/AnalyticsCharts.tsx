"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { funnel } from "@/lib/fonts";

type AnalyticsChartsProps = {
  dailySalesTrend: { day: string; sales: number; orders: number }[];
  bestSellingAuthors: { author: string; sold: number }[];
  bestSellingGenres: { genre: string; sold: number }[];
  salesByProductType: { kind: string; count: number }[];
};

// Curated earthy color palette to match Milestone books branding
const COLORS = ["#442917", "#b04a26", "#d6cbc4", "#a51b24", "#e9dfd9"];

const CustomTooltip = ({ active, payload, label, mode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-primary-text/20 rounded-xl shadow-lg text-xs">
        <p className="font-bold text-primary-text mb-1">Day: {label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.name === "Revenue" ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-primary-text/20 rounded-xl shadow-lg text-xs">
        <p className="font-bold text-primary-text mb-1">{data.kind || "Other"}</p>
        <p className="font-semibold text-primary-text/80">
          Units Sold: {data.count} ({payload[0].percent ? `${(payload[0].percent * 100).toFixed(1)}%` : ""})
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsCharts = ({
  dailySalesTrend,
  bestSellingAuthors,
  bestSellingGenres,
  salesByProductType,
}: AnalyticsChartsProps) => {
  const [chartTab, setChartTab] = useState<"both" | "revenue" | "orders">("both");

  return (
    <div className="space-y-8 mt-10">
      {/* 1. Daily Trends Area Chart */}
      <div className="bg-primary-border/20 border border-primary-text/10 p-5 md:p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className={`${funnel.className} text-xl font-bold text-primary-text`}>
              Daily Revenue & Order Trends
            </h2>
            <p className="text-xs opacity-60">Past 30 days daily overview</p>
          </div>
          {/* Tab selectors */}
          <div className="flex bg-primary-border/50 border border-primary-text/10 rounded-lg p-1 text-xs self-start sm:self-auto">
            <button
              onClick={() => setChartTab("both")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                chartTab === "both" ? "bg-white text-primary-text shadow-sm" : "opacity-60 hover:opacity-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setChartTab("revenue")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                chartTab === "revenue" ? "bg-white text-primary-text shadow-sm" : "opacity-60 hover:opacity-100"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setChartTab("orders")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                chartTab === "orders" ? "bg-white text-primary-text shadow-sm" : "opacity-60 hover:opacity-100"
              }`}
            >
              Order Count
            </button>
          </div>
        </div>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySalesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#442917" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#442917" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b04a26" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#b04a26" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis dataKey="day" fontSize={11} fontWeight={600} tickLine={false} />
              <YAxis
                yAxisId="sales"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                tickFormatter={(val) => `₹${val}`}
                hide={chartTab === "orders"}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                hide={chartTab === "revenue"}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {(chartTab === "both" || chartTab === "revenue") && (
                <Area
                  yAxisId="sales"
                  type="monotone"
                  dataKey="sales"
                  name="Revenue"
                  stroke="#442917"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              )}
              {(chartTab === "both" || chartTab === "orders") && (
                <Area
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  name="Orders Count"
                  stroke="#b04a26"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Grid for Authors, Genres, and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Best Selling Authors Bar Chart */}
        <div className="bg-primary-border/20 border border-primary-text/10 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className={`${funnel.className} text-xl font-bold text-primary-text`}>
              Best-Selling Authors
            </h2>
            <p className="text-xs opacity-60 mb-6">Top authors by total quantity sold</p>
          </div>
          <div className="w-full h-[280px]">
            {bestSellingAuthors.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm opacity-50">
                No author sales data found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={bestSellingAuthors}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                  <XAxis type="number" fontSize={11} fontWeight={600} tickLine={false} />
                  <YAxis
                    dataKey="author"
                    type="category"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} copies sold`, "Sales"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "12px" }}
                  />
                  <Bar dataKey="sold" name="Copies Sold" fill="#442917" radius={[0, 6, 6, 0]} barSize={16}>
                    {bestSellingAuthors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Best Selling Genres Bar Chart */}
        <div className="bg-primary-border/20 border border-primary-text/10 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className={`${funnel.className} text-xl font-bold text-primary-text`}>
              Best-Selling Genres
            </h2>
            <p className="text-xs opacity-60 mb-6">Top genres by total quantity sold</p>
          </div>
          <div className="w-full h-[280px]">
            {bestSellingGenres.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm opacity-50">
                No genres sales data found
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={bestSellingGenres}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                  <XAxis type="number" fontSize={11} fontWeight={600} tickLine={false} />
                  <YAxis
                    dataKey="genre"
                    type="category"
                    fontSize={11}
                    fontWeight={600}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} copies sold`, "Sales"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", fontSize: "12px" }}
                  />
                  <Bar dataKey="sold" name="Copies Sold" fill="#b04a26" radius={[0, 6, 6, 0]} barSize={16}>
                    {bestSellingGenres.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Product Types Pie Chart */}
        <div className="bg-primary-border/20 border border-primary-text/10 p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className={`${funnel.className} text-xl font-bold text-primary-text`}>
              Product Types Distribution
            </h2>
            <p className="text-xs opacity-60 mb-4">Total items sold by product category share</p>
          </div>
          <div className="w-full h-[280px] flex flex-col sm:flex-row items-center justify-center gap-6">
            {salesByProductType.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm opacity-50">
                No items sales data found
              </div>
            ) : (
              <>
                <div className="w-[180px] h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByProductType}
                        dataKey="count"
                        nameKey="kind"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {salesByProductType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend */}
                <div className="space-y-2 flex-1 w-full max-w-[200px] text-xs">
                  {salesByProductType.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-semibold opacity-85 text-primary-text">
                          {entry.kind}
                        </span>
                      </div>
                      <span className="font-bold">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
