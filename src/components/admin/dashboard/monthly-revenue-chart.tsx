"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyRevenue } from "@/lib/dashboard";

interface MonthlyRevenueChartProps {
  data: MonthlyRevenue[];
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  const hasData = data.some((d) => d.revenue > 0);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
      {!hasData ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
          No revenue data available yet.
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(Number(value))}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
                labelFormatter={(label) => `Month: ${label}`}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Bar
                dataKey="revenue"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
