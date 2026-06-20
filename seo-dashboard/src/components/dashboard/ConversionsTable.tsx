"use client";

import { Target } from "lucide-react";
import type { ConversionData } from "@/types/analytics";

interface ConversionsTableProps {
  data: ConversionData[];
}

export default function ConversionsTable({ data }: ConversionsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Goal
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Completions
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Conv. Rate
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
              Goal Value
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.goalName}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 rounded-lg">
                    <Target className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <span className="font-medium text-gray-700">{item.goalName}</span>
                </div>
              </td>
              <td className="py-3 px-2 text-right font-semibold text-gray-800">
                {item.completions.toLocaleString()}
              </td>
              <td className="py-3 px-2 text-right">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                  {item.conversionRate}
                </span>
              </td>
              <td className="py-3 px-2 text-right font-semibold text-emerald-600 hidden md:table-cell">
                {item.goalValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
