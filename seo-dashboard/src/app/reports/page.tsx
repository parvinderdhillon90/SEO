"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, FileText } from "lucide-react";
import { chains } from "@/lib/mockData";
import ReportContent from "@/components/reports/ReportContent";
import StatusBadge from "@/components/common/StatusBadge";

function ReportsInner() {
  const searchParams = useSearchParams();
  const initialChainId = searchParams.get("chain") ?? chains[0].id;
  const initialPropId = searchParams.get("property") ?? null;

  const [selectedChainId, setSelectedChainId] = useState(initialChainId);
  const [reportLevel, setReportLevel] = useState<"chain" | "property">(
    initialPropId ? "property" : "chain"
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    initialPropId ?? chains.find((c) => c.id === initialChainId)?.properties[0]?.id ?? ""
  );

  const selectedChain = useMemo(
    () => chains.find((c) => c.id === selectedChainId) ?? chains[0],
    [selectedChainId]
  );
  const selectedProperty = useMemo(
    () => selectedChain.properties.find((p) => p.id === selectedPropertyId) ?? selectedChain.properties[0],
    [selectedChain, selectedPropertyId]
  );

  const handleChainChange = (chainId: string) => {
    setSelectedChainId(chainId);
    const chain = chains.find((c) => c.id === chainId);
    if (chain) setSelectedPropertyId(chain.properties[0].id);
  };

  return (
    <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Crux</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Auto-generated SEO performance reports with actionable recommendations
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
          <FileText className="w-4 h-4" />
          Ready to send to client
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
          Configure Report
        </p>
        <div className="flex flex-wrap gap-4">
          {/* Report level */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Report Level</label>
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
              {(["chain", "property"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setReportLevel(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                    reportLevel === level
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {level === "chain" ? "Chain Level" : "Property Level"}
                </button>
              ))}
            </div>
          </div>

          {/* Chain selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Chain</label>
            <div className="relative">
              <select
                value={selectedChainId}
                onChange={(e) => handleChainChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[220px]"
              >
                {chains.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Property selector (only for property-level) */}
          {reportLevel === "property" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Property</label>
              <div className="relative">
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[260px]"
                >
                  {selectedChain.properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Status preview */}
          {reportLevel === "property" && selectedProperty && (
            <div className="flex items-end">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <span className="text-sm text-gray-500">{selectedProperty.location}</span>
                <span className="h-4 w-px bg-gray-300" />
                <StatusBadge status={selectedProperty.status} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report */}
      <ReportContent
        chain={selectedChain}
        property={reportLevel === "property" ? selectedProperty : undefined}
      />

      <footer className="mt-8 text-center text-xs text-gray-300">
        Reports & Crux · Analytics Central Dashboard
      </footer>
    </main>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>}>
      <ReportsInner />
    </Suspense>
  );
}
