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
import type { DeviceData } from "@/types/analytics";

interface DeviceChartProps {
  data: DeviceData[];
}

const colors = ["#4F46E5", "#06B6D4", "#10B981"];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-sm text-gray-500">
          <span className="font-bold text-gray-800">
            {payload[0].value.toLocaleString()}
          </span>{" "}
          sessions
        </p>
      </div>
    );
  }
  return null;
};

export default function DeviceChart({ data }: DeviceChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={48} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="device"
            tick={{ fontSize: 13, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB" }} />
          <Bar dataKey="sessions" radius={[6, 6, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {data.map((item, i) => (
          <div key={item.device} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors[i] }}
              />
              <span className="text-sm text-gray-600">{item.device}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: colors[i],
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
