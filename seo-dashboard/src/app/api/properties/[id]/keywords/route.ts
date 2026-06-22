import { NextResponse } from "next/server";
import type { KeywordRanking } from "@/types/dashboard";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: propertyId } = await params;

  // Fall back to mock data when DATABASE_URL is not configured
  if (!process.env.DATABASE_URL) {
    const { chains } = await import("@/lib/mockData");
    const prop = chains.flatMap((c) => c.properties).find((p) => p.id === propertyId);
    if (!prop) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(prop.keywords);
  }

  try {
    const { db } = await import("@/lib/db");
    const client = await db.connect();
    try {
      // Get keywords with latest rankings
      const kwRes = await client.query(
        `SELECT
           k.id, k.keyword, k.search_volume, k.target_url,
           kr.current_rank, kr.previous_rank
         FROM keywords k
         LEFT JOIN LATERAL (
           SELECT current_rank, previous_rank
           FROM keyword_rankings
           WHERE keyword_id = k.id
           ORDER BY recorded_at DESC
           LIMIT 1
         ) kr ON true
         WHERE k.property_id = $1
         ORDER BY k.search_volume DESC`,
        [propertyId]
      );

      if (kwRes.rows.length === 0) {
        return NextResponse.json([]);
      }

      const keywordIds = kwRes.rows.map((r) => r.id);

      // Get latest competitor rankings for these keywords
      const compRes = await client.query(
        `SELECT DISTINCT ON (keyword_id, domain) keyword_id, domain, rank
         FROM competitor_rankings
         WHERE keyword_id = ANY($1::text[])
         ORDER BY keyword_id, domain, recorded_at DESC`,
        [keywordIds]
      );

      // Group competitor ranks by keyword_id
      const compsByKw: Record<string, { domain: string; rank: number | null }[]> = {};
      for (const r of compRes.rows) {
        (compsByKw[r.keyword_id] ??= []).push({ domain: r.domain, rank: r.rank ?? null });
      }

      const keywords: KeywordRanking[] = kwRes.rows.map((r) => {
        const cur  = r.current_rank  != null ? +r.current_rank  : null;
        const prev = r.previous_rank != null ? +r.previous_rank : null;
        return {
          id: r.id,
          keyword: r.keyword,
          searchVolume: +r.search_volume,
          currentRank:  cur,
          previousRank: prev,
          rankChange:   cur != null && prev != null ? prev - cur : null,
          targetUrl:    r.target_url,
          competitors:  compsByKw[r.id] ?? [],
        };
      });

      return NextResponse.json(keywords);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[/api/properties/[id]/keywords]", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
