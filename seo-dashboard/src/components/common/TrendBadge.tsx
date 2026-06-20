"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendBadgeProps {
  value: number;
  label?: string;
  invert?: boolean; // for metrics where lower is better (bounce rate)
  size?: "sm" | "md";
}

export default function TrendBadge({ value, label, invert = false, size = "md" }: TrendBadgeProps) {
  const isGood = invert ? value < 0 : value > 0;
  const isNeutral = Math.abs(value) < 0.5;

  const colorClass = isNeutral
    ? "bg-gray-100 text-gray-500"
    : isGood
    ? "bg-emerald-50 text-emerald-700"
    : "bg-red-50 text-red-600";

  const Icon = isNeutral ? Minus : isGood ? TrendingUp : TrendingDown;
  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg font-semibold ${textSize} ${colorClass}`}>
      <Icon className={iconSize} />
      <span>
        {value > 0 ? "+" : ""}
        {value.toFixed(1)}%
      </span>
      {label && <span className="font-normal opacity-70 ml-0.5">{label}</span>}
    </div>
  );
}
