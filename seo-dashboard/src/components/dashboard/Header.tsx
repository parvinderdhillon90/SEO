"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Download, RefreshCw, Bell } from "lucide-react";
import type { DateRange } from "@/types/analytics";

const dateRanges: DateRange[] = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

interface HeaderProps {
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  lastUpdated: string;
}

export default function Header({ selectedRange, onRangeChange, lastUpdated }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Google Analytics · GA4 · Updated {lastUpdated}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Date range picker */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            {selectedRange.label}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-[160px]">
              {dateRanges.map((range) => (
                <button
                  key={range.days}
                  onClick={() => {
                    onRangeChange(range);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedRange.days === range.days
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
        </button>
        <button className="relative p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
