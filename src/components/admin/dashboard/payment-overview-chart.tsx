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
  collected: "#059669",
  outstanding: "#dc2626",
};

export function PaymentOverviewChart({ data }: PaymentOverviewChartProps) {
  const hasData = data.some((d) => d.amount > 0);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <h2 className="text-base font-semibold text-card-foreground mb-4">Payment Overview</h2>
      {!hasData ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No billing data available yet.
        </div>
      ) : (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
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
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 13, fontWeight: 500, fill: "#334155" }}
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
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "13px",
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
