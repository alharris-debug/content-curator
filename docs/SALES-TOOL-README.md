# Sales Tool Documentation

## Overview
Password-protected sales enablement hub for Content Curator go-to-market activities.

**Access:** `/sales` route
**Password:** `curator2026`

## Features

### Core Tools
| Page | Route | Description |
|------|-------|-------------|
| Script Library | `/sales` | Filterable outreach scripts with copy button, editable with Supabase persistence |
| Conversation Flows | `/sales/flows` | Interactive step-by-step conversation guides with branching |
| Objection Handler | `/sales/objections` | Common objections with response scripts |
| ICP Reference | `/sales/icp` | Ideal Customer Profile cards with value propositions |
| Video Script | `/sales/video` | 2-minute demo video script reference |

### Prospecting Tools
| Page | Route | Description |
|------|-------|-------------|
| Pipeline | `/sales/pipeline` | Kanban/List view prospect tracker with status management |
| Reddit Search | `/sales/reddit` | Search Reddit for prospects (requires edge function) |
| Yelp Search | `/sales/yelp` | Search Yelp for businesses (requires API key - $229/mo) |
| Lead Generator | `/sales/leads` | Manual lead scoring checklist by industry |

## Database Tables
Run `supabase/migrations/20260122_sales_tool_tables.sql` in Supabase SQL Editor:

- `sales_scripts` - Stores script edits/overrides
- `sales_flows` - Custom conversation flows (future)
- `sales_prospects` - Prospect pipeline data

## Edge Functions

### reddit-search (Deployed)
Proxies Reddit API to avoid CORS. Currently blocked by Reddit (403).

**Status:** Not working - Reddit blocks cloud server IPs.
**Future:** Register for Reddit API access and implement OAuth.

### yelp-search (Ready to deploy)
Proxies Yelp Fusion API.

**Status:** Not deployed - requires $229/mo Yelp API subscription.

## Target Segments

1. **Small Business Owners** - DIY social media, time-strapped
2. **Freelance Social Media Managers** - Managing multiple clients
3. **ChatGPT Strugglers** - Cross-segment qualifier for AI-frustrated users

## Industries (Lead Generator)
- Realtors
- Dentists
- Chiropractors
- Hair Salons
- Fitness/Gyms
- Restaurants
- Contractors
- Automotive (flagged - potential conflict)
- Lawyers
- Accountants

## Deployment Checklist

- [x] Supabase tables created
- [x] Reddit edge function deployed
- [ ] Reddit OAuth setup (blocked - future task)
- [ ] Yelp edge function + API key (skipped - too expensive)
- [ ] Merge to main branch
- [ ] Deploy to production

## Future Enhancements

### High Priority
1. **Reddit API OAuth** - Register at reddit.com/prefs/apps, implement OAuth flow in edge function
2. **Google Maps/Places API** - Alternative to Yelp for business search (has free tier)

### Nice to Have
- Claude-powered website analyzer
- Auto-import from Reddit posts
- CRM integrations
- Email sequence builder

## File Structure
```
src/
├── config/
│   ├── salesData.js      # Scripts, objections, ICP data
│   ├── flowsData.js      # Conversation flow definitions
│   └── industryData.js   # Industry configs for lead gen
├── components/sales/
│   ├── SalesGate.jsx     # Password protection
│   ├── SalesNav.jsx      # Navigation bar
│   ├── SalesLayout.jsx   # Layout wrapper
│   └── CopyButton.jsx    # Reusable copy button
├── pages/sales/
│   ├── ScriptLibrary.jsx
│   ├── ConversationFlows.jsx
│   ├── ObjectionHandler.jsx
│   ├── ICPReference.jsx
│   ├── VideoScript.jsx
│   ├── ProspectPipeline.jsx
│   ├── RedditSearch.jsx
│   ├── YelpSearch.jsx
│   ├── LeadGenerator.jsx
│   └── index.js
├── services/
│   ├── sales/SalesService.js    # Supabase operations
│   ├── reddit/RedditService.js  # Reddit search
│   ├── yelp/YelpService.js      # Yelp search
│   └── analyzer/WebsiteAnalyzer.js
supabase/
├── migrations/
│   └── 20260122_sales_tool_tables.sql
└── functions/
    ├── reddit-search/index.ts
    └── yelp-search/index.ts
```
