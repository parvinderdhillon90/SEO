"use client";

import Link from "next/link";
import { AlertTriangle, AlertCircle, ChevronRight } from "lucide-react";
import type { Property } from "@/types/dashboard";

interface AlertBannerProps {
  critical: (Property & { chainName: string; chainId: string })[];
  warning: (Property & { chainName: string; chainId: string })[];
}

export default function AlertBanner({ critical, warning }: AlertBannerProps) {
  if (critical.length === 0 && warning.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {critical.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <h3 className="font-semibold text-red-700">
              {critical.length} Properties Need Immediate Attention
            </h3>
            <span className="ml-auto text-xs text-red-400">
              Organic traffic down significantly
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {critical.map((p) => (
              <Link
                key={p.id}
                href={`/chain/${p.chainId}`}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-red-100 hover:border-red-300 hover:shadow-sm transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{p.chainName}</span>
                    <span className="text-xs font-bold text-red-600">
                      {p.metrics.organicTraffic.vsLastMonthPct.toFixed(1)}% LM
                    </span>
                    <span className="text-xs font-bold text-red-700">
                      {p.metrics.organicTraffic.vsLastYearPct.toFixed(1)}% LY
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-300 group-hover:text-red-500 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {warning.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <h3 className="font-semibold text-amber-700">
              {warning.length} Properties Require Monitoring
            </h3>
            <span className="ml-auto text-xs text-amber-400">Moderate traffic decline</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {warning.map((p) => (
              <Link
                key={p.id}
                href={`/chain/${p.chainId}`}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all group"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{p.chainName}</span>
                    <span className="text-xs font-bold text-amber-600">
                      {p.metrics.organicTraffic.vsLastMonthPct.toFixed(1)}% LM
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      {p.metrics.organicTraffic.vsLastYearPct.toFixed(1)}% LY
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-300 group-hover:text-amber-500 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
