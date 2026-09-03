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
  PLANNED: "#6366f1",
  ONGOING: "#f59e0b",
  COMPLETED: "#22c55e",
  CANCELLED: "#ef4444",
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
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Projects by Status</h2>
      {!hasData ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
          No projects available yet.
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
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
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
