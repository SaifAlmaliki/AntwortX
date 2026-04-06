"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const gradeColors: Record<string, string> = {
  Excellent: "#22c55e",
  Good: "#3b82f6",
  Fair: "#f59e0b",
  Poor: "#f97316",
  Critical: "#ef4444",
};

interface GradeBreakdownProps {
  gradeMap: Record<string, number>;
}

export function GradeBreakdown({ gradeMap }: GradeBreakdownProps) {
  const chartData = Object.entries(gradeMap).map(([grade, count]) => ({
    grade,
    count,
    fill: gradeColors[grade] || "#71717a",
  }));

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-base text-zinc-100">Grade Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
            No grade data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="grade" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#e4e4e7",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
