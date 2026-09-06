"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { ProjectsByStatus } from "@/lib/dashboard";

interface ProjectsByStatusChartProps {
  data: ProjectsByStatus[];
}

const STATUS_COLORS: Record<string, string> = {
  PLANNED: "#64748b",
  ONGOING: "#1e40af",
  COMPLETED: "#059669",
  CANCELLED: "#dc2626",
};

export function ProjectsByStatusChart({ data }: ProjectsByStatusChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const hasData = total > 0;

  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      ...d,
      color: STATUS_COLORS[d.status] || "#94a3b8",
    }));

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <h2 className="text-base font-semibold text-card-foreground mb-4">Projects by Status</h2>
      {!hasData ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No projects available yet.
        </div>
      ) : (
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="count"
                nameKey="label"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value)} project${Number(value) !== 1 ? "s" : ""}`,
                  name,
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "13px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
