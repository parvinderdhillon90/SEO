import { NextResponse } from "next/server";
import type { Chain, Property, PropertyStatus, ChainMetrics } from "@/types/dashboard";

function computeStatus(vsLM: number, vsLY: number): PropertyStatus {
  if (vsLM < -10 || vsLY < -15) return "critical";
  if (vsLM < -4 || vsLY < -7) return "warning";
  return "healthy";
}

function computeChainMetrics(properties: Property[]): ChainMetrics {
  const n = properties.length;
  if (n === 0) {
    return {
      organicTraffic: { current: 0, vsLastMonthPct: 0, vsLastYearPct: 0 },
      totalTraffic: { current: 0, vsLastMonthPct: 0, vsLastYearPct: 0 },
      avgBounceRate: 0, avgConversionRate: 0,
      totalRoomNights: 0, totalRevenue: 0, avgNewUsersPct: 0,
      criticalCount: 0, warningCount: 0, healthyCount: 0,
    };
  }
  const totOrgCur = properties.reduce((s, p) => s + p.metrics.organicTraffic.current, 0);
  const totOrgLM  = properties.reduce((s, p) => s + p.metrics.organicTraffic.current / (1 + p.metrics.organicTraffic.vsLastMonthPct / 100), 0);
  const totOrgLY  = properties.reduce((s, p) => s + p.metrics.organicTraffic.current / (1 + p.metrics.organicTraffic.vsLastYearPct / 100), 0);
  const totTotCur = properties.reduce((s, p) => s + p.metrics.totalTraffic.current, 0);
  const totTotLM  = properties.reduce((s, p) => s + p.metrics.totalTraffic.current / (1 + p.metrics.totalTraffic.vsLastMonthPct / 100), 0);
  const totTotLY  = properties.reduce((s, p) => s + p.metrics.totalTraffic.current / (1 + p.metrics.totalTraffic.vsLastYearPct / 100), 0);
  return {
    organicTraffic: {
      current: totOrgCur,
      vsLastMonthPct: Math.round(((totOrgCur - totOrgLM) / totOrgLM) * 1000) / 10,
      vsLastYearPct:  Math.round(((totOrgCur - totOrgLY) / totOrgLY) * 1000) / 10,
    },
    totalTraffic: {
      current: totTotCur,
      vsLastMonthPct: Math.round(((totTotCur - totTotLM) / totTotLM) * 1000) / 10,
      vsLastYearPct:  Math.round(((totTotCur - totTotLY) / totTotLY) * 1000) / 10,
    },
    avgBounceRate:     Math.round((properties.reduce((s, p) => s + p.metrics.bounceRate, 0) / n) * 10) / 10,
    avgConversionRate: Math.round((properties.reduce((s, p) => s + p.metrics.conversionRate, 0) / n) * 10) / 10,
    totalRoomNights:   properties.reduce((s, p) => s + p.metrics.roomNights, 0),
    totalRevenue:      properties.reduce((s, p) => s + p.metrics.revenue, 0),
    avgNewUsersPct:    Math.round(properties.reduce((s, p) => s + p.metrics.newUsersPct, 0) / n),
    criticalCount:     properties.filter((p) => p.status === "critical").length,
    warningCount:      properties.filter((p) => p.status === "warning").length,
    healthyCount:      properties.filter((p) => p.status === "healthy").length,
  };
}

export async function GET() {
  // Fall back to mock data when DATABASE_URL is not configured
  if (!process.env.DATABASE_URL) {
    const { chains } = await import("@/lib/mockData");
    return NextResponse.json(chains);
  }

  try {
    const { db } = await import("@/lib/db");
    const client = await db.connect();
    try {
      const [chainsRes, propsRes, compsRes] = await Promise.all([
        client.query("SELECT id, name, short_name, color, bg_color FROM chains ORDER BY name"),
        client.query(`
          SELECT
            p.id, p.chain_id, p.name, p.location,
            COALESCE(p.ga_property_id, '') AS ga_property_id,
            COALESCE(p.website, '')         AS website,
            COALESCE(pm.organic_traffic_current, 0)   AS organic_current,
            COALESCE(pm.organic_vs_last_month_pct, 0) AS organic_vs_lm,
            COALESCE(pm.organic_vs_last_year_pct,  0) AS organic_vs_ly,
            COALESCE(pm.total_traffic_current, 0)     AS total_current,
            COALESCE(pm.total_vs_last_month_pct, 0)   AS total_vs_lm,
            COALESCE(pm.total_vs_last_year_pct,  0)   AS total_vs_ly,
            COALESCE(pm.new_users_pct, 0)             AS new_users_pct,
            COALESCE(pm.returning_users_pct, 0)       AS returning_users_pct,
            COALESCE(pm.bounce_rate, 0)               AS bounce_rate,
            COALESCE(pm.conversion_rate, 0)           AS conversion_rate,
            COALESCE(pm.room_nights, 0)               AS room_nights,
            COALESCE(pm.revenue, 0)                   AS revenue
          FROM properties p
          LEFT JOIN LATERAL (
            SELECT * FROM property_metrics
            WHERE property_id = p.id
            ORDER BY recorded_at DESC
            LIMIT 1
          ) pm ON true
          ORDER BY p.chain_id, p.name
        `),
        client.query("SELECT property_id, domain FROM competitor_domains ORDER BY property_id"),
      ]);

      // Group competitor domains by property
      const compsByProp: Record<string, string[]> = {};
      for (const row of compsRes.rows) {
        (compsByProp[row.property_id] ??= []).push(row.domain);
      }

      // Build properties grouped by chain
      const propsByChain: Record<string, Property[]> = {};
      for (const r of propsRes.rows) {
        const vsLM = parseFloat(r.organic_vs_lm);
        const vsLY = parseFloat(r.organic_vs_ly);
        const prop: Property = {
          id: r.id,
          chainId: r.chain_id,
          name: r.name,
          location: r.location,
          gaPropertyId: r.ga_property_id,
          website: r.website,
          status: computeStatus(vsLM, vsLY),
          metrics: {
            organicTraffic: { current: +r.organic_current, vsLastMonthPct: vsLM, vsLastYearPct: parseFloat(r.organic_vs_ly) },
            totalTraffic:   { current: +r.total_current,   vsLastMonthPct: parseFloat(r.total_vs_lm), vsLastYearPct: parseFloat(r.total_vs_ly) },
            newUsersPct:        +r.new_users_pct,
            returningUsersPct:  +r.returning_users_pct,
            bounceRate:         parseFloat(r.bounce_rate),
            conversionRate:     parseFloat(r.conversion_rate),
            roomNights:         +r.room_nights,
            revenue:            parseFloat(r.revenue),
          },
          keywords: [],
          competitorDomains: compsByProp[r.id] ?? [],
        };
        (propsByChain[r.chain_id] ??= []).push(prop);
      }

      // Assemble chains
      const chains: Chain[] = chainsRes.rows.map((r) => {
        const properties = propsByChain[r.id] ?? [];
        return {
          id: r.id,
          name: r.name,
          shortName: r.short_name,
          color: r.color,
          bgColor: r.bg_color,
          properties,
          metrics: computeChainMetrics(properties),
        };
      });

      return NextResponse.json(chains);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[/api/chains]", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
