"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronRight,
  Building2,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { chains } from "@/lib/mockData";

const statusColors: Record<string, string> = {
  critical: "bg-red-500",
  warning: "bg-amber-400",
  healthy: "bg-emerald-500",
};

export default function Sidebar() {
  const pathname = usePathname();
  const [chainsOpen, setChainsOpen] = useState(true);

  const totalCritical = chains.reduce((s, c) => s + c.metrics.criticalCount, 0);

  const navLink = (href: string, icon: React.ReactNode, label: string, badge?: number) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          active
            ? "bg-indigo-50 text-indigo-700"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`}
      >
        <span className={active ? "text-indigo-600" : "text-gray-400"}>{icon}</span>
        <span className="flex-1">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-none">Analytics Central</p>
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">800+ Properties · GA4</p>
        </div>
      </div>

      {/* Critical Alert */}
      {totalCritical > 0 && (
        <div className="mx-3 mt-3 px-3 py-2 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-xs font-semibold text-red-600">
            {totalCritical} properties critical
          </span>
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
          Dashboard
        </p>
        {navLink("/", <LayoutDashboard className="w-4 h-4" />, "Overview", totalCritical)}
        {navLink("/keywords", <TrendingUp className="w-4 h-4" />, "Keyword Rankings")}
        {navLink("/reports", <FileText className="w-4 h-4" />, "Reports & Crux")}

        {/* Chains */}
        <div className="pt-2">
          <button
            onClick={() => setChainsOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Hotel Chains</span>
            {chainsOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {chainsOpen && (
            <div className="mt-1 space-y-0.5">
              {chains.map((chain) => {
                const active = pathname === `/chain/${chain.id}`;
                const hasCritical = chain.metrics.criticalCount > 0;
                return (
                  <Link
                    key={chain.id}
                    href={`/chain/${chain.id}`}
                    className={`flex items-center gap-3 pl-6 pr-3 py-2 rounded-xl text-sm transition-colors ${
                      active
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        hasCritical
                          ? "bg-red-500"
                          : chain.metrics.warningCount > 0
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                      }`}
                    />
                    <span className="flex-1 truncate text-xs">{chain.shortName}</span>
                    <span className="text-[10px] text-gray-400">
                      {chain.properties.length}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Status legend */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Status Legend
        </p>
        <div className="space-y-1.5">
          {(["critical", "warning", "healthy"] as const).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColors[s]}`} />
              <span className="text-xs text-gray-500 capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
