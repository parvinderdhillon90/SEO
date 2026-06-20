"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Search, ArrowUpDown } from "lucide-react";
import TrendBadge from "@/components/common/TrendBadge";
import StatusBadge from "@/components/common/StatusBadge";
import type { Property } from "@/types/dashboard";

interface PropertiesTableProps {
  properties: Property[];
  chainId: string;
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();
}

type SortKey = "organic" | "vsLM" | "vsLY" | "bounce" | "conv" | "revenue";

export default function PropertiesTable({ properties, chainId }: PropertiesTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("vsLM");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<"all" | "critical" | "warning" | "healthy">("all");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortValue = (p: Property): number => {
    switch (sortKey) {
      case "organic": return p.metrics.organicTraffic.current;
      case "vsLM": return p.metrics.organicTraffic.vsLastMonthPct;
      case "vsLY": return p.metrics.organicTraffic.vsLastYearPct;
      case "bounce": return p.metrics.bounceRate;
      case "conv": return p.metrics.conversionRate;
      case "revenue": return p.metrics.revenue;
      default: return 0;
    }
  };

  const filtered = properties
    .filter((p) =>
      (statusFilter === "all" || p.status === statusFilter) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const diff = sortValue(a) - sortValue(b);
      return sortDir === "asc" ? diff : -diff;
    });

  const SortBtn = ({ col, children }: { col: SortKey; children: React.ReactNode }) => (
    <button
      onClick={() => toggleSort(col)}
      className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${sortKey === col ? "text-indigo-600" : ""}`}
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  const rowBg: Record<string, string> = {
    critical: "border-l-4 border-l-red-400 bg-red-50/40",
    warning: "border-l-4 border-l-amber-400 bg-amber-50/30",
    healthy: "border-l-4 border-l-emerald-400",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filters */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
          />
        </div>
        <div className="flex items-center gap-1">
          {(["all", "critical", "warning", "healthy"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? s === "critical"
                    ? "bg-red-100 text-red-700"
                    : s === "warning"
                    ? "bg-amber-100 text-amber-700"
                    : s === "healthy"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-100 text-indigo-700"
                  : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {s === "all" ? `All (${properties.length})` : s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Property
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <SortBtn col="organic">Organic</SortBtn>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <SortBtn col="vsLM">vs Last Month</SortBtn>
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <SortBtn col="vsLY">vs Last Year</SortBtn>
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                New%
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                <SortBtn col="bounce">Bounce</SortBtn>
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <SortBtn col="conv">Conv%</SortBtn>
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden xl:table-cell">
                Room Nights
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden xl:table-cell">
                <SortBtn col="revenue">Revenue</SortBtn>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Keywords
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((property) => (
              <tr
                key={property.id}
                className={`border-b border-gray-50 hover:brightness-98 transition-all group ${rowBg[property.status]}`}
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-gray-800">{property.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{property.location} · {property.gaPropertyId}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={property.status} />
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-bold text-gray-800">{fmt(property.metrics.organicTraffic.current)}</span>
                </td>
                <td className="px-4 py-4">
                  <TrendBadge value={property.metrics.organicTraffic.vsLastMonthPct} />
                </td>
                <td className="px-4 py-4">
                  <TrendBadge value={property.metrics.organicTraffic.vsLastYearPct} />
                </td>
                <td className="px-4 py-4 text-right hidden lg:table-cell">
                  <span className="text-sm text-gray-600">{property.metrics.newUsersPct}%</span>
                </td>
                <td className="px-4 py-4 text-right hidden lg:table-cell">
                  <span
                    className={`text-sm font-semibold ${
                      property.metrics.bounceRate > 55
                        ? "text-red-500"
                        : property.metrics.bounceRate > 45
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {property.metrics.bounceRate}%
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm font-semibold text-gray-700">
                    {property.metrics.conversionRate}%
                  </span>
                </td>
                <td className="px-4 py-4 text-right hidden xl:table-cell">
                  <span className="text-sm text-gray-600">{property.metrics.roomNights}</span>
                </td>
                <td className="px-4 py-4 text-right hidden xl:table-cell">
                  <span className="text-sm font-bold text-emerald-600">
                    ${(property.metrics.revenue / 1000).toFixed(0)}k
                  </span>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/keywords?chain=${chainId}&property=${property.id}`}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    {property.keywords.length}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No properties match the current filter.
          </div>
        )}
      </div>
    </div>
  );
}
