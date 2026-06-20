"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatCard from "@/components/dashboard/StatCard";
import SessionsChart from "@/components/dashboard/SessionsChart";
import TrafficSourcesChart from "@/components/dashboard/TrafficSourcesChart";
import DeviceChart from "@/components/dashboard/DeviceChart";
import TopPagesTable from "@/components/dashboard/TopPagesTable";
import GeoTable from "@/components/dashboard/GeoTable";
import ConversionsTable from "@/components/dashboard/ConversionsTable";
import {
  overviewMetrics,
  sessionData7,
  sessionData14,
  sessionData30,
  trafficSources,
  topPages,
  deviceData,
  geoData,
  conversionData,
} from "@/lib/mockData";
import type { DateRange, SessionDataPoint } from "@/types/analytics";

const sessionDataMap: Record<number, SessionDataPoint[]> = {
  7: sessionData7,
  14: sessionData14,
  30: sessionData30,
  90: sessionData30,
};

export default function Home() {
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    label: "Last 30 days",
    days: 30,
  });

  const chartData = sessionDataMap[selectedRange.days] ?? sessionData30;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 min-w-0">
        <Header
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          lastUpdated="2 min ago"
        />

        {/* KPI Cards */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {overviewMetrics.map((metric) => (
            <StatCard key={metric.label} metric={metric} />
          ))}
        </section>

        {/* Sessions Over Time + Traffic Sources */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Sessions Over Time
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {selectedRange.label} performance
                </p>
              </div>
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                {["Sessions", "Users", "Pageviews"].map((tab, i) => (
                  <button
                    key={tab}
                    className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                      i === 0
                        ? "bg-white shadow-sm text-indigo-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <SessionsChart data={chartData} />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-800">
                Traffic Sources
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">Channel breakdown</p>
            </div>
            <TrafficSourcesChart data={trafficSources} />
          </div>
        </div>

        {/* Device Breakdown + Conversions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-gray-800">
                Device Breakdown
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">Sessions by device type</p>
            </div>
            <DeviceChart data={deviceData} />
          </div>

          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Goal Conversions
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Tracking {conversionData.length} active goals
                </p>
              </div>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                Total:{" "}
                {conversionData
                  .reduce((s, d) => s + d.completions, 0)
                  .toLocaleString()}{" "}
                completions
              </span>
            </div>
            <ConversionsTable data={conversionData} />
          </div>
        </div>

        {/* Top Pages + Geo */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Top Pages</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  By pageviews · {selectedRange.label}
                </p>
              </div>
              <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                View all →
              </button>
            </div>
            <TopPagesTable data={topPages} />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Top Countries
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Geographic breakdown
                </p>
              </div>
              <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                View all →
              </button>
            </div>
            <GeoTable data={geoData} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-gray-300">
          Google Analytics Central Dashboard · Softmarche · Data refreshes every 24h
        </footer>
      </main>
    </div>
  );
}
