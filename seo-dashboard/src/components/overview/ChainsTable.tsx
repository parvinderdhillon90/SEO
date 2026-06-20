"use client";

import Link from "next/link";
import { ChevronRight, ArrowUpDown } from "lucide-react";
import TrendBadge from "@/components/common/TrendBadge";
import type { Chain } from "@/types/dashboard";

interface ChainsTableProps {
  chains: Chain[];
}

function fmt(n: number) {
  return n >= 1000000
    ? `${(n / 1000000).toFixed(1)}M`
    : n >= 1000
    ? `${(n / 1000).toFixed(1)}k`
    : n.toString();
}

function fmtCurrency(n: number) {
  return n >= 1000000
    ? `$${(n / 1000000).toFixed(2)}M`
    : `$${(n / 1000).toFixed(0)}k`;
}

export default function ChainsTable({ chains }: ChainsTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">All Hotel Chains</h2>
          <p className="text-sm text-gray-400 mt-0.5">Click a chain to drill into individual properties</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowUpDown className="w-3.5 h-3.5" />
          Sort
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Chain
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Props
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Organic Traffic
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                vs Last Month
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                vs Last Year
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden xl:table-cell">
                Total Traffic
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden xl:table-cell">
                New / Return
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                Bounce
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                Conv%
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden 2xl:table-cell">
                Room Nights
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden 2xl:table-cell">
                Revenue
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Health
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {chains.map((chain) => {
              const { metrics } = chain;
              const hasCritical = metrics.criticalCount > 0;
              const hasWarning = metrics.warningCount > 0;
              return (
                <tr
                  key={chain.id}
                  className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
                >
                  {/* Chain name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 ${chain.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-white text-xs font-bold">{chain.shortName.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{chain.name}</p>
                        <p className="text-xs text-gray-400">{chain.properties.length} properties</p>
                      </div>
                    </div>
                  </td>
                  {/* Property count */}
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-700">{chain.properties.length}</span>
                  </td>
                  {/* Organic traffic */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-bold text-gray-800">{fmt(metrics.organicTraffic.current)}</span>
                  </td>
                  {/* vs Last Month */}
                  <td className="px-4 py-4">
                    <TrendBadge value={metrics.organicTraffic.vsLastMonthPct} />
                  </td>
                  {/* vs Last Year */}
                  <td className="px-4 py-4">
                    <TrendBadge value={metrics.organicTraffic.vsLastYearPct} />
                  </td>
                  {/* Total traffic */}
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <span className="text-sm font-semibold text-gray-700">{fmt(metrics.totalTraffic.current)}</span>
                  </td>
                  {/* New / Returning */}
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-400 rounded-full"
                          style={{ width: `${metrics.avgNewUsersPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {metrics.avgNewUsersPct}% new
                      </span>
                    </div>
                  </td>
                  {/* Bounce Rate */}
                  <td className="px-4 py-4 text-right hidden lg:table-cell">
                    <span
                      className={`text-sm font-semibold ${
                        metrics.avgBounceRate > 55
                          ? "text-red-500"
                          : metrics.avgBounceRate > 45
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {metrics.avgBounceRate}%
                    </span>
                  </td>
                  {/* Conv Rate */}
                  <td className="px-4 py-4 text-right hidden lg:table-cell">
                    <span className="text-sm font-semibold text-gray-700">
                      {metrics.avgConversionRate}%
                    </span>
                  </td>
                  {/* Room Nights */}
                  <td className="px-4 py-4 text-right hidden 2xl:table-cell">
                    <span className="text-sm font-semibold text-gray-700">
                      {metrics.totalRoomNights.toLocaleString()}
                    </span>
                  </td>
                  {/* Revenue */}
                  <td className="px-4 py-4 text-right hidden 2xl:table-cell">
                    <span className="text-sm font-bold text-emerald-600">
                      {fmtCurrency(metrics.totalRevenue)}
                    </span>
                  </td>
                  {/* Health indicator */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {metrics.criticalCount > 0 && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          {metrics.criticalCount}
                        </span>
                      )}
                      {metrics.warningCount > 0 && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {metrics.warningCount}
                        </span>
                      )}
                      {metrics.healthyCount > 0 && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {metrics.healthyCount}
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Drill-down */}
                  <td className="px-4 py-4">
                    <Link
                      href={`/chain/${chain.id}`}
                      className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
