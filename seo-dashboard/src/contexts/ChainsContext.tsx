"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Chain } from "@/types/dashboard";

interface ChainsContextValue {
  chains: Chain[];
  loading: boolean;
  error: string | null;
}

const ChainsContext = createContext<ChainsContextValue>({
  chains: [],
  loading: true,
  error: null,
});

export function ChainsProvider({ children }: { children: ReactNode }) {
  const [chains, setChains] = useState<Chain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/chains")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Chain[]) => {
        setChains(data);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  return (
    <ChainsContext.Provider value={{ chains, loading, error }}>
      {children}
    </ChainsContext.Provider>
  );
}

export function useChainsContext() {
  return useContext(ChainsContext);
}
