import type {
  OverviewMetric,
  SessionDataPoint,
  TrafficSource,
  TopPage,
  DeviceData,
  GeoData,
  ConversionData,
} from "@/types/analytics";

export const overviewMetrics: OverviewMetric[] = [
  {
    label: "Total Sessions",
    value: "124,532",
    change: 12.4,
    changeLabel: "vs last period",
    icon: "activity",
  },
  {
    label: "Total Users",
    value: "89,741",
    change: 8.7,
    changeLabel: "vs last period",
    icon: "users",
  },
  {
    label: "Pageviews",
    value: "342,891",
    change: 15.2,
    changeLabel: "vs last period",
    icon: "eye",
  },
  {
    label: "Bounce Rate",
    value: "42.3%",
    change: -3.1,
    changeLabel: "vs last period",
    icon: "trending-down",
  },
  {
    label: "Avg. Session Duration",
    value: "3m 24s",
    change: 5.8,
    changeLabel: "vs last period",
    icon: "clock",
  },
  {
    label: "Pages / Session",
    value: "2.75",
    change: 2.3,
    changeLabel: "vs last period",
    icon: "layers",
  },
];

function generateSessionData(days: number): SessionDataPoint[] {
  const data: SessionDataPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 3800 + Math.floor(Math.random() * 1200);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sessions: base,
      users: Math.floor(base * 0.72),
      pageviews: Math.floor(base * 2.75),
    });
  }
  return data;
}

export const sessionData30 = generateSessionData(30);
export const sessionData14 = generateSessionData(14);
export const sessionData7 = generateSessionData(7);

export const trafficSources: TrafficSource[] = [
  { name: "Organic Search", value: 45800, color: "#4F46E5" },
  { name: "Direct", value: 28300, color: "#06B6D4" },
  { name: "Social Media", value: 18700, color: "#10B981" },
  { name: "Referral", value: 12400, color: "#F59E0B" },
  { name: "Email", value: 9800, color: "#EF4444" },
  { name: "Paid Search", value: 9532, color: "#8B5CF6" },
];

export const topPages: TopPage[] = [
  {
    page: "/",
    pageviews: 48321,
    uniquePageviews: 39240,
    avgTimeOnPage: "2m 14s",
    bounceRate: "38.2%",
  },
  {
    page: "/services",
    pageviews: 31540,
    uniquePageviews: 26710,
    avgTimeOnPage: "3m 42s",
    bounceRate: "29.4%",
  },
  {
    page: "/blog",
    pageviews: 28900,
    uniquePageviews: 24100,
    avgTimeOnPage: "4m 18s",
    bounceRate: "22.1%",
  },
  {
    page: "/about",
    pageviews: 21430,
    uniquePageviews: 18320,
    avgTimeOnPage: "1m 58s",
    bounceRate: "44.7%",
  },
  {
    page: "/contact",
    pageviews: 16780,
    uniquePageviews: 14900,
    avgTimeOnPage: "2m 31s",
    bounceRate: "35.6%",
  },
  {
    page: "/blog/seo-tips-2024",
    pageviews: 14220,
    uniquePageviews: 12890,
    avgTimeOnPage: "5m 47s",
    bounceRate: "18.3%",
  },
  {
    page: "/pricing",
    pageviews: 12100,
    uniquePageviews: 10800,
    avgTimeOnPage: "3m 05s",
    bounceRate: "31.9%",
  },
  {
    page: "/portfolio",
    pageviews: 9870,
    uniquePageviews: 8640,
    avgTimeOnPage: "4m 22s",
    bounceRate: "26.5%",
  },
];

export const deviceData: DeviceData[] = [
  { device: "Desktop", sessions: 61200, percentage: 49.2 },
  { device: "Mobile", sessions: 52400, percentage: 42.1 },
  { device: "Tablet", sessions: 10932, percentage: 8.7 },
];

export const geoData: GeoData[] = [
  { country: "United States", sessions: 42300, users: 31200, bounceRate: "38.4%" },
  { country: "United Kingdom", sessions: 18700, users: 14100, bounceRate: "41.2%" },
  { country: "Canada", sessions: 12400, users: 9800, bounceRate: "39.7%" },
  { country: "Australia", sessions: 9800, users: 7600, bounceRate: "43.1%" },
  { country: "Germany", sessions: 7200, users: 5900, bounceRate: "45.8%" },
  { country: "India", sessions: 6900, users: 5400, bounceRate: "52.3%" },
  { country: "France", sessions: 5400, users: 4200, bounceRate: "44.6%" },
  { country: "Netherlands", sessions: 4100, users: 3300, bounceRate: "40.9%" },
];

export const conversionData: ConversionData[] = [
  {
    goalName: "Contact Form Submitted",
    completions: 1842,
    conversionRate: "1.48%",
    goalValue: "$18,420",
  },
  {
    goalName: "Newsletter Signup",
    completions: 3210,
    conversionRate: "2.58%",
    goalValue: "$9,630",
  },
  {
    goalName: "Free Trial Started",
    completions: 724,
    conversionRate: "0.58%",
    goalValue: "$36,200",
  },
  {
    goalName: "Purchase Completed",
    completions: 312,
    conversionRate: "0.25%",
    goalValue: "$62,400",
  },
];
