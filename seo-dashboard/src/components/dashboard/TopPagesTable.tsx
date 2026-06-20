"use client";

import type { TopPage } from "@/types/analytics";

interface TopPagesTableProps {
  data: TopPage[];
}

export default function TopPagesTable({ data }: TopPagesTableProps) {
  const maxPageviews = Math.max(...data.map((p) => p.pageviews));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Page
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Pageviews
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
              Unique Views
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">
              Avg. Time
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Bounce Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((page, idx) => {
            const barWidth = (page.pageviews / maxPageviews) * 100;
            return (
              <tr
                key={page.page}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors group"
              >
                <td className="py-3 px-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-300 font-mono w-4">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-indigo-600 truncate max-w-[180px]">
                        {page.page}
                      </span>
                    </div>
                    <div className="ml-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-200 rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-right font-semibold text-gray-800">
                  {page.pageviews.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right text-gray-500 hidden md:table-cell">
                  {page.uniquePageviews.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right text-gray-500 hidden lg:table-cell">
                  {page.avgTimeOnPage}
                </td>
                <td className="py-3 px-2 text-right">
                  <span
                    className={`font-medium ${
                      parseFloat(page.bounceRate) < 30
                        ? "text-emerald-600"
                        : parseFloat(page.bounceRate) < 45
                        ? "text-amber-600"
                        : "text-red-500"
                    }`}
                  >
                    {page.bounceRate}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
