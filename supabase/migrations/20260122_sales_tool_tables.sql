-- Sales Tool Tables
-- Run this SQL in your Supabase dashboard: SQL Editor > New Query

-- Editable scripts (overrides for default scripts)
CREATE TABLE IF NOT EXISTS sales_scripts (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation flows (for future use)
CREATE TABLE IF NOT EXISTS sales_flows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  segment TEXT,
  steps JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prospect pipeline
CREATE TABLE IF NOT EXISTS sales_prospects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL, -- 'reddit', 'yelp', 'manual'
  source_url TEXT,
  business_name TEXT,
  website TEXT,
  industry TEXT,
  location TEXT,
  score INTEGER, -- 1-100 fit score
  status TEXT DEFAULT 'found', -- found, engaged, responded, converted, rejected
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_prospects_status ON sales_prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospects_source ON sales_prospects(source);
CREATE INDEX IF NOT EXISTS idx_prospects_industry ON sales_prospects(industry);
CREATE INDEX IF NOT EXISTS idx_prospects_created ON sales_prospects(created_at DESC);

-- No RLS needed - sales tool is password-protected at the app level, not user-specific
