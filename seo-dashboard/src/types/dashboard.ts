export type PropertyStatus = "critical" | "warning" | "healthy";

export interface TrafficMetric {
  current: number;
  vsLastMonthPct: number;
  vsLastYearPct: number;
}

export interface PropertyMetrics {
  organicTraffic: TrafficMetric;
  totalTraffic: TrafficMetric;
  newUsersPct: number;
  returningUsersPct: number;
  bounceRate: number;
  conversionRate: number;
  roomNights: number;
  revenue: number;
}

export interface Competitor {
  domain: string;
  rank: number | null;
}

export interface KeywordRanking {
  id: string;
  keyword: string;
  searchVolume: number;
  currentRank: number | null;
  previousRank: number | null;
  rankChange: number | null;
  targetUrl: string;
  competitors: Competitor[];
}

export interface Property {
  id: string;
  chainId: string;
  name: string;
  location: string;
  gaPropertyId: string;
  website: string;
  status: PropertyStatus;
  metrics: PropertyMetrics;
  keywords: KeywordRanking[];
  competitorDomains: string[];
}

export interface ChainMetrics {
  organicTraffic: TrafficMetric;
  totalTraffic: TrafficMetric;
  avgBounceRate: number;
  avgConversionRate: number;
  totalRoomNights: number;
  totalRevenue: number;
  avgNewUsersPct: number;
  criticalCount: number;
  warningCount: number;
  healthyCount: number;
}

export interface Chain {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  properties: Property[];
  metrics: ChainMetrics;
}

export type DateRangeKey = "7d" | "14d" | "30d" | "90d";
