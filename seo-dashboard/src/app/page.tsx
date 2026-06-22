"use client";

import { BarChart3, Building2, TrendingUp, AlertTriangle, DollarSign, BedDouble } from "lucide-react";
import ChainsTable from "@/components/overview/ChainsTable";
import AlertBanner from "@/components/overview/AlertBanner";
import { useChainsContext } from "@/contexts/ChainsContext";

function fmt(n: number) {
  return n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n.toString();
}

export default function OverviewPage() {
  const { chains, loading } = useChainsContext();

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading dashboard…</div>
      </main>
    );
  }

  const critical = chains.flatMap((c) =>
    c.properties.filter((p) => p.status === "critical").map((p) => ({ ...p, chainName: c.name, chainId: c.id }))
  );
  const warning = chains.flatMap((c) =>
    c.properties.filter((p) => p.status === "warning").map((p) => ({ ...p, chainName: c.name, chainId: c.id }))
  );

  const totalProperties = chains.reduce((s, c) => s + c.properties.length, 0);
  const totalOrganic    = chains.reduce((s, c) => s + c.metrics.organicTraffic.current, 0);
  const totalRevenue    = chains.reduce((s, c) => s + c.metrics.totalRevenue, 0);
  const totalRoomNights = chains.reduce((s, c) => s + c.metrics.totalRoomNights, 0);

  const summaryCards = [
    { label: "Total Chains",          value: chains.length.toString(),                    icon: Building2,     color: "bg-indigo-50 text-indigo-600",  border: "border-indigo-100" },
    { label: "Total Properties",      value: totalProperties.toString(),                  icon: BarChart3,     color: "bg-cyan-50 text-cyan-600",      border: "border-cyan-100" },
    { label: "Total Organic Traffic", value: fmt(totalOrganic),                           icon: TrendingUp,    color: "bg-emerald-50 text-emerald-600",border: "border-emerald-100" },
    { label: "Properties Critical",   value: critical.length.toString(),                  icon: AlertTriangle, color: critical.length > 0 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400", border: critical.length > 0 ? "border-red-100" : "border-gray-100" },
    { label: "Total Room Nights",     value: totalRoomNights.toLocaleString(),            icon: BedDouble,     color: "bg-purple-50 text-purple-600",  border: "border-purple-100" },
    { label: "Total Revenue",         value: `$${(totalRevenue / 1000000).toFixed(2)}M`, icon: DollarSign,    color: "bg-amber-50 text-amber-600",    border: "border-amber-100" },
  ];

  return (
    <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Central Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {chains.length} chains · {totalProperties} properties · Google Analytics GA4
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live · Updated 2 min ago
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`bg-white rounded-2xl p-4 shadow-sm border ${card.border}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">{card.label}</span>
                <div className={`p-1.5 rounded-lg ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Alert Banner */}
      <AlertBanner critical={critical} warning={warning} />

      {/* Chains Table */}
      <ChainsTable chains={chains} />

      <footer className="mt-8 text-center text-xs text-gray-300">
        Analytics Central Dashboard · {totalProperties} Properties · Powered by GA4
      </footer>
    </main>
  );
}
