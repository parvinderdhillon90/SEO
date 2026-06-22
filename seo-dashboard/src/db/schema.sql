-- Analytics Central Dashboard — PostgreSQL Schema
-- Run this once against your database to create all tables.

CREATE TABLE IF NOT EXISTS chains (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  short_name TEXT NOT NULL,
  color     TEXT NOT NULL,
  bg_color  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS properties (
  id            TEXT PRIMARY KEY,
  chain_id      TEXT NOT NULL REFERENCES chains(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  location      TEXT NOT NULL,
  ga_property_id TEXT,
  website       TEXT
);

-- One row per property per sync date (updated nightly by GA4 sync job)
CREATE TABLE IF NOT EXISTS property_metrics (
  property_id                  TEXT    NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  recorded_at                  DATE    NOT NULL DEFAULT CURRENT_DATE,
  organic_traffic_current      INT     NOT NULL DEFAULT 0,
  organic_vs_last_month_pct    NUMERIC(7,2) NOT NULL DEFAULT 0,
  organic_vs_last_year_pct     NUMERIC(7,2) NOT NULL DEFAULT 0,
  total_traffic_current        INT     NOT NULL DEFAULT 0,
  total_vs_last_month_pct      NUMERIC(7,2) NOT NULL DEFAULT 0,
  total_vs_last_year_pct       NUMERIC(7,2) NOT NULL DEFAULT 0,
  new_users_pct                INT     NOT NULL DEFAULT 0,
  returning_users_pct          INT     NOT NULL DEFAULT 0,
  bounce_rate                  NUMERIC(5,2) NOT NULL DEFAULT 0,
  conversion_rate              NUMERIC(5,2) NOT NULL DEFAULT 0,
  room_nights                  INT     NOT NULL DEFAULT 0,
  revenue                      NUMERIC(14,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (property_id, recorded_at)
);

CREATE TABLE IF NOT EXISTS competitor_domains (
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  domain      TEXT NOT NULL,
  PRIMARY KEY (property_id, domain)
);

-- Keyword targets per property
CREATE TABLE IF NOT EXISTS keywords (
  id          TEXT PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  keyword     TEXT NOT NULL,
  search_volume INT NOT NULL DEFAULT 0,
  target_url  TEXT NOT NULL DEFAULT '/'
);

-- One row per keyword per sync date (updated nightly by Search Console sync job)
CREATE TABLE IF NOT EXISTS keyword_rankings (
  keyword_id    TEXT NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  recorded_at   DATE NOT NULL DEFAULT CURRENT_DATE,
  current_rank  INT,
  previous_rank INT,
  PRIMARY KEY (keyword_id, recorded_at)
);

-- Competitor position per keyword per domain per sync date
CREATE TABLE IF NOT EXISTS competitor_rankings (
  keyword_id  TEXT NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  domain      TEXT NOT NULL,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  rank        INT,
  PRIMARY KEY (keyword_id, domain, recorded_at)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_properties_chain_id ON properties(chain_id);
CREATE INDEX IF NOT EXISTS idx_property_metrics_date ON property_metrics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_property_id ON keywords(property_id);
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_date ON keyword_rankings(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_competitor_rankings_date ON competitor_rankings(recorded_at DESC);
