"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import KeywordTable from "@/components/keywords/KeywordTable";
import StatusBadge from "@/components/common/StatusBadge";
import { useChainsContext } from "@/contexts/ChainsContext";
import type { KeywordRanking } from "@/types/dashboard";

function KeywordsInner() {
  const searchParams = useSearchParams();
  const { chains, loading: chainsLoading } = useChainsContext();

  const initialChainId = searchParams.get("chain") ?? (chains[0]?.id ?? "");
  const initialPropId  = searchParams.get("property") ?? null;

  const [selectedChainId, setSelectedChainId]       = useState(initialChainId);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    initialPropId ?? chains.find((c) => c.id === initialChainId)?.properties[0]?.id ?? ""
  );
  const [keywords, setKeywords]   = useState<KeywordRanking[]>([]);
  const [kwLoading, setKwLoading] = useState(false);

  // Sync selectedChainId when chains first load
  useEffect(() => {
    if (!chainsLoading && chains.length > 0 && !selectedChainId) {
      const qChain = searchParams.get("chain") ?? chains[0].id;
      setSelectedChainId(qChain);
      setSelectedPropertyId(
        searchParams.get("property") ?? chains.find((c) => c.id === qChain)?.properties[0]?.id ?? ""
      );
    }
  }, [chainsLoading, chains, selectedChainId, searchParams]);

  const selectedChain = useMemo(
    () => chains.find((c) => c.id === selectedChainId) ?? chains[0],
    [chains, selectedChainId]
  );
  const selectedProperty = useMemo(
    () => selectedChain?.properties.find((p) => p.id === selectedPropertyId) ?? selectedChain?.properties[0],
    [selectedChain, selectedPropertyId]
  );

  // Fetch keywords whenever selected property changes
  useEffect(() => {
    if (!selectedProperty?.id) return;
    setKwLoading(true);
    fetch(`/api/properties/${selectedProperty.id}/keywords`)
      .then((r) => r.json())
      .then((data: KeywordRanking[]) => { setKeywords(data); setKwLoading(false); })
      .catch(() => setKwLoading(false));
  }, [selectedProperty?.id]);

  const handleChainChange = (chainId: string) => {
    setSelectedChainId(chainId);
    const chain = chains.find((c) => c.id === chainId);
    if (chain) setSelectedPropertyId(chain.properties[0]?.id ?? "");
  };

  if (chainsLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keyword Rankings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Track keyword positions, monitor changes, and analyse competitor rankings
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Data synced daily
        </div>
      </div>

      {/* Chain + Property Selectors */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Chain</label>
          <div className="relative">
            <select
              value={selectedChainId}
              onChange={(e) => handleChainChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm min-w-[220px]"
            >
              {chains.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.properties.length})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Property</label>
          <div className="relative">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm min-w-[260px]"
            >
              {selectedChain?.properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {selectedProperty && (
          <div className="flex items-end gap-3 ml-auto">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm flex items-center gap-3">
              <div>
                <p className="text-xs text-gray-400">Property</p>
                <p className="text-sm font-semibold text-gray-700">{selectedProperty.name}</p>
              </div>
              <div className="h-8 w-px bg-gray-100" />
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm text-gray-600">{selectedProperty.location}</p>
              </div>
              <div className="h-8 w-px bg-gray-100" />
              <StatusBadge status={selectedProperty.status} />
            </div>
          </div>
        )}
      </div>

      {/* Competitor domains */}
      {selectedProperty && (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 mb-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tracked Competitors</p>
          <div className="flex flex-wrap gap-2">
            {selectedProperty.competitorDomains.map((d) => (
              <span key={d} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600">{d}</span>
            ))}
          </div>
        </div>
      )}

      {/* Keyword Table */}
      {kwLoading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
          Loading keyword rankings…
        </div>
      ) : selectedProperty && keywords.length > 0 ? (
        <KeywordTable
          keywords={keywords}
          competitors={selectedProperty.competitorDomains}
          propertyName={selectedProperty.name}
        />
      ) : selectedProperty ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
          No keyword data available for this property.
        </div>
      ) : null}

      <footer className="mt-8 text-center text-xs text-gray-300">
        Keyword Rankings · Analytics Central Dashboard
      </footer>
    </main>
  );
}

export default function KeywordsPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>}>
      <KeywordsInner />
    </Suspense>
  );
}
