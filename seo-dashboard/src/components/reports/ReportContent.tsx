"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Download,
  Copy,
  Check,
} from "lucide-react";
import type { Chain, Property } from "@/types/dashboard";

interface ReportContentProps {
  chain: Chain;
  property?: Property;
}

function generateCrux(chain: Chain, property?: Property): {
  executive: string;
  traffic: string;
  keywords: string;
  conversions: string;
  recommendations: { priority: "high" | "medium" | "low"; text: string }[];
} {
  const m = property ? property.metrics : chain.metrics;
  const name = property ? property.name : chain.name;

  const orgVsLM = property
    ? (property.metrics.organicTraffic.vsLastMonthPct ?? 0)
    : chain.metrics.organicTraffic.vsLastMonthPct;
  const orgVsLY = property
    ? (property.metrics.organicTraffic.vsLastYearPct ?? 0)
    : chain.metrics.organicTraffic.vsLastYearPct;

  const isChainLevel = !property;
  const critCount = isChainLevel ? chain.metrics.criticalCount : 0;
  const warnCount = isChainLevel ? chain.metrics.warningCount : 0;

  const orgDir = orgVsLM < 0 ? "decreased" : "increased";
  const orgLYDir = orgVsLY < 0 ? "decreased" : "increased";

  const bounceRate = property ? property.metrics.bounceRate : chain.metrics.avgBounceRate;
  const convRate = property ? property.metrics.conversionRate : chain.metrics.avgConversionRate;

  // Keywords summary (for property)
  let kwImproved = 0, kwDeclined = 0, kwTop10 = 0;
  if (property) {
    kwImproved = property.keywords.filter((k) => k.rankChange !== null && k.rankChange > 0).length;
    kwDeclined = property.keywords.filter((k) => k.rankChange !== null && k.rankChange < 0).length;
    kwTop10 = property.keywords.filter((k) => k.currentRank !== null && k.currentRank <= 10).length;
  }

  const executive = property
    ? `${name} has seen organic traffic ${orgDir} by ${Math.abs(orgVsLM).toFixed(1)}% vs last month and ${orgLYDir} by ${Math.abs(orgVsLY).toFixed(1)}% vs the same period last year. The property is currently ranked as "${property.status}" based on traffic trajectory. ${orgVsLM < -10 ? "Immediate corrective action is recommended to recover lost organic visibility." : orgVsLM > 5 ? "The property is trending positively — efforts should be maintained and scaled." : "Performance is stable with room for improvement."}`
    : `${name} encompasses ${chain.properties.length} properties across multiple markets. Overall organic traffic has ${orgDir} by ${Math.abs(orgVsLM).toFixed(1)}% vs last month and ${orgLYDir} by ${Math.abs(orgVsLY).toFixed(1)}% year-over-year. ${critCount > 0 ? `${critCount} propert${critCount === 1 ? "y" : "ies"} are in critical condition and require immediate attention.` : ""} ${warnCount > 0 ? `${warnCount} additional propert${warnCount === 1 ? "y" : "ies"} show warning signals.` : ""}`;

  const traffic = property
    ? `Organic traffic stands at ${property.metrics.organicTraffic.current.toLocaleString()} sessions. Total traffic including all channels is ${property.metrics.totalTraffic.current.toLocaleString()} sessions. ${property.metrics.newUsersPct}% of users are new visitors, with ${property.metrics.returningUsersPct}% returning. Bounce rate is ${bounceRate}% — ${bounceRate > 55 ? "this is elevated and suggests landing page or content quality issues." : bounceRate > 45 ? "moderate, with opportunity to improve content engagement." : "this is healthy, indicating strong content relevance."}`
    : `Aggregate organic traffic across all properties is ${chain.metrics.organicTraffic.current.toLocaleString()} sessions. Total traffic is ${chain.metrics.totalTraffic.current.toLocaleString()} sessions. ${chain.metrics.avgNewUsersPct}% average new user rate indicates ${chain.metrics.avgNewUsersPct > 75 ? "strong awareness-stage acquisition but potential brand loyalty challenges." : "a healthy mix of acquisition and retention."} Portfolio average bounce rate of ${bounceRate}% ${bounceRate > 50 ? "warrants investigation across underperforming properties." : "is within acceptable range."}`;

  const keywords = property
    ? `Out of ${property.keywords.length} tracked keywords for this property, ${kwImproved} have improved in ranking, ${kwDeclined} have declined, and ${kwTop10} are currently in the top 10 results. ${kwDeclined > kwImproved ? "More keywords are declining than improving — a technical SEO audit and content refresh are recommended." : "Keyword momentum is positive overall."} Priority focus should be on converting page 2 rankings to page 1 positions.`
    : `Keyword rankings vary significantly across the portfolio. Properties with critical or warning status typically show correlated keyword rank drops. A portfolio-wide technical SEO audit is recommended to identify systemic issues affecting rankings. Competitor analysis shows opportunities in long-tail local search terms.`;

  const conversions = property
    ? `The conversion rate of ${convRate}% results in ${property.metrics.roomNights} room nights booked directly through the website, generating $${property.metrics.revenue.toLocaleString()} in direct booking revenue. ${convRate < 2 ? "Conversion rate is below the 2% industry benchmark — A/B testing the booking flow and rate parity messaging could yield significant uplift." : convRate > 3 ? "Conversion rate is above industry average — focus on driving more qualified traffic to capitalise on this strong conversion funnel." : "Conversion rate is at industry benchmark."}`
    : `Total direct booking revenue across the chain is $${chain.metrics.totalRevenue.toLocaleString()}, representing ${chain.metrics.totalRoomNights} room nights. The portfolio average conversion rate of ${convRate}% ${convRate < 2 ? "is below the 2% hospitality benchmark, suggesting booking flow or rate parity issues across multiple properties." : "is at or above industry benchmark."} Properties with higher bounce rates consistently show lower conversion rates, confirming the need to address content and UX issues.`;

  const recs: { priority: "high" | "medium" | "low"; text: string }[] = [];

  if (property) {
    if (property.status === "critical") {
      recs.push({ priority: "high", text: `Conduct an emergency technical SEO audit for ${name} — check for algorithm penalty, indexing issues, or recent site changes that may have triggered the traffic drop.` });
      recs.push({ priority: "high", text: "Review Google Search Console for any manual actions, Core Web Vitals failures, or sudden crawl errors. Address immediately." });
    }
    if (orgVsLM < -5 || orgVsLY < -10) {
      recs.push({ priority: "high", text: "Refresh content on top organic landing pages with updated information, improved keyword density, and enhanced E-E-A-T signals." });
    }
    if (bounceRate > 50) {
      recs.push({ priority: "medium", text: `Bounce rate of ${bounceRate}% indicates visitor dissatisfaction. Improve page load speed, mobile responsiveness, and above-the-fold content on key landing pages.` });
    }
    if (convRate < 2) {
      recs.push({ priority: "medium", text: "A/B test the booking engine entry point, room rate displays, and trust signals (reviews, awards) to improve conversion from organic traffic." });
    }
    recs.push({ priority: "medium", text: `Focus link building efforts on the ${property.keywords.filter((k) => k.currentRank !== null && k.currentRank > 10 && k.currentRank <= 20).length} keywords currently on page 2 — these are closest to generating page 1 traffic.` });
    recs.push({ priority: "low", text: "Implement a structured data markup (Hotel, Offer, LocalBusiness) to improve rich snippet visibility in search results." });
    recs.push({ priority: "low", text: "Ensure Google Business Profile is fully optimised with recent photos, updated amenities, and regular posts to support local organic visibility." });
  } else {
    if (critCount > 0) {
      recs.push({ priority: "high", text: `Immediate intervention required for ${critCount} critical propert${critCount === 1 ? "y" : "ies"}. Assign dedicated SEO resources and conduct forensic audits within 48 hours.` });
    }
    if (warnCount > 0) {
      recs.push({ priority: "high", text: `${warnCount} properties showing warning signals — schedule technical reviews before these escalate to critical status.` });
    }
    recs.push({ priority: "medium", text: "Standardise SEO on-page templates across all properties — consistent title tag, meta description, and header structures will improve overall portfolio performance." });
    recs.push({ priority: "medium", text: "Identify top-performing properties and document their SEO practices as case studies to replicate across the portfolio." });
    recs.push({ priority: "medium", text: `Invest in brand keyword protection for properties with high new-user percentages (${chain.metrics.avgNewUsersPct}%+ new visitors) to prevent competitor conquesting.` });
    recs.push({ priority: "low", text: "Build a cross-property internal linking strategy that channels authority from high-traffic properties to lower-performing ones within the same chain." });
    recs.push({ priority: "low", text: "Develop a portfolio-wide content calendar aligned with peak booking seasons to maximise organic traffic during high-demand periods." });
  }

  return { executive, traffic, keywords, conversions, recommendations: recs };
}

export default function ReportContent({ chain, property }: ReportContentProps) {
  const [copied, setCopied] = useState(false);
  const crux = generateCrux(chain, property);
  const title = property ? property.name : chain.name;

  const handleCopy = () => {
    const text = [
      `# SEO Performance Report: ${title}`,
      `Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
      "",
      "## Executive Summary",
      crux.executive,
      "",
      "## Traffic Analysis",
      crux.traffic,
      "",
      "## Keyword Performance",
      crux.keywords,
      "",
      "## Conversion Performance",
      crux.conversions,
      "",
      "## Recommendations",
      ...crux.recommendations.map((r, i) => `${i + 1}. [${r.priority.toUpperCase()}] ${r.text}`),
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    window.print();
  };

  const priorityConfig = {
    high: { bg: "bg-red-50", text: "text-red-600", badge: "bg-red-100 text-red-700", icon: AlertTriangle },
    medium: { bg: "bg-amber-50", text: "text-amber-600", badge: "bg-amber-100 text-amber-700", icon: TrendingUp },
    low: { bg: "bg-blue-50", text: "text-blue-500", badge: "bg-blue-100 text-blue-700", icon: CheckCircle },
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">SEO Performance Report</p>
            <h2 className="text-2xl font-bold">{title}</h2>
            {property && (
              <p className="text-indigo-300 text-sm mt-1">{chain.name} · {property.location}</p>
            )}
            <p className="text-indigo-300 text-xs mt-2">
              Generated:{" "}
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Quick metrics */}
        {property && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Organic Traffic", value: property.metrics.organicTraffic.current.toLocaleString() },
              { label: "vs Last Month", value: `${property.metrics.organicTraffic.vsLastMonthPct > 0 ? "+" : ""}${property.metrics.organicTraffic.vsLastMonthPct.toFixed(1)}%` },
              { label: "Conv. Rate", value: `${property.metrics.conversionRate}%` },
              { label: "Revenue", value: `$${(property.metrics.revenue / 1000).toFixed(0)}k` },
            ].map((m) => (
              <div key={m.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-indigo-200 text-xs">{m.label}</p>
                <p className="text-white font-bold text-lg mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sections */}
      {[
        { title: "Executive Summary", content: crux.executive, icon: "📋" },
        { title: "Traffic Analysis", content: crux.traffic, icon: "📈" },
        { title: "Keyword Performance", content: crux.keywords, icon: "🔑" },
        { title: "Conversion Performance", content: crux.conversions, icon: "🎯" },
      ].map((section) => (
        <div key={section.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>{section.icon}</span>
            {section.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
        </div>
      ))}

      {/* Recommendations */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>✅</span> Recommendations & Action Plan
        </h3>
        <div className="space-y-3">
          {crux.recommendations.map((rec, i) => {
            const cfg = priorityConfig[rec.priority];
            const Icon = cfg.icon;
            return (
              <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${cfg.bg}`}>
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.text}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${cfg.badge}`}>
                      {rec.priority} priority
                    </span>
                    <span className="text-xs text-gray-400">Action {i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{rec.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
