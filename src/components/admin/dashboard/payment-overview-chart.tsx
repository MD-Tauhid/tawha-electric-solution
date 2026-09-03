"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { PaymentOverview } from "@/lib/dashboard";

interface PaymentOverviewChartProps {
  data: PaymentOverview[];
}

const CATEGORY_COLORS: Record<string, string> = {
  collected: "#22c55e",
  outstanding: "#ef4444",
};

export function PaymentOverviewChart({ data }: PaymentOverviewChartProps) {
  const hasData = data.some((d) => d.amount > 0);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Payment Overview</h2>
      {!hasData ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
          No billing data available yet.
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => {
                  const num = Number(value);
                  if (num >= 1000000)
                    return `$${(num / 1000000).toFixed(1)}M`;
                  if (num >= 1000)
                    return `$${(num / 1000).toFixed(0)}K`;
                  return `$${num.toLocaleString()}`;
                }}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 13, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                formatter={(value) => [
                  `$${Number(value).toLocaleString()}`,
                  "Amount",
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} name="Amount">
                {data.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={CATEGORY_COLORS[entry.category] || "#94a3b8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
