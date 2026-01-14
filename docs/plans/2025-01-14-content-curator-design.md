# Content Curator - Design Document

**Date:** January 14, 2025
**Status:** Approved
**Version:** 1.0

## Overview

A web-based tool for a web services company to generate tailored blog posts for clients across multiple social platforms (GBP, Facebook, Instagram, LinkedIn). The tool helps web specialists create service-based and lifestyle content without duplicating recent posts.

## Goals

- Generate platform-optimized content for multiple clients
- Minimize manual input through AI-powered website analysis
- Prevent duplicate content by tracking post history
- Provide simple, clean UI for non-technical users
- Start simple (local storage) with path to cloud storage later

## User Profile

**Primary User:** Web specialist managing social content for multiple business clients
**Technical Level:** Non-technical - needs simple, clear interface
**Usage Pattern:** Regular content generation sessions for various clients

---

## Architecture

### Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **AI:** Claude API (user-provided key)
- **Storage Phase 1:** localStorage (browser-only)
- **Storage Phase 2:** Supabase (cloud database + auth)
- **Hosting:** Vercel or Netlify (free tier)

### Data Models

```javascript
Client {
  id: string,
  name: string,
  url: string,
  industry: string,
  targetAudience: string,
  brandVoice: string,
  scrapedContent: {
    services: string[],
    aboutText: string,
    keyPhrases: string[]
  },
  createdAt: timestamp,
  updatedAt: timestamp
}

Post {
  id: string,
  clientId: string,
  type: 'service' | 'lifestyle',
  content: {
    gbp: string,
    facebook: string,
    instagram: string,
    linkedin: string
  },
  platformsPosted: string[],
  postedAt: timestamp,
  topic: string
}

AppSettings {
  apiKey: string,
  appPassword: string,
  version: string
}
```

### Storage Layer Abstraction

Designed for easy Phase 2 migration:

```javascript
StorageService interface:
  - getClients(), saveClient(), deleteClient()
  - getPosts(clientId), savePost()
  - getSettings(), saveSettings()
  - exportAll(), importAll()

// Phase 1 implementation
LocalStorageService implements StorageService

// Phase 2 implementation (future)
SupabaseService implements StorageService
```

---

## Application Views

### 1. Login Screen

- Simple password entry field
- Phase 1: Single shared password stored in localStorage
- Phase 2: Full authentication via Supabase Auth

### 2. Client Dashboard

- Card grid showing all clients
- Each card displays: name, industry, last post date
- "Add Client" button (prominent)
- Click card to go to Post Generator for that client

### 3. Client Setup / Edit

**Flow:**
1. Enter website URL
2. Click "Analyze Website"
3. System scrapes site, AI extracts:
   - Client/Business Name (from title, logo, about page)
   - Industry (inferred from services/content)
   - Target Audience (inferred from messaging)
   - Brand Voice (inferred from copy tone)
4. All fields pre-populated but editable
5. Save Client

**Additional Controls:**
- "Refresh Website" button (re-scrapes, offers to update fields)
- Delete Client (with confirmation)

### 4. Post Generator (Main Workspace)

**Layout:**
- Top: Client selector dropdown (required)
- Below: Two cards side by side

**Service-Based Post Card:**
- "Generate Service Post" button
- Optional: Service focus dropdown (from scraped services) or "Auto-select"
- Output area:
  - GBP version displayed by default (with character count)
  - "Show other platforms" expandable (Facebook, Instagram, LinkedIn)
  - Copy button per platform
  - Regenerate button with optional prompt input
  - "Mark as Posted" button → platform checkbox list → save to history

**Non-Industry Post Card:**
- "Generate Lifestyle Post" button
- Optional: Category dropdown (defaults to "Surprise Me")
  - Recipe
  - Book Recommendation
  - Motivational Quote
  - Seasonal Tip
  - Local Event Idea
- Same output structure as service post

### 5. Post History

- Client filter dropdown (or "All Clients")
- List view, newest first
- Each entry shows:
  - Date posted
  - Platform icons
  - Post type badge (Service / Lifestyle)
  - Preview text (truncated, expandable)
  - "Copy Again" button

### 6. Settings

**API Configuration:**
- Claude API Key input (masked)
- "Test Connection" button

**App Password:**
- Change password field (Phase 1 only)

**Data Management:**
- Export All Data → downloads JSON backup file
- Import Data → file picker, validates, confirms before overwrite

**Info:**
- App version
- Storage mode indicator ("Local Storage - browser only")

---

## Platform Content Formatting

| Platform | Character Limit | Tone | Hashtags |
|----------|----------------|------|----------|
| GBP | 1,500 | Concise, local-focused | None |
| Facebook | ~500 optimal | Conversational, CTA-friendly | Light (1-3) |
| Instagram | 2,200 | Engaging hook, emoji-friendly | Heavy (5-10) |
| LinkedIn | 3,000 | Professional, industry-relevant | Minimal (1-3) |

---

## Duplicate Prevention

**Mechanism:**
1. When generating new posts, retrieve last 15 posts for the selected client
2. Extract topic/theme summaries (not full text - keeps tokens low)
3. Include in AI prompt: "Avoid these recently covered topics: [list]"
4. AI generates fresh content avoiding overlap

**Edge Case:**
- If running low on fresh angles, AI notes: "Consider refreshing website content or trying a lifestyle post"

---

## Error Handling

**Website Scraping:**
- Invalid/unreachable URL: "Couldn't access website. Check the URL and try again."
- Limited content: "Limited content found - consider adding more details manually."

**API Errors:**
- Invalid key: "API key is invalid. Check your key in Settings."
- Rate limited: "Too many requests. Wait a moment and try again."
- Network error: "Couldn't connect to AI service. Check your internet connection."

**Display:** Toast notifications (dismissible), not page-blocking modals.

**Data Safety:**
- Confirm dialog before importing (overwrites existing data)
- Confirm before deleting a client
- Auto-save after changes (except initial client setup which requires explicit save)

---

## Export/Import Format

```javascript
{
  version: "1.0",
  exportedAt: timestamp,
  data: {
    clients: Client[],
    posts: Post[],
    settings: AppSettings (excluding sensitive data like API key)
  }
}
```

Import validates version compatibility and data structure before applying.

---

## Navigation

Top navigation bar:
- **Clients** - Dashboard view
- **Generate Posts** - Post generator (prompts to select client if none selected)
- **History** - Post history view
- **Settings** - Configuration page

---

## Phase 2 Roadmap (Future)

Not in scope for initial build, but designed to support:

1. **Cloud Storage Migration**
   - Swap LocalStorageService for SupabaseService
   - Import existing data via export/import feature

2. **Authentication**
   - Supabase Auth integration
   - User accounts for team members
   - Role-based access (admin vs. user)

3. **Enhanced Features**
   - Direct platform posting via APIs (if feasible)
   - Analytics/reporting
   - Content calendar view
   - AI-powered content suggestions based on trends

---

## Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navigation.jsx
│   │   └── PageContainer.jsx
│   ├── clients/
│   │   ├── ClientCard.jsx
│   │   ├── ClientForm.jsx
│   │   └── ClientSelector.jsx
│   ├── posts/
│   │   ├── PostCard.jsx
│   │   ├── PlatformTabs.jsx
│   │   ├── RegenerateInput.jsx
│   │   └── MarkAsPosted.jsx
│   └── shared/
│       ├── Button.jsx
│       ├── CopyButton.jsx
│       ├── Toast.jsx
│       └── LoadingSpinner.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── ClientSetup.jsx
│   ├── Generator.jsx
│   ├── History.jsx
│   └── Settings.jsx
├── services/
│   ├── storage/
│   │   ├── StorageService.js (interface)
│   │   └── LocalStorageService.js
│   ├── ai/
│   │   ├── ClaudeService.js
│   │   └── prompts.js
│   └── scraper/
│       └── WebsiteScraper.js
├── hooks/
│   ├── useClients.js
│   ├── usePosts.js
│   └── useSettings.js
├── utils/
│   └── platformFormatters.js
└── App.jsx
```

---

## Summary

Content Curator is a focused tool for generating platform-optimized social media content across multiple clients. Phase 1 prioritizes simplicity (localStorage, password gate) while architecting for future cloud migration. The AI-powered workflow minimizes manual input while maintaining control through editable fields and regeneration options.
