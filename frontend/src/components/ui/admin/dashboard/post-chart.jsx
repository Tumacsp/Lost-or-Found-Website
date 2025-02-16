import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PostStatsGraph = ({ data }) => {
  if (!data || !data.dailyStats) {
    return (
      <div className="w-full rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Daily Post Statistics
          </h3>
        </div>
        <div className="p-6 pt-0">
          <div className="h-64 w-full flex items-center justify-center">
            <p>No data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Sort data by date ascending
  const chartData = [...data.dailyStats].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const maxPosts = Math.max(4, ...chartData.map((item) => item.posts));

  // Generate ticks from 0 to maxPosts
  const ticks = Array.from({ length: maxPosts + 1 }, (_, i) => i);

  return (
    <div className="w-full rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Daily Post Statistics
        </h3>
      </div>
      <div className="p-6 pt-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 65 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  });
                }}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
                dy={8}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                width={40}
                domain={[0, maxPosts]}
                ticks={ticks}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "#374151", fontWeight: 600 }}
                itemStyle={{ color: "#2563eb" }}
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                }}
                formatter={(value) => [`${value} posts`, ""]}
              />
              <Line
                type="monotone"
                dataKey="posts"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{
                  fill: "#2563eb",
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  stroke: "#2563eb",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PostStatsGraph;
