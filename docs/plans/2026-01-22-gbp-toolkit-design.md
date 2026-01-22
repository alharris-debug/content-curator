# GBP Toolkit Design

**Date:** 2026-01-22
**Status:** Draft
**Pricing:** $15/month add-on (feature flag)

## Overview

Add Google Business Profile management tools to content-curator, enabling agencies and freelancers to manage their clients' GBP listings directly within the app. This extends the existing value proposition from content generation to full GBP profile management.

## Features

1. **Google Account Connection** - OAuth flow to connect user's Google account with GBP access
2. **Location Linking** - Map GBP locations to existing clients
3. **Profile Description Tool** - AI-generated descriptions based on website + optional inputs
4. **Services Scanner** - Read current GBP services, detect what's listed (or missing)
5. **Services Generator** - AI-created service entries with descriptions
6. **Services Comparison** - Compare GBP services vs website services, flag discrepancies
7. **Fix Discrepancies** - Quick actions to add missing services, update descriptions, remove outdated entries

## User Flow

### Unlocking the Feature

Users see "GBP Toolkit" as an available add-on in Settings (or via upsell prompt on client view). Clicking "Add GBP Toolkit" triggers Stripe checkout for +$15/month. On success, `gbp_toolkit_enabled` flag is set on their subscription record.

### Connecting Google (One-Time per Account)

Once enabled, users see "Connect Google Account" button in Settings or when first accessing GBP tools. This initiates Google OAuth with Business Profile API scopes. Tokens stored securely in Supabase via edge function.

### Linking GBP Locations to Clients

After Google is connected, users go to a client and see a "GBP" tab. Clicking shows dropdown of GBP locations their account can access. They select which location maps to this client.

### Accessing Tools

Once linked, the GBP tab shows the full toolkit:
- Profile description tool
- Services scanner
- Services comparison (vs website)
- Quick actions to fix discrepancies

## Database Schema

### New Tables

```sql
-- Stores Google OAuth credentials per user
create table google_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamptz not null,
  google_email text,
  connected_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- Links clients to GBP locations
create table client_gbp_links (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients not null,
  google_connection_id uuid references google_connections not null,
  gbp_location_id text not null,
  gbp_location_name text,
  linked_at timestamptz default now(),
  unique(client_id)
);

-- Stores scan history for audit trail and caching
create table gbp_snapshots (
  id uuid primary key default gen_random_uuid(),
  client_gbp_link_id uuid references client_gbp_links not null,
  snapshot_type text not null check (snapshot_type in ('profile', 'services')),
  data jsonb not null,
  created_at timestamptz default now()
);

-- RLS policies (users can only access their own data)
alter table google_connections enable row level security;
create policy "Users can manage own connections" on google_connections
  for all using (auth.uid() = user_id);

alter table client_gbp_links enable row level security;
create policy "Users can manage own client links" on client_gbp_links
  for all using (
    client_id in (select id from clients where user_id = auth.uid())
  );

alter table gbp_snapshots enable row level security;
create policy "Users can view own snapshots" on gbp_snapshots
  for all using (
    client_gbp_link_id in (
      select cgl.id from client_gbp_links cgl
      join clients c on c.id = cgl.client_id
      where c.user_id = auth.uid()
    )
  );
```

### Modifications to Existing Tables

```sql
alter table subscriptions
add column gbp_toolkit_enabled boolean default false;
```

## Backend Architecture (Edge Functions)

### New Edge Functions

```
supabase/functions/
├── google-auth-callback/
│   └── Handles OAuth redirect, exchanges code for tokens, stores in DB
│
├── google-refresh-token/
│   └── Refreshes expired access tokens (called automatically)
│
├── gbp-list-locations/
│   └── Returns all GBP locations the user's Google account can access
│
├── gbp-get-profile/
│   └── Fetches profile data (description, categories, etc.)
│
├── gbp-update-profile/
│   └── Updates profile description
│
├── gbp-get-services/
│   └── Fetches current services for a location
│
├── gbp-update-services/
│   └── Adds/updates/removes services
│
└── gbp-ai-generate/
    └── AI operations (description generation, service comparison)
    └── Calls Claude API, references client website data
```

### Auth Flow

1. Frontend initiates OAuth → redirects to Google
2. Google redirects to callback URL
3. `google-auth-callback` edge function receives code, exchanges for tokens
4. Tokens stored encrypted in `google_connections`
5. Frontend notified of success, fetches available locations

### Token Management

Edge functions check `token_expires_at` before each GBP API call. If expired, `google-refresh-token` runs first. Handle revocation gracefully (prompt user to reconnect).

## Frontend Components

### New Components

```
src/components/gbp/
├── GbpConnectionStatus.jsx    # Shows connected email or "Connect" button
├── GbpLocationSelector.jsx    # Dropdown of available locations
├── GbpToolkit.jsx             # Main container for all GBP tools
├── GbpProfileTool.jsx         # Current description, AI generate, edit & save
├── GbpServicesTool.jsx        # List services, add/edit/remove, AI generate
├── GbpComparisonTool.jsx      # Side-by-side comparison, quick-fix buttons
└── GbpPaywall.jsx             # Upsell prompt when feature not enabled
```

### Integration Points

- **Settings page**: Add `GbpConnectionStatus` in new "Integrations" section
- **Client detail view**: Add "GBP" tab rendering `GbpToolkit` or `GbpPaywall`
- **SubscriptionContext**: Expose `gbpToolkitEnabled` boolean

## AI Generation Logic

### Profile Description Generation

Inputs:
- Client's website content (already scraped)
- Current GBP description (if any)
- Optional user instructions
- Character limit (750 chars)

```
You are writing a Google Business Profile description for {business_name}.

Website content: {scraped_content}
Current description: {current_description or "None"}
User instructions: {instructions or "None"}

Requirements:
- Max 750 characters
- No promotional language (Google policy)
- Include key services and location if relevant
- Natural, professional tone matching brand voice: {brand_voice}

Generate a compelling business description.
```

### Services Comparison

1. AI identifies semantic matches (e.g., "AC Repair" ≈ "Air Conditioning Repair")
2. Flags: missing from GBP, missing from website, description mismatches
3. Returns structured JSON with recommendations

### Service Description Generation

- Takes service name + website context
- Generates 120-char description (GBP limit)
- Maintains consistent tone across all services

All AI responses return structured JSON for easy frontend rendering.

## Error Handling

### Google Connection Issues

| Scenario | Handling |
|----------|----------|
| OAuth denied/cancelled | Return to settings, show "Connection cancelled" |
| Token refresh fails | Mark as "needs reconnection", prompt user |
| Account loses GBP access | Show error on affected clients, suggest relinking |
| Rate limits | Retry with exponential backoff |

### GBP API Errors

| Scenario | Handling |
|----------|----------|
| Location not found | Unlink from client, prompt to select different location |
| Permission denied | Show "Access revoked", suggest reconnecting |
| Update fails (validation) | Show Google's error, let user correct and retry |
| Description too long | Truncate with warning, or regenerate stricter |

### Subscription Edge Cases

| Scenario | Handling |
|----------|----------|
| User cancels subscription | `gbp_toolkit_enabled` → false via webhook, show paywall |
| Payment fails for add-on | 3-day grace period, then disable |

## Deployment Plan

### Phase 1: Environment Setup
1. Create feature branch `feature/gbp-toolkit`
2. Create new Supabase project for testing (`content-curator-staging`)
3. Run migrations to set up new tables in test project
4. Configure Vercel preview environment variables (test Supabase + test Stripe)
5. Create GBP Toolkit product in Stripe test mode ($15/month)

### Phase 2: Google Cloud Setup
6. Create Google Cloud project (or use existing)
7. Enable Business Profile API
8. Configure OAuth consent screen (start in "Testing" mode)
9. Create OAuth 2.0 credentials, set redirect URI to edge function
10. Store client ID/secret in Supabase Edge Function secrets

### Phase 3: Backend Implementation
11. Implement edge functions (auth callback, token refresh, GBP API wrappers)
12. Implement AI generation edge function
13. Test OAuth flow end-to-end on preview deployment

### Phase 4: Frontend Implementation
14. Add `gbp_toolkit_enabled` to SubscriptionContext
15. Build GBP components (connection, location selector, toolkit)
16. Integrate into client detail view and settings
17. Build paywall/upsell flow with Stripe checkout

### Phase 5: Testing & Polish
18. Internal testing on preview deployment
19. Invite 2-3 beta users (real agencies with GBP access)
20. Iterate based on feedback
21. Move Google OAuth consent screen to "Production" (requires verification)

### Phase 6: Launch
22. Create GBP Toolkit product in Stripe live mode
23. Merge feature branch to main
24. Announce to existing users

## Cost Analysis

### API Costs

- **Google Business Profile API**: Free
- **Claude API** (Sonnet): ~$0.08-0.10 per full client workflow

### Per-User Monthly Estimate

| Usage Level | Est. API Cost |
|-------------|---------------|
| Light (5 clients, 1x/month) | ~$0.50 |
| Normal (10 clients, occasional reruns) | ~$1-2 |
| Heavy (20 clients, frequent iterations) | ~$3-5 |

### Margin

At $15/month add-on pricing, expect 70-80% margins even with heavy users.

## Open Questions

- Exact Google OAuth verification requirements for production
- Whether to support multiple Google accounts per user (v2?)
- Snapshot retention policy (keep forever vs. rolling window)

## Next Steps

1. User approves this design
2. Set up test environment (Phase 1)
3. Begin implementation following deployment plan
