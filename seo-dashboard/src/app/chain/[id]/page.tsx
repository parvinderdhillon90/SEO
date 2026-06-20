"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, TrendingUp, BedDouble, DollarSign, Percent, Activity } from "lucide-react";
import { getChain } from "@/lib/mockData";
import TrendBadge from "@/components/common/TrendBadge";
import PropertiesTable from "@/components/chain/PropertiesTable";

function StatCard({ label, value, sub, icon: Icon, highlight }: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400">{label}</span>
        <div className={`p-1.5 rounded-lg ${highlight ?? "bg-gray-50 text-gray-400"}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <div className="mt-2">{sub}</div>}
    </div>
  );
}

export default function ChainPage() {
  const params = useParams();
  const chain = getChain(params.id as string);

  if (!chain) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-400 mb-3">Chain not found.</p>
          <Link href="/" className="text-indigo-600 font-semibold hover:underline">
            ← Back to Overview
          </Link>
        </div>
      </main>
    );
  }

  const { metrics } = chain;
  const criticalProps = chain.properties.filter((p) => p.status === "critical");
  const warningProps = chain.properties.filter((p) => p.status === "warning");

  return (
    <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Overview</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{chain.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${chain.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-sm font-bold">{chain.shortName.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{chain.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {chain.properties.length} properties · {metrics.criticalCount > 0 && (
                <span className="text-red-500 font-semibold">{metrics.criticalCount} critical · </span>
              )}
              {metrics.warningCount > 0 && (
                <span className="text-amber-500 font-semibold">{metrics.warningCount} warning · </span>
              )}
              <span className="text-emerald-500 font-semibold">{metrics.healthyCount} healthy</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/keywords?chain=${chain.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Keywords
          </Link>
          <Link
            href={`/reports?chain=${chain.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Chain Report
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard
          label="Organic Traffic"
          value={metrics.organicTraffic.current >= 1000 ? `${(metrics.organicTraffic.current / 1000).toFixed(0)}k` : metrics.organicTraffic.current.toString()}
          sub={
            <div className="flex flex-col gap-1">
              <TrendBadge value={metrics.organicTraffic.vsLastMonthPct} size="sm" label="LM" />
              <TrendBadge value={metrics.organicTraffic.vsLastYearPct} size="sm" label="LY" />
            </div>
          }
          icon={Activity}
          highlight="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Total Traffic"
          value={`${(metrics.totalTraffic.current / 1000).toFixed(0)}k`}
          sub={<TrendBadge value={metrics.totalTraffic.vsLastMonthPct} size="sm" label="LM" />}
          icon={TrendingUp}
          highlight="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          label="New Users Avg"
          value={`${metrics.avgNewUsersPct}%`}
          sub={<span className="text-xs text-gray-400">{100 - metrics.avgNewUsersPct}% returning</span>}
          icon={Activity}
          highlight="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Avg Bounce Rate"
          value={`${metrics.avgBounceRate}%`}
          sub={<span className={`text-xs font-medium ${metrics.avgBounceRate > 50 ? "text-red-500" : "text-emerald-600"}`}>
            {metrics.avgBounceRate > 50 ? "Above threshold" : "Healthy"}
          </span>}
          icon={Percent}
          highlight={metrics.avgBounceRate > 50 ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}
        />
        <StatCard
          label="Avg Conv Rate"
          value={`${metrics.avgConversionRate}%`}
          sub={<span className="text-xs text-gray-400">{metrics.totalRoomNights.toLocaleString()} room nights</span>}
          icon={BedDouble}
          highlight="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Total Revenue"
          value={`$${(metrics.totalRevenue / 1000).toFixed(0)}k`}
          sub={<span className="text-xs text-gray-400">Direct bookings</span>}
          icon={DollarSign}
          highlight="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Critical / Warning callouts */}
      {(criticalProps.length > 0 || warningProps.length > 0) && (
        <div className="space-y-3 mb-6">
          {criticalProps.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-semibold text-red-700">
                  {criticalProps.length} Propert{criticalProps.length === 1 ? "y" : "ies"} — Immediate Action Required
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {criticalProps.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-red-100 text-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="font-medium text-gray-700">{p.name}</span>
                    <span className="text-red-600 font-bold text-xs">
                      {p.metrics.organicTraffic.vsLastMonthPct.toFixed(1)}% LM
                    </span>
                    <span className="text-red-700 font-bold text-xs">
                      {p.metrics.organicTraffic.vsLastYearPct.toFixed(1)}% LY
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {warningProps.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-amber-700">
                  {warningProps.length} Propert{warningProps.length === 1 ? "y" : "ies"} — Requires Monitoring
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {warningProps.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-amber-100 text-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="font-medium text-gray-700">{p.name}</span>
                    <span className="text-amber-600 font-bold text-xs">
                      {p.metrics.organicTraffic.vsLastMonthPct.toFixed(1)}% LM
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Properties Table */}
      <PropertiesTable properties={chain.properties} chainId={chain.id} />

      <footer className="mt-8 text-center text-xs text-gray-300">
        {chain.name} · {chain.properties.length} Properties · Analytics Central Dashboard
      </footer>
    </main>
  );
}
