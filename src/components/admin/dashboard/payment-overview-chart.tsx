"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PaymentOverview } from "@/lib/dashboard";

interface PaymentOverviewChartProps {
  data: PaymentOverview[];
}

export function PaymentOverviewChart({ data }: PaymentOverviewChartProps) {
  const hasData = data.some((d) => d.amount > 0);

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <h2 className="text-base font-semibold text-card-foreground mb-4">Payment Overview</h2>
      {!hasData ? (
        <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
          No billing data available yet.
        </div>
      ) : (
        <div className="h-70">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 13, fontWeight: 500, fill: "#334155" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(value) => {
                  const num = Number(value);
                  if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
                  if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
                  return `$${num.toLocaleString()}`;
                }}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                width={60}
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
              <Line
                type="monotone"
                dataKey="amount"
                name="Amount"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 5, fill: "#4f46e5", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
