"use client";

import type { PropertyStatus } from "@/types/dashboard";

interface StatusBadgeProps {
  status: PropertyStatus;
  showLabel?: boolean;
}

const config: Record<PropertyStatus, { bg: string; text: string; dot: string; label: string }> = {
  critical: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Critical" },
  warning: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "Warning" },
  healthy: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Healthy" },
};

export default function StatusBadge({ status, showLabel = true }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />
      {showLabel && c.label}
    </span>
  );
}
