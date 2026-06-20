export interface OverviewMetric {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface SessionDataPoint {
  date: string;
  sessions: number;
  users: number;
  pageviews: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface TopPage {
  page: string;
  pageviews: number;
  uniquePageviews: number;
  avgTimeOnPage: string;
  bounceRate: string;
}

export interface DeviceData {
  device: string;
  sessions: number;
  percentage: number;
}

export interface GeoData {
  country: string;
  sessions: number;
  users: number;
  bounceRate: string;
}

export interface ConversionData {
  goalName: string;
  completions: number;
  conversionRate: string;
  goalValue: string;
}

export interface DateRange {
  label: string;
  days: number;
}
