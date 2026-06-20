"use client";

import type { GeoData } from "@/types/analytics";

interface GeoTableProps {
  data: GeoData[];
}

const countryFlags: Record<string, string> = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  Canada: "🇨🇦",
  Australia: "🇦🇺",
  Germany: "🇩🇪",
  India: "🇮🇳",
  France: "🇫🇷",
  Netherlands: "🇳🇱",
};

export default function GeoTable({ data }: GeoTableProps) {
  const maxSessions = Math.max(...data.map((d) => d.sessions));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Country
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Sessions
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">
              Users
            </th>
            <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Bounce Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const barWidth = (item.sessions / maxSessions) * 100;
            return (
              <tr
                key={item.country}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span>{countryFlags[item.country] ?? "🌍"}</span>
                      <span className="font-medium text-gray-700">{item.country}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-200 rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-right font-semibold text-gray-800">
                  {item.sessions.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right text-gray-500 hidden md:table-cell">
                  {item.users.toLocaleString()}
                </td>
                <td className="py-3 px-2 text-right">
                  <span
                    className={`font-medium ${
                      parseFloat(item.bounceRate) < 40
                        ? "text-emerald-600"
                        : parseFloat(item.bounceRate) < 50
                        ? "text-amber-600"
                        : "text-red-500"
                    }`}
                  >
                    {item.bounceRate}
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
