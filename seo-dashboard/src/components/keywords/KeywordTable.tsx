"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Minus, ExternalLink, Search } from "lucide-react";
import type { KeywordRanking } from "@/types/dashboard";

interface KeywordTableProps {
  keywords: KeywordRanking[];
  competitors: string[];
  propertyName: string;
}

function RankChange({ change }: { change: number | null }) {
  if (change === null) return <span className="text-gray-300 text-xs">—</span>;
  if (change === 0) return (
    <span className="flex items-center gap-0.5 text-gray-400 text-xs">
      <Minus className="w-3 h-3" /> same
    </span>
  );
  const up = change > 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-bold ${up ? "text-emerald-600" : "text-red-500"}`}>
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(change)}
    </span>
  );
}

function RankBadge({ rank }: { rank: number | null }) {
  if (rank === null) return <span className="text-gray-300 text-xs font-mono">—</span>;
  const page = Math.ceil(rank / 10);
  const color =
    rank <= 3
      ? "bg-emerald-100 text-emerald-700"
      : rank <= 10
      ? "bg-blue-100 text-blue-700"
      : rank <= 20
      ? "bg-amber-100 text-amber-700"
      : "bg-gray-100 text-gray-600";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold font-mono ${color}`}>
        #{rank}
      </span>
      <span className="text-[10px] text-gray-400">p.{page}</span>
    </div>
  );
}

type FilterType = "all" | "improved" | "declined" | "new" | "lost";

export default function KeywordTable({ keywords, competitors, propertyName }: KeywordTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = keywords.filter((kw) => {
    const matchSearch = kw.keyword.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    switch (filter) {
      case "improved": return kw.rankChange !== null && kw.rankChange > 0;
      case "declined": return kw.rankChange !== null && kw.rankChange < 0;
      case "new": return kw.previousRank === null && kw.currentRank !== null;
      case "lost": return kw.currentRank === null && kw.previousRank !== null;
      default: return true;
    }
  });

  const improved = keywords.filter((k) => k.rankChange !== null && k.rankChange > 0).length;
  const declined = keywords.filter((k) => k.rankChange !== null && k.rankChange < 0).length;
  const topTen = keywords.filter((k) => k.currentRank !== null && k.currentRank <= 10).length;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium">Total Keywords</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{keywords.length}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 shadow-sm border border-emerald-100">
          <p className="text-xs text-emerald-600 font-medium">Improved</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{improved}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 shadow-sm border border-red-100">
          <p className="text-xs text-red-500 font-medium">Declined</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{declined}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-100">
          <p className="text-xs text-blue-500 font-medium">Top 10 Rankings</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{topTen}</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="flex items-center gap-1">
            {(["all", "improved", "declined", "new", "lost"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filter === f
                    ? f === "improved"
                      ? "bg-emerald-100 text-emerald-700"
                      : f === "declined"
                      ? "bg-red-100 text-red-700"
                      : f === "new"
                      ? "bg-blue-100 text-blue-700"
                      : f === "lost"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-indigo-100 text-indigo-700"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Keyword
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Search Vol
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Cur. Rank
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Prev. Rank
                </th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Change
                </th>
                {competitors.slice(0, 3).map((c) => (
                  <th
                    key={c}
                    className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden xl:table-cell"
                  >
                    <span className="max-w-[100px] truncate block" title={c}>
                      {c.replace("www.", "").split(".")[0]}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
                  URL
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((kw) => {
                const isImproved = kw.rankChange !== null && kw.rankChange > 0;
                const isDeclined = kw.rankChange !== null && kw.rankChange < 0;
                return (
                  <tr
                    key={kw.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      isImproved
                        ? "border-l-2 border-l-emerald-300"
                        : isDeclined
                        ? "border-l-2 border-l-red-300"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span className="font-medium text-gray-800">{kw.keyword}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500 font-mono text-xs">
                      {kw.searchVolume.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RankBadge rank={kw.currentRank} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RankBadge rank={kw.previousRank} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RankChange change={kw.rankChange} />
                    </td>
                    {competitors.slice(0, 3).map((c) => {
                      const comp = kw.competitors.find((x) => x.domain === c);
                      return (
                        <td key={c} className="px-3 py-3 text-center hidden xl:table-cell">
                          <RankBadge rank={comp?.rank ?? null} />
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <a
                        href={kw.targetUrl}
                        className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{kw.targetUrl}</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No keywords match the filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
