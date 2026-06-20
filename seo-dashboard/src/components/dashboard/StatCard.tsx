"use client";

import {
  Activity,
  Users,
  Eye,
  TrendingDown,
  TrendingUp,
  Clock,
  Layers,
} from "lucide-react";
import type { OverviewMetric } from "@/types/analytics";

const iconMap: Record<string, React.ReactNode> = {
  activity: <Activity className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  eye: <Eye className="w-5 h-5" />,
  "trending-down": <TrendingDown className="w-5 h-5" />,
  clock: <Clock className="w-5 h-5" />,
  layers: <Layers className="w-5 h-5" />,
};

const iconColors: Record<string, string> = {
  activity: "bg-indigo-100 text-indigo-600",
  users: "bg-cyan-100 text-cyan-600",
  eye: "bg-emerald-100 text-emerald-600",
  "trending-down": "bg-amber-100 text-amber-600",
  clock: "bg-purple-100 text-purple-600",
  layers: "bg-rose-100 text-rose-600",
};

interface StatCardProps {
  metric: OverviewMetric;
}

export default function StatCard({ metric }: StatCardProps) {
  const isPositive = metric.change >= 0;
  const isBouncRate = metric.label === "Bounce Rate";
  // For bounce rate, a negative change is good
  const isGood = isBouncRate ? !isPositive : isPositive;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{metric.label}</span>
        <div className={`p-2 rounded-lg ${iconColors[metric.icon]}`}>
          {iconMap[metric.icon]}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className={`w-4 h-4 ${isGood ? "text-emerald-500" : "text-red-500"}`} />
        ) : (
          <TrendingDown className={`w-4 h-4 ${isGood ? "text-emerald-500" : "text-red-500"}`} />
        )}
        <span className={`text-sm font-semibold ${isGood ? "text-emerald-600" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{metric.change}%
        </span>
        <span className="text-sm text-gray-400">{metric.changeLabel}</span>
      </div>
    </div>
  );
}
