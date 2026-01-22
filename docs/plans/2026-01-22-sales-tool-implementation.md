# Sales Tool Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive sales enablement hub where the sales team can access scripts, handle objections, reference ICPs, and find prospects - all with one-click copy functionality.

**Architecture:** Standalone section within the existing Content Curator app, accessible via `/sales` routes. Uses the same React/Tailwind stack. Data stored in a local `salesData.js` config file (no database needed for Phase 1). Password-protected via a simple gate component.

**Tech Stack:** React, React Router, Tailwind CSS (existing stack)

---

## Phase 1: Core Sales Kit (MVP)

### Task 1: Create Sales Data Config File

**Files:**
- Create: `src/config/salesData.js`

**Step 1: Create the sales data configuration**

```javascript
// src/config/salesData.js

export const segments = [
  {
    id: 'business-owner',
    name: 'Small Business Owners',
    shortName: 'Business Owner',
    description: 'Solo or micro-business owners doing their own marketing'
  },
  {
    id: 'freelancer',
    name: 'Freelance Social Media Managers',
    shortName: 'Freelancer',
    description: 'Solo freelancers managing 3-15 clients'
  },
  {
    id: 'chatgpt-struggler',
    name: 'ChatGPT Strugglers',
    shortName: 'ChatGPT User',
    description: 'Already using AI but doing it the hard way'
  }
]

export const channels = [
  { id: 'dm', name: 'Direct Message' },
  { id: 'reddit', name: 'Reddit' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'facebook', name: 'Facebook' }
]

export const scriptTypes = [
  { id: 'cold-outreach', name: 'Cold Outreach' },
  { id: 'social-post', name: 'Social Post' },
  { id: 'objection', name: 'Objection Handling' }
]

export const scripts = [
  {
    id: 'dm-business-owner',
    title: 'Cold DM - Business Owner',
    segment: 'business-owner',
    channel: 'dm',
    type: 'cold-outreach',
    content: `Hey [Name] - saw your post about [specific thing they mentioned: time, social media struggle, etc.].

Quick question: how are you currently handling your social media content? Doing it yourself or outsourcing?

I ask because I work with a tool that lets business owners generate a full week of posts in about 10 minutes - for Google, Facebook, Instagram, and LinkedIn. Runs about $15/month vs $500+ for an agency.

Happy to show you a quick demo if you're curious. No pressure either way.`,
    placeholders: ['[Name]', '[specific thing they mentioned: time, social media struggle, etc.]']
  },
  {
    id: 'dm-freelancer',
    title: 'Cold DM - Freelancer',
    segment: 'freelancer',
    channel: 'dm',
    type: 'cold-outreach',
    content: `Hey [Name] - noticed you're managing social media for multiple clients. Quick question: how are you handling content creation across all of them?

I've been working with freelancers who were drowning in ChatGPT tabs and Google Docs - they switched to a tool that keeps each client's brand voice saved and generates platform-ready posts in one click.

Most are saving 5-10 hours a week. Worth a quick look?`,
    placeholders: ['[Name]']
  },
  {
    id: 'dm-chatgpt-struggler',
    title: 'Cold DM - ChatGPT User',
    segment: 'chatgpt-struggler',
    channel: 'dm',
    type: 'cold-outreach',
    content: `Saw your post about using ChatGPT for social content - I was doing the same thing for a while. Got tired of re-explaining my business every session and reformatting everything manually.

Started using something that keeps my brand voice saved and spits out posts for all 4 platforms at once. Game changer honestly.

Happy to share what it is if you're interested.`,
    placeholders: []
  },
  {
    id: 'reddit-social-media-help',
    title: 'Reddit Reply - Social Media Help',
    segment: 'business-owner',
    channel: 'reddit',
    type: 'social-post',
    content: `I was spending way too much time on this until I found a system that works. I use a tool that saves my brand voice and generates posts for all 4 platforms at once - Google Business, Facebook, Instagram, LinkedIn. Takes me about 10 minutes to get a week's worth of content now.

Happy to share what I use if anyone's interested.`,
    placeholders: []
  },
  {
    id: 'reddit-chatgpt-prompt',
    title: 'Reddit Reply - ChatGPT Prompt Question',
    segment: 'chatgpt-struggler',
    channel: 'reddit',
    type: 'social-post',
    content: `I used to have a whole prompt template saved, but honestly got tired of pasting it every session and reformatting for each platform. Switched to a dedicated tool that keeps my business info saved and outputs platform-ready posts. Way less friction.

Still uses AI under the hood, just built specifically for social content.`,
    placeholders: []
  },
  {
    id: 'reddit-multiple-clients',
    title: 'Reddit Reply - Multiple Clients',
    segment: 'freelancer',
    channel: 'reddit',
    type: 'social-post',
    content: `This was killing me until I found the right setup. I use Content Curator - each client has their own profile with brand voice, industry, audience saved. I switch between them in one click and generate posts without re-explaining anything. Went from 2 hours per client per week to maybe 20 minutes.`,
    placeholders: []
  },
  {
    id: 'linkedin-story',
    title: 'LinkedIn Post - Story Style',
    segment: 'business-owner',
    channel: 'linkedin',
    type: 'social-post',
    content: `I used to spend Sunday nights writing social media posts for the week.

Now I spend 10 minutes.

The difference? I stopped using ChatGPT like a blank canvas and started using a tool built specifically for social content.

It remembers my brand voice. It formats for each platform. It keeps everything organized.

If you're still copy-pasting prompts and reformatting posts manually, there's a better way.

DM me if you want to see what I switched to.`,
    placeholders: []
  },
  {
    id: 'linkedin-hot-take',
    title: 'LinkedIn Post - Hot Take',
    segment: 'chatgpt-struggler',
    channel: 'linkedin',
    type: 'social-post',
    content: `Hot take: ChatGPT is a terrible social media tool.

Not because the AI is bad. Because the workflow is bad.

- It forgets your business every session
- You have to reformat every post for every platform
- There's no way to organize multiple clients

I switched to something purpose-built and I'm never going back.

Happy to share what it is - just drop a comment or DM.`,
    placeholders: []
  },
  {
    id: 'facebook-casual-share',
    title: 'Facebook Group - Casual Share',
    segment: 'business-owner',
    channel: 'facebook',
    type: 'social-post',
    content: `Just wanted to share something that's been saving me a ton of time in case it helps anyone else.

I was using ChatGPT to write my social media posts but got tired of explaining my business every time and reformatting everything for different platforms.

Found a tool called Content Curator that saves my brand info and generates posts for Google, Facebook, Instagram, and LinkedIn all at once. $15/month and I'm getting hours back every week.

Not affiliated, just a fan. Happy to answer questions if anyone's curious.`,
    placeholders: []
  },
  {
    id: 'facebook-help-reply',
    title: 'Facebook Group - Help Reply',
    segment: 'business-owner',
    channel: 'facebook',
    type: 'social-post',
    content: `I was in the same boat - social media felt like a part-time job on top of running my actual business.

Two things helped: batching (I do all my content in one sitting) and using a tool that generates platform-specific posts from my brand voice automatically.

Takes me about 10 minutes now to get a full week of content. DM me if you want details on the tool I use.`,
    placeholders: []
  }
]

export const objections = [
  {
    id: 'already-use-chatgpt',
    objection: '"I already use ChatGPT for free"',
    response: `Totally get it - I did too for a while. The difference is ChatGPT forgets everything between sessions. You're re-explaining your business, your tone, your audience every time. Content Curator saves all that once, so you just hit generate. Plus it formats for each platform automatically - no more copy-pasting and tweaking for Instagram vs LinkedIn.

It's basically ChatGPT with a memory and a workflow built for social media. Worth trying the difference.`
  },
  {
    id: 'no-budget',
    objection: '"I don\'t have the budget right now"',
    response: `I hear you. Quick math though - if you're spending even 3-4 hours a week on social content, that's 15+ hours a month. At $15/month for Starter, you're paying about $1/hour to get that time back.

Most people use that time to actually run their business or land more clients. Usually pays for itself in the first week.`
  },
  {
    id: 'tried-before',
    objection: '"I tried a tool like this before and it didn\'t work"',
    response: `Fair - a lot of AI tools spit out generic garbage. What makes this different is it learns your specific brand voice, your industry, and your audience. So the posts actually sound like you, not like a robot wrote them.

Might be worth a quick look just to see the difference. If it's not noticeably better, no hard feelings.`
  },
  {
    id: 'no-time',
    objection: '"I don\'t have time to learn a new tool"',
    response: `That's actually the whole point - there's basically nothing to learn. You fill out your business info once, pick a platform, and hit generate. Takes about 2 minutes to get your first posts.

It's less time than writing one post manually.`
  },
  {
    id: 'think-about-it',
    objection: '"I\'ll think about it" / Going cold',
    response: `No worries at all - it's not going anywhere. If you want, I can send you a quick 2-minute video showing how it works. Watch it whenever. And if social media is still eating your time in a few weeks, you know where to find me.`
  }
]

export const icpData = [
  {
    id: 'business-owner',
    segment: 'Small Business Owners',
    who: [
      'Solo or micro-business owners (1-5 employees)',
      'Local service businesses: realtors, dentists, chiropractors, salons, contractors, fitness studios, restaurants',
      'Revenue: $50K-$500K/year',
      'Doing their own marketing or have a part-time VA helping'
    ],
    whereToFind: [
      { platform: 'Facebook Groups', details: 'Local business networks, industry-specific groups ("Realtors of [City]", "Small Business Owners")' },
      { platform: 'Reddit', details: 'r/smallbusiness, r/entrepreneur, r/sweatystartup', links: ['https://reddit.com/r/smallbusiness', 'https://reddit.com/r/entrepreneur', 'https://reddit.com/r/sweatystartup'] },
      { platform: 'LinkedIn', details: 'Job title searches for "Owner" + industry keywords' },
      { platform: 'Instagram', details: 'Local business hashtags, location tags' }
    ],
    signals: [
      'Posting inconsistently (gaps of weeks between posts)',
      'Low-quality or generic content',
      'Asking for social media help in groups',
      'Complaining about time or "wearing too many hats"'
    ],
    valueProps: {
      hook: 'Stop spending your evenings writing social media posts. Generate a week\'s worth of content in 10 minutes.',
      points: [
        'Your brand voice, saved once, used forever - no re-explaining to AI every time',
        'Posts tailored for Google Business, Facebook, Instagram, and LinkedIn in one click',
        'Built for business owners, not marketers - no learning curve'
      ],
      costAngle: 'A social media agency costs $500-2,000/month. Content Curator is $15-29/month and you stay in control.'
    }
  },
  {
    id: 'freelancer',
    segment: 'Freelance Social Media Managers',
    who: [
      'Solo freelancers managing 3-15 clients',
      'Often former marketing employees who went independent',
      'Revenue: $30K-$100K/year',
      'Juggling content creation, scheduling, reporting, and client communication'
    ],
    whereToFind: [
      { platform: 'LinkedIn', details: '"Freelance Social Media Manager," "Social Media Consultant"' },
      { platform: 'Facebook Groups', details: 'Freelancer communities, VA networks' },
      { platform: 'Reddit', details: 'r/socialmedia, r/freelance', links: ['https://reddit.com/r/socialmedia', 'https://reddit.com/r/freelance'] },
      { platform: 'Twitter/X', details: '#FreelanceSMM, #SocialMediaManager' }
    ],
    signals: [
      'Posting about being overwhelmed or burned out',
      'Asking about tools to streamline workflows',
      'Celebrating new client wins (scaling pain incoming)'
    ],
    valueProps: {
      hook: 'Manage all your clients\' content from one dashboard. Stop juggling tabs, docs, and ChatGPT windows.',
      points: [
        'Each client\'s brand voice, industry, and audience saved in their profile',
        'Generate platform-specific posts without copy-pasting or reformatting',
        'Scale from 5 clients to 15 without hiring help'
      ],
      costAngle: 'Cut content creation time by 80%. Spend that time landing new clients instead.'
    }
  },
  {
    id: 'chatgpt-struggler',
    segment: 'ChatGPT Strugglers',
    who: [
      'Already using ChatGPT (or Claude, Gemini, etc.) for social content',
      'Re-explaining their business every session',
      'No saved context, manually reformatting for each platform',
      'Juggling multiple browser tabs for multiple clients'
    ],
    whereToFind: [
      { platform: 'Reddit', details: 'r/ChatGPT, r/ArtificialIntelligence - search "social media," "content," "prompts"', links: ['https://reddit.com/r/ChatGPT', 'https://reddit.com/r/ArtificialIntelligence'] },
      { platform: 'Facebook/LinkedIn', details: 'Posts asking "what\'s your ChatGPT prompt for [platform]?"' },
      { platform: 'YouTube', details: 'Comments under "ChatGPT for social media" tutorials' },
      { platform: 'Twitter/X', details: 'People sharing screenshots of ChatGPT writing their posts' }
    ],
    signals: [
      'Sharing "prompt templates" they\'ve built (shows they\'re trying to systematize)',
      'Complaining about ChatGPT "forgetting" their brand voice',
      'Asking how to use ChatGPT for multiple clients/businesses'
    ],
    valueProps: {
      hook: 'You already use AI for content. This is AI that actually remembers your business.',
      points: [
        'No more "act as a social media manager for a [business type]" every session',
        'No more reformatting the same post for four different platforms',
        'No more losing that perfect prompt you wrote last month'
      ],
      costAngle: 'ChatGPT is a blank canvas. Content Curator is a content machine built for social media.'
    }
  }
]

export const videoScript = {
  title: 'Demo Video Script (2 minutes)',
  sections: [
    {
      time: '0:00-0:15',
      label: 'Hook',
      content: 'If you\'re using ChatGPT to write social media posts, you\'re doing it the hard way. Let me show you something that takes 2 minutes instead of 20.'
    },
    {
      time: '0:15-0:35',
      label: 'The Problem',
      content: 'Here\'s what most people do: open ChatGPT, explain their business, ask for a post, copy it, tweak it for Instagram, then do it again for Facebook, then LinkedIn. Next week? Start over. ChatGPT forgot everything.'
    },
    {
      time: '0:35-0:55',
      label: 'The Solution',
      content: 'Content Curator remembers your business. I set up my brand voice, my industry, my audience once. Now watch this...'
    },
    {
      time: '0:55-1:25',
      label: 'The Demo',
      content: 'I pick a topic, hit generate, and I get posts for Google Business, Facebook, Instagram, and LinkedIn - all formatted correctly, all in my voice. That\'s a week of content in about 10 minutes.\n\n[Show the generation happening, scroll through the outputs]'
    },
    {
      time: '1:25-1:45',
      label: 'The Extras',
      content: 'Every client I manage has their own profile. I switch between them in one click. All my past posts are saved. No more digging through ChatGPT history.'
    },
    {
      time: '1:45-2:00',
      label: 'CTA',
      content: 'Starts at $15 a month - less than one hour of your time is worth. Link\'s below if you want to try it.'
    }
  ]
}
```

**Step 2: Verify file created**

Run: `ls -la src/config/salesData.js`
Expected: File exists

**Step 3: Commit**

```bash
git add src/config/salesData.js
git commit -m "feat(sales): add sales data configuration with scripts, objections, and ICPs"
```

---

### Task 2: Create Sales Gate Component

**Files:**
- Create: `src/components/sales/SalesGate.jsx`

**Step 1: Create the password gate component**

```jsx
// src/components/sales/SalesGate.jsx
import { useState, useEffect } from 'react'

const SALES_PASSWORD = 'curator2026'
const STORAGE_KEY = 'sales-tool-auth'

export default function SalesGate({ children }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === 'true') {
      setIsAuthed(true)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === SALES_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setIsAuthed(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  if (isAuthed) {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Sales Tool</h1>
        <p className="text-gray-600 text-sm mb-6">Enter password to access sales resources</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Access Sales Tool
          </button>
        </form>
      </div>
    </div>
  )
}
```

**Step 2: Verify file created**

Run: `ls -la src/components/sales/`
Expected: Directory with SalesGate.jsx

**Step 3: Commit**

```bash
git add src/components/sales/SalesGate.jsx
git commit -m "feat(sales): add password gate component for sales tool"
```

---

### Task 3: Create Copy Button Component

**Files:**
- Create: `src/components/sales/CopyButton.jsx`

**Step 1: Create reusable copy button**

```jsx
// src/components/sales/CopyButton.jsx
import { useState } from 'react'

export default function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1 text-sm rounded transition-colors ${
        copied
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/sales/CopyButton.jsx
git commit -m "feat(sales): add reusable copy button component"
```

---

### Task 4: Create Sales Navigation Component

**Files:**
- Create: `src/components/sales/SalesNav.jsx`

**Step 1: Create sales tool navigation**

```jsx
// src/components/sales/SalesNav.jsx
import { NavLink, useNavigate } from 'react-router-dom'

export default function SalesNav() {
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-purple-700 text-white' : 'text-purple-100 hover:bg-purple-600'
    }`

  return (
    <nav className="bg-purple-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold text-lg">Sales Tool</span>
            <div className="flex space-x-1">
              <NavLink to="/sales" className={linkClass} end>Scripts</NavLink>
              <NavLink to="/sales/objections" className={linkClass}>Objections</NavLink>
              <NavLink to="/sales/icp" className={linkClass}>ICP</NavLink>
              <NavLink to="/sales/video" className={linkClass}>Video Script</NavLink>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-purple-200 hover:text-white text-sm"
          >
            Back to App
          </button>
        </div>
      </div>
    </nav>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/sales/SalesNav.jsx
git commit -m "feat(sales): add sales tool navigation component"
```

---

### Task 5: Create Sales Layout Component

**Files:**
- Create: `src/components/sales/SalesLayout.jsx`

**Step 1: Create sales layout wrapper**

```jsx
// src/components/sales/SalesLayout.jsx
import SalesNav from './SalesNav'
import SalesGate from './SalesGate'

export default function SalesLayout({ children, title }) {
  return (
    <SalesGate>
      <div className="min-h-screen bg-gray-100">
        <SalesNav />
        <main className="max-w-7xl mx-auto px-4 py-6">
          {title && <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>}
          {children}
        </main>
      </div>
    </SalesGate>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/sales/SalesLayout.jsx
git commit -m "feat(sales): add sales layout wrapper component"
```

---

### Task 6: Create Script Library Page

**Files:**
- Create: `src/pages/sales/ScriptLibrary.jsx`

**Step 1: Create the script library page with filtering**

```jsx
// src/pages/sales/ScriptLibrary.jsx
import { useState, useMemo } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { scripts, segments, channels, scriptTypes } from '../../config/salesData'

function highlightPlaceholders(text) {
  return text.split(/(\[[^\]]+\])/).map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={i} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </span>
      )
    }
    return part
  })
}

export default function ScriptLibrary() {
  const [selectedSegment, setSelectedSegment] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [expandedScript, setExpandedScript] = useState(null)

  const filteredScripts = useMemo(() => {
    return scripts.filter((script) => {
      if (selectedSegment && script.segment !== selectedSegment) return false
      if (selectedChannel && script.channel !== selectedChannel) return false
      if (selectedType && script.type !== selectedType) return false
      return true
    })
  }, [selectedSegment, selectedChannel, selectedType])

  const clearFilters = () => {
    setSelectedSegment('')
    setSelectedChannel('')
    setSelectedType('')
  }

  return (
    <SalesLayout title="Script Library">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Segment</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Segments</option>
              {segments.map((s) => (
                <option key={s.id} value={s.id}>{s.shortName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Channel</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Channels</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Types</option>
              {scriptTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          {(selectedSegment || selectedChannel || selectedType) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 mt-4"
            >
              Clear filters
            </button>
          )}
          <div className="ml-auto text-sm text-gray-500">
            {filteredScripts.length} script{filteredScripts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Scripts */}
      <div className="space-y-4">
        {filteredScripts.map((script) => {
          const isExpanded = expandedScript === script.id
          const segment = segments.find((s) => s.id === script.segment)
          const channel = channels.find((c) => c.id === script.channel)
          const type = scriptTypes.find((t) => t.id === script.type)

          return (
            <div key={script.id} className="bg-white rounded-lg shadow">
              <div
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedScript(isExpanded ? null : script.id)}
              >
                <div>
                  <h3 className="font-medium text-gray-800">{script.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      {segment?.shortName}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {channel?.name}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {type?.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {script.content.length} chars
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {highlightPlaceholders(script.content)}
                    </pre>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <CopyButton text={script.content} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SalesLayout>
  )
}
```

**Step 2: Verify file created**

Run: `ls -la src/pages/sales/`
Expected: Directory with ScriptLibrary.jsx

**Step 3: Commit**

```bash
git add src/pages/sales/ScriptLibrary.jsx
git commit -m "feat(sales): add script library page with filtering and copy"
```

---

### Task 7: Create Objection Handler Page

**Files:**
- Create: `src/pages/sales/ObjectionHandler.jsx`

**Step 1: Create the objection handler page**

```jsx
// src/pages/sales/ObjectionHandler.jsx
import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { objections } from '../../config/salesData'

export default function ObjectionHandler() {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <SalesLayout title="Objection Handling">
      <p className="text-gray-600 mb-6">
        Quick responses to common objections. Click to expand, copy to clipboard.
      </p>

      <div className="space-y-3">
        {objections.map((obj) => {
          const isExpanded = expandedId === obj.id

          return (
            <div key={obj.id} className="bg-white rounded-lg shadow">
              <button
                className="w-full p-4 text-left flex items-center justify-between"
                onClick={() => setExpandedId(isExpanded ? null : obj.id)}
              >
                <span className="font-medium text-gray-800">{obj.objection}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="mt-3 p-3 bg-green-50 rounded-md">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {obj.response}
                    </pre>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <CopyButton text={obj.response} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SalesLayout>
  )
}
```

**Step 2: Commit**

```bash
git add src/pages/sales/ObjectionHandler.jsx
git commit -m "feat(sales): add objection handler page"
```

---

### Task 8: Create ICP Reference Page

**Files:**
- Create: `src/pages/sales/ICPReference.jsx`

**Step 1: Create the ICP reference page**

```jsx
// src/pages/sales/ICPReference.jsx
import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { icpData } from '../../config/salesData'

export default function ICPReference() {
  const [expandedId, setExpandedId] = useState(null)

  return (
    <SalesLayout title="Ideal Client Profiles">
      <p className="text-gray-600 mb-6">
        Know exactly who to target, where to find them, and what signals indicate they're a fit.
      </p>

      <div className="grid gap-6">
        {icpData.map((icp) => {
          const isExpanded = expandedId === icp.id

          return (
            <div key={icp.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Header */}
              <div
                className="p-4 bg-purple-50 cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedId(isExpanded ? null : icp.id)}
              >
                <h2 className="text-lg font-semibold text-purple-900">{icp.segment}</h2>
                <svg
                  className={`w-5 h-5 text-purple-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {isExpanded && (
                <div className="p-4 space-y-6">
                  {/* Who They Are */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Who They Are</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {icp.who.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Where to Find Them */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Where to Find Them</h3>
                    <div className="space-y-2">
                      {icp.whereToFind.map((place, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium text-gray-700">{place.platform}:</span>{' '}
                          <span className="text-gray-600">{place.details}</span>
                          {place.links && (
                            <div className="mt-1 flex gap-2">
                              {place.links.map((link, j) => (
                                <a
                                  key={j}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  {link.replace('https://reddit.com/', '')}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signals */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-2">Signals They're a Fit</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {icp.signals.map((signal, i) => (
                        <li key={i}>{signal}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Value Props */}
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium text-blue-900 mb-2">Value Proposition</h3>
                    <p className="text-blue-800 font-medium mb-3">"{icp.valueProps.hook}"</p>
                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1 mb-3">
                      {icp.valueProps.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-blue-600 italic">{icp.valueProps.costAngle}</p>
                    <div className="mt-3">
                      <CopyButton text={icp.valueProps.hook} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SalesLayout>
  )
}
```

**Step 2: Commit**

```bash
git add src/pages/sales/ICPReference.jsx
git commit -m "feat(sales): add ICP reference page with value props"
```

---

### Task 9: Create Video Script Page

**Files:**
- Create: `src/pages/sales/VideoScript.jsx`

**Step 1: Create the video script reference page**

```jsx
// src/pages/sales/VideoScript.jsx
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { videoScript } from '../../config/salesData'

export default function VideoScript() {
  const fullScript = videoScript.sections.map((s) => s.content).join('\n\n')

  return (
    <SalesLayout title="Demo Video Script">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 text-sm">
          <strong>Action item:</strong> Record a 2-minute demo video using this script.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{videoScript.title}</h2>
          <CopyButton text={fullScript} />
        </div>

        <div className="space-y-6">
          {videoScript.sections.map((section, i) => (
            <div key={i} className="border-l-4 border-purple-300 pl-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {section.time}
                </span>
                <span className="font-medium text-gray-800">{section.label}</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-2">Recording Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Keep energy conversational, not salesy</li>
          <li>• Show real UI - don't use mockups</li>
          <li>• Pause briefly after the hook to let it land</li>
          <li>• Screen record at 1080p minimum</li>
          <li>• Add captions for social media</li>
        </ul>
      </div>
    </SalesLayout>
  )
}
```

**Step 2: Commit**

```bash
git add src/pages/sales/VideoScript.jsx
git commit -m "feat(sales): add video script reference page"
```

---

### Task 10: Create Sales Page Index Export

**Files:**
- Create: `src/pages/sales/index.js`

**Step 1: Create barrel export**

```javascript
// src/pages/sales/index.js
export { default as ScriptLibrary } from './ScriptLibrary'
export { default as ObjectionHandler } from './ObjectionHandler'
export { default as ICPReference } from './ICPReference'
export { default as VideoScript } from './VideoScript'
```

**Step 2: Commit**

```bash
git add src/pages/sales/index.js
git commit -m "feat(sales): add barrel export for sales pages"
```

---

### Task 11: Add Sales Routes to App

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add imports and routes**

Add to imports at top of file:

```jsx
import { ScriptLibrary, ObjectionHandler, ICPReference, VideoScript } from './pages/sales'
```

Add routes inside the `<Routes>` component, before the catch-all route:

```jsx
<Route path="/sales" element={<ScriptLibrary />} />
<Route path="/sales/objections" element={<ObjectionHandler />} />
<Route path="/sales/icp" element={<ICPReference />} />
<Route path="/sales/video" element={<VideoScript />} />
```

**Step 2: Verify the app builds**

Run: `npm run build`
Expected: Build completes without errors

**Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(sales): add sales tool routes to app"
```

---

### Task 12: Test the Sales Tool

**Step 1: Start development server**

Run: `npm run dev`

**Step 2: Manual testing checklist**

- [ ] Navigate to `/sales` - should see password gate
- [ ] Enter wrong password - should see error
- [ ] Enter `curator2026` - should see Script Library
- [ ] Test filter dropdowns - scripts should filter correctly
- [ ] Click a script to expand - should show content with placeholders highlighted
- [ ] Click Copy button - should copy text and show "Copied!"
- [ ] Navigate to Objections page - accordion should work
- [ ] Navigate to ICP page - cards should expand
- [ ] Navigate to Video Script page - should show timeline
- [ ] Click "Back to App" - should return to main app

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(sales): complete Phase 1 sales tool MVP"
```

---

## Phase 2: Persistence & Editing

### Overview

Add Supabase persistence so scripts can be edited and changes stick for all users. Add conversation flow guides with step-by-step progression.

---

### Task 13: Create Supabase Tables for Sales Tool

**Files:**
- Run SQL in Supabase dashboard

**Step 1: Create sales_scripts table**

```sql
-- Editable scripts (overrides for default scripts)
CREATE TABLE sales_scripts (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation flows
CREATE TABLE sales_flows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  segment TEXT,
  steps JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prospect pipeline
CREATE TABLE sales_prospects (
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

-- No RLS needed - sales tool is password-protected, not user-specific
```

**Step 2: Verify tables created**

Run in Supabase SQL editor: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`

**Step 3: Commit documentation**

```bash
echo "-- Sales tool tables created in Supabase" >> supabase/migrations/sales_tables.sql
git add supabase/migrations/sales_tables.sql
git commit -m "docs(sales): document Supabase tables for sales tool"
```

---

### Task 14: Create Sales Service for Supabase Operations

**Files:**
- Create: `src/services/sales/SalesService.js`

**Step 1: Create the service**

```javascript
// src/services/sales/SalesService.js
import { supabase } from '../storage/SupabaseService'

export const SalesService = {
  // Scripts
  async getScriptOverride(scriptId) {
    const { data, error } = await supabase
      .from('sales_scripts')
      .select('content')
      .eq('id', scriptId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching script:', error)
    }
    return data?.content || null
  },

  async saveScriptOverride(scriptId, content) {
    const { error } = await supabase
      .from('sales_scripts')
      .upsert({
        id: scriptId,
        content,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving script:', error)
      throw error
    }
  },

  async getAllScriptOverrides() {
    const { data, error } = await supabase
      .from('sales_scripts')
      .select('id, content')

    if (error) {
      console.error('Error fetching scripts:', error)
      return {}
    }

    return data.reduce((acc, row) => {
      acc[row.id] = row.content
      return acc
    }, {})
  },

  // Prospects
  async getProspects(filters = {}) {
    let query = supabase
      .from('sales_prospects')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.source) {
      query = query.eq('source', filters.source)
    }
    if (filters.industry) {
      query = query.eq('industry', filters.industry)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error fetching prospects:', error)
      return []
    }
    return data
  },

  async addProspect(prospect) {
    const { data, error } = await supabase
      .from('sales_prospects')
      .insert(prospect)
      .select()
      .single()

    if (error) {
      console.error('Error adding prospect:', error)
      throw error
    }
    return data
  },

  async updateProspect(id, updates) {
    const { error } = await supabase
      .from('sales_prospects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Error updating prospect:', error)
      throw error
    }
  },

  async deleteProspect(id) {
    const { error } = await supabase
      .from('sales_prospects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting prospect:', error)
      throw error
    }
  },

  // Flows
  async getFlows() {
    const { data, error } = await supabase
      .from('sales_flows')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching flows:', error)
      return []
    }
    return data
  },

  async saveFlow(flow) {
    const { data, error } = await supabase
      .from('sales_flows')
      .upsert(flow)
      .select()
      .single()

    if (error) {
      console.error('Error saving flow:', error)
      throw error
    }
    return data
  }
}
```

**Step 2: Commit**

```bash
git add src/services/sales/SalesService.js
git commit -m "feat(sales): add Supabase service for sales tool persistence"
```

---

### Task 15: Update Script Library with Edit Functionality

**Files:**
- Modify: `src/pages/sales/ScriptLibrary.jsx`

**Step 1: Add edit modal and persistence**

Replace the entire ScriptLibrary.jsx with:

```jsx
// src/pages/sales/ScriptLibrary.jsx
import { useState, useMemo, useEffect } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { scripts as defaultScripts, segments, channels, scriptTypes } from '../../config/salesData'
import { SalesService } from '../../services/sales/SalesService'

function highlightPlaceholders(text) {
  return text.split(/(\[[^\]]+\])/).map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={i} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </span>
      )
    }
    return part
  })
}

export default function ScriptLibrary() {
  const [selectedSegment, setSelectedSegment] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [expandedScript, setExpandedScript] = useState(null)
  const [editingScript, setEditingScript] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [overrides, setOverrides] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    SalesService.getAllScriptOverrides().then(setOverrides)
  }, [])

  const scripts = useMemo(() => {
    return defaultScripts.map(script => ({
      ...script,
      content: overrides[script.id] || script.content,
      isModified: !!overrides[script.id]
    }))
  }, [overrides])

  const filteredScripts = useMemo(() => {
    return scripts.filter((script) => {
      if (selectedSegment && script.segment !== selectedSegment) return false
      if (selectedChannel && script.channel !== selectedChannel) return false
      if (selectedType && script.type !== selectedType) return false
      return true
    })
  }, [scripts, selectedSegment, selectedChannel, selectedType])

  const clearFilters = () => {
    setSelectedSegment('')
    setSelectedChannel('')
    setSelectedType('')
  }

  const handleEdit = (script) => {
    setEditingScript(script)
    setEditContent(script.content)
  }

  const handleSave = async () => {
    if (!editingScript) return
    setSaving(true)
    try {
      await SalesService.saveScriptOverride(editingScript.id, editContent)
      setOverrides(prev => ({ ...prev, [editingScript.id]: editContent }))
      setEditingScript(null)
    } catch (err) {
      alert('Failed to save: ' + err.message)
    }
    setSaving(false)
  }

  const handleReset = async (scriptId) => {
    if (!confirm('Reset to default? Your edits will be lost.')) return
    try {
      // Delete override by saving the default content
      const defaultScript = defaultScripts.find(s => s.id === scriptId)
      await SalesService.saveScriptOverride(scriptId, defaultScript.content)
      setOverrides(prev => {
        const next = { ...prev }
        delete next[scriptId]
        return next
      })
    } catch (err) {
      alert('Failed to reset: ' + err.message)
    }
  }

  return (
    <SalesLayout title="Script Library">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Segment</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Segments</option>
              {segments.map((s) => (
                <option key={s.id} value={s.id}>{s.shortName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Channel</label>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Channels</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            >
              <option value="">All Types</option>
              {scriptTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          {(selectedSegment || selectedChannel || selectedType) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 mt-4"
            >
              Clear filters
            </button>
          )}
          <div className="ml-auto text-sm text-gray-500">
            {filteredScripts.length} script{filteredScripts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Scripts */}
      <div className="space-y-4">
        {filteredScripts.map((script) => {
          const isExpanded = expandedScript === script.id
          const segment = segments.find((s) => s.id === script.segment)
          const channel = channels.find((c) => c.id === script.channel)
          const type = scriptTypes.find((t) => t.id === script.type)

          return (
            <div key={script.id} className="bg-white rounded-lg shadow">
              <div
                className="p-4 cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedScript(isExpanded ? null : script.id)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{script.title}</h3>
                    {script.isModified && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                        Edited
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                      {segment?.shortName}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {channel?.name}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {type?.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {script.content.length} chars
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {highlightPlaceholders(script.content)}
                    </pre>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(script)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      {script.isModified && (
                        <button
                          onClick={() => handleReset(script.id)}
                          className="px-3 py-1 text-sm text-orange-600 hover:text-orange-800"
                        >
                          Reset to default
                        </button>
                      )}
                    </div>
                    <CopyButton text={script.content} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Edit Modal */}
      {editingScript && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit: {editingScript.title}
              </h2>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-2 text-xs text-gray-500">
                Use [brackets] for placeholders that need to be filled in
              </p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingScript(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SalesLayout>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/pages/sales/ScriptLibrary.jsx
git commit -m "feat(sales): add script editing with Supabase persistence"
```

---

### Task 16: Create Conversation Flows Page

**Files:**
- Create: `src/pages/sales/ConversationFlows.jsx`
- Create: `src/config/flowsData.js`

**Step 1: Create default flows data**

```javascript
// src/config/flowsData.js
export const defaultFlows = [
  {
    id: 'cold-dm-flow',
    name: 'Cold DM Outreach',
    segment: 'all',
    steps: [
      {
        id: 1,
        title: 'Send Opening DM',
        instruction: 'Use the appropriate cold DM script based on their segment.',
        branches: null
      },
      {
        id: 2,
        title: 'Wait for Response',
        instruction: 'Wait 2-3 days. If no response, go to step 3. If they respond, go to step 4.',
        branches: [
          { label: 'No response', nextStep: 3 },
          { label: 'They responded', nextStep: 4 }
        ]
      },
      {
        id: 3,
        title: 'Send Follow-up Bump',
        instruction: 'Send a short, friendly bump: "Hey [Name], just bumping this in case it got buried. No worries if not interested!"',
        branches: [
          { label: 'Still no response', nextStep: 'end-cold' },
          { label: 'They responded', nextStep: 4 }
        ]
      },
      {
        id: 4,
        title: 'Handle Their Response',
        instruction: 'Read their response and choose the appropriate path:',
        branches: [
          { label: 'Interested / wants demo', nextStep: 5 },
          { label: 'Has objection', nextStep: 6 },
          { label: 'Not interested', nextStep: 'end-rejected' }
        ]
      },
      {
        id: 5,
        title: 'Send Demo Link',
        instruction: 'Great! Send them the demo video link and offer to answer questions. "Awesome! Here\'s a quick 2-min video showing how it works: [LINK]. Happy to answer any questions after you watch it."',
        branches: [
          { label: 'They watched, still interested', nextStep: 7 },
          { label: 'Went cold', nextStep: 'end-cold' }
        ]
      },
      {
        id: 6,
        title: 'Handle Objection',
        instruction: 'Use the Objection Handler page to find the right response. After responding:',
        branches: [
          { label: 'Objection handled, interested', nextStep: 5 },
          { label: 'Still not convinced', nextStep: 'end-rejected' }
        ]
      },
      {
        id: 7,
        title: 'Close - Share Signup Link',
        instruction: 'They\'re ready! Share the signup link: "Ready to try it? Here\'s where you can get started: [SIGNUP LINK]. Starter is $15/mo, Pro is $29/mo if you have multiple clients."',
        branches: [
          { label: 'They signed up', nextStep: 'end-converted' },
          { label: 'Need more time', nextStep: 'end-nurture' }
        ]
      },
      {
        id: 'end-converted',
        title: 'Converted!',
        instruction: 'Mark prospect as Converted. Send a welcome message and offer to help with setup.',
        branches: null,
        isEnd: true,
        endType: 'success'
      },
      {
        id: 'end-nurture',
        title: 'Nurture - Follow Up Later',
        instruction: 'Mark prospect as "Responded". Set a reminder to follow up in 1-2 weeks.',
        branches: null,
        isEnd: true,
        endType: 'nurture'
      },
      {
        id: 'end-cold',
        title: 'Gone Cold',
        instruction: 'Mark prospect as "Engaged" (they saw it but didn\'t convert). May revisit later.',
        branches: null,
        isEnd: true,
        endType: 'cold'
      },
      {
        id: 'end-rejected',
        title: 'Not a Fit',
        instruction: 'Mark prospect as "Rejected". Thank them and move on.',
        branches: null,
        isEnd: true,
        endType: 'rejected'
      }
    ]
  },
  {
    id: 'reddit-engagement-flow',
    name: 'Reddit Post Engagement',
    segment: 'all',
    steps: [
      {
        id: 1,
        title: 'Post Helpful Reply',
        instruction: 'Reply to their post with genuine help first. Use Reddit reply scripts - don\'t pitch immediately.',
        branches: null
      },
      {
        id: 2,
        title: 'Wait for Engagement',
        instruction: 'Wait for them to reply or DM you. If they ask "what tool?", go to step 3.',
        branches: [
          { label: 'They asked about the tool', nextStep: 3 },
          { label: 'No engagement', nextStep: 'end-cold' }
        ]
      },
      {
        id: 3,
        title: 'Share Product Name',
        instruction: 'Reply naturally: "It\'s called Content Curator - [brief description]. Happy to share more if you want."',
        branches: [
          { label: 'They want more info', nextStep: 4 },
          { label: 'No further interest', nextStep: 'end-cold' }
        ]
      },
      {
        id: 4,
        title: 'Move to DM',
        instruction: 'Suggest moving to DM for details: "Want me to DM you the link? Don\'t want to spam the thread."',
        branches: [
          { label: 'They agreed to DM', nextStep: 5 },
          { label: 'They declined', nextStep: 'end-cold' }
        ]
      },
      {
        id: 5,
        title: 'Continue in DM',
        instruction: 'Now follow the Cold DM Outreach flow starting at step 5 (Send Demo Link).',
        branches: null,
        isEnd: true,
        endType: 'handoff'
      },
      {
        id: 'end-cold',
        title: 'No Conversion',
        instruction: 'That\'s okay - you added value to the thread which builds credibility. Move on.',
        branches: null,
        isEnd: true,
        endType: 'cold'
      }
    ]
  }
]
```

**Step 2: Create the flows page**

```jsx
// src/pages/sales/ConversationFlows.jsx
import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { defaultFlows } from '../../config/flowsData'

export default function ConversationFlows() {
  const [selectedFlow, setSelectedFlow] = useState(defaultFlows[0])
  const [currentStepId, setCurrentStepId] = useState(1)

  const currentStep = selectedFlow.steps.find(s => s.id === currentStepId)

  const handleBranch = (nextStep) => {
    setCurrentStepId(nextStep)
  }

  const handleReset = () => {
    setCurrentStepId(1)
  }

  const getEndTypeStyle = (endType) => {
    switch (endType) {
      case 'success': return 'bg-green-100 border-green-500 text-green-800'
      case 'nurture': return 'bg-blue-100 border-blue-500 text-blue-800'
      case 'cold': return 'bg-gray-100 border-gray-500 text-gray-800'
      case 'rejected': return 'bg-red-100 border-red-500 text-red-800'
      case 'handoff': return 'bg-purple-100 border-purple-500 text-purple-800'
      default: return 'bg-gray-100 border-gray-500 text-gray-800'
    }
  }

  return (
    <SalesLayout title="Conversation Flows">
      <p className="text-gray-600 mb-6">
        Step-by-step guides for common sales conversations. Click through as the conversation progresses.
      </p>

      {/* Flow selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Select flow:</label>
          <select
            value={selectedFlow.id}
            onChange={(e) => {
              const flow = defaultFlows.find(f => f.id === e.target.value)
              setSelectedFlow(flow)
              setCurrentStepId(1)
            }}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            {defaultFlows.map(flow => (
              <option key={flow.id} value={flow.id}>{flow.name}</option>
            ))}
          </select>
          <button
            onClick={handleReset}
            className="ml-auto text-sm text-purple-600 hover:text-purple-800"
          >
            Start Over
          </button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto">
          {selectedFlow.steps.filter(s => !s.isEnd).map((step, i) => (
            <div key={step.id} className="flex items-center">
              {i > 0 && <span className="mx-2">→</span>}
              <button
                onClick={() => setCurrentStepId(step.id)}
                className={`px-2 py-1 rounded whitespace-nowrap ${
                  step.id === currentStepId
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'hover:bg-gray-100'
                }`}
              >
                {step.id}. {step.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Current step */}
      {currentStep && (
        <div className={`bg-white rounded-lg shadow overflow-hidden ${
          currentStep.isEnd ? 'border-2 ' + getEndTypeStyle(currentStep.endType) : ''
        }`}>
          <div className={`p-4 ${currentStep.isEnd ? getEndTypeStyle(currentStep.endType) : 'bg-purple-50'}`}>
            <div className="flex items-center gap-3">
              <span className="bg-purple-600 text-white text-sm font-bold px-2 py-1 rounded">
                {currentStep.isEnd ? 'END' : `Step ${currentStep.id}`}
              </span>
              <h2 className="text-lg font-semibold text-gray-800">{currentStep.title}</h2>
            </div>
          </div>

          <div className="p-4">
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{currentStep.instruction}</p>

            {currentStep.instruction.includes('"') && (
              <div className="mb-4">
                <CopyButton
                  text={currentStep.instruction.match(/"([^"]+)"/)?.[1] || ''}
                />
              </div>
            )}

            {currentStep.branches && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-3">What happened?</p>
                <div className="flex flex-wrap gap-2">
                  {currentStep.branches.map((branch, i) => (
                    <button
                      key={i}
                      onClick={() => handleBranch(branch.nextStep)}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 text-sm"
                    >
                      {branch.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep.isEnd && (
              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  Start New Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </SalesLayout>
  )
}
```

**Step 3: Update barrel export**

Add to `src/pages/sales/index.js`:

```javascript
export { default as ConversationFlows } from './ConversationFlows'
```

**Step 4: Update navigation**

In `src/components/sales/SalesNav.jsx`, add after the Video Script link:

```jsx
<NavLink to="/sales/flows" className={linkClass}>Flows</NavLink>
```

**Step 5: Add route**

In `src/App.jsx`, add the import and route:

```jsx
// Add to import
import { ScriptLibrary, ObjectionHandler, ICPReference, VideoScript, ConversationFlows } from './pages/sales'

// Add route
<Route path="/sales/flows" element={<ConversationFlows />} />
```

**Step 6: Commit**

```bash
git add src/config/flowsData.js src/pages/sales/ConversationFlows.jsx src/pages/sales/index.js src/components/sales/SalesNav.jsx src/App.jsx
git commit -m "feat(sales): add conversation flows with step-by-step guidance"
```

---

## Phase 3: Reddit Search & Prospect Pipeline

### Overview

Add Reddit search functionality to find prospects and a pipeline to track them through the sales process.

---

### Task 17: Create Reddit Search Service

**Files:**
- Create: `src/services/sales/RedditService.js`

**Step 1: Create Reddit search service**

```javascript
// src/services/sales/RedditService.js

const REDDIT_BASE = 'https://www.reddit.com'

// Pre-configured searches for ICP signals
export const presetSearches = [
  {
    id: 'sm-help-smallbiz',
    name: 'Social media help (r/smallbusiness)',
    subreddit: 'smallbusiness',
    query: 'social media help OR social media struggling OR social media time',
    segment: 'business-owner'
  },
  {
    id: 'chatgpt-social',
    name: 'ChatGPT for social media (r/ChatGPT)',
    subreddit: 'ChatGPT',
    query: 'social media posts OR content creation OR marketing',
    segment: 'chatgpt-struggler'
  },
  {
    id: 'overwhelmed-freelance',
    name: 'Overwhelmed freelancers (r/freelance)',
    subreddit: 'freelance',
    query: 'overwhelmed clients OR too many clients OR burning out',
    segment: 'freelancer'
  },
  {
    id: 'smm-tools',
    name: 'Tool recommendations (r/socialmedia)',
    subreddit: 'socialmedia',
    query: 'tool recommendation OR what do you use OR best tool',
    segment: 'freelancer'
  },
  {
    id: 'entrepreneur-marketing',
    name: 'Marketing struggles (r/entrepreneur)',
    subreddit: 'entrepreneur',
    query: 'marketing struggle OR social media OR content creation',
    segment: 'business-owner'
  }
]

export const RedditService = {
  async search({ subreddit, query, sort = 'new', time = 'week', limit = 25 }) {
    const url = new URL(`${REDDIT_BASE}/r/${subreddit}/search.json`)
    url.searchParams.set('q', query)
    url.searchParams.set('restrict_sr', 'true')
    url.searchParams.set('sort', sort)
    url.searchParams.set('t', time)
    url.searchParams.set('limit', limit.toString())

    try {
      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`)
      }

      const data = await response.json()

      return data.data.children.map(child => ({
        id: child.data.id,
        title: child.data.title,
        selftext: child.data.selftext?.substring(0, 300) || '',
        author: child.data.author,
        subreddit: child.data.subreddit,
        url: `${REDDIT_BASE}${child.data.permalink}`,
        score: child.data.score,
        numComments: child.data.num_comments,
        createdUtc: child.data.created_utc,
        createdAt: new Date(child.data.created_utc * 1000).toLocaleDateString()
      }))
    } catch (error) {
      console.error('Reddit search error:', error)
      throw error
    }
  },

  async runPresetSearch(presetId) {
    const preset = presetSearches.find(p => p.id === presetId)
    if (!preset) throw new Error('Preset not found')

    return this.search({
      subreddit: preset.subreddit,
      query: preset.query
    })
  }
}
```

**Step 2: Commit**

```bash
git add src/services/sales/RedditService.js
git commit -m "feat(sales): add Reddit search service with preset searches"
```

---

### Task 18: Create Prospect Pipeline Page

**Files:**
- Create: `src/pages/sales/ProspectPipeline.jsx`

**Step 1: Create the pipeline page**

```jsx
// src/pages/sales/ProspectPipeline.jsx
import { useState, useEffect } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import { SalesService } from '../../services/sales/SalesService'

const statuses = [
  { id: 'found', label: 'Found', color: 'bg-gray-100 text-gray-700' },
  { id: 'engaged', label: 'Engaged', color: 'bg-blue-100 text-blue-700' },
  { id: 'responded', label: 'Responded', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' }
]

export default function ProspectPipeline() {
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editNotes, setEditNotes] = useState('')

  useEffect(() => {
    loadProspects()
  }, [filter])

  const loadProspects = async () => {
    setLoading(true)
    const data = await SalesService.getProspects(filter ? { status: filter } : {})
    setProspects(data)
    setLoading(false)
  }

  const updateStatus = async (id, newStatus) => {
    await SalesService.updateProspect(id, { status: newStatus })
    loadProspects()
  }

  const saveNotes = async (id) => {
    await SalesService.updateProspect(id, { notes: editNotes })
    setEditingId(null)
    loadProspects()
  }

  const deleteProspect = async (id) => {
    if (!confirm('Delete this prospect?')) return
    await SalesService.deleteProspect(id)
    loadProspects()
  }

  const getStatusColor = (status) => {
    return statuses.find(s => s.id === status)?.color || 'bg-gray-100'
  }

  return (
    <SalesLayout title="Prospect Pipeline">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">Filter by status:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('')}
              className={`px-3 py-1 rounded text-sm ${!filter ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            {statuses.map(s => (
              <button
                key={s.id}
                onClick={() => setFilter(s.id)}
                className={`px-3 py-1 rounded text-sm ${filter === s.id ? 'bg-purple-600 text-white' : s.color + ' hover:opacity-80'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-gray-500">
            {prospects.length} prospect{prospects.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Pipeline counts */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {statuses.map(s => {
          const count = prospects.filter(p => p.status === s.id).length
          return (
            <div key={s.id} className={`rounded-lg p-4 ${s.color}`}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm">{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Prospects list */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : prospects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No prospects yet. Use Reddit Search or Lead Generator to find prospects.
        </div>
      ) : (
        <div className="space-y-3">
          {prospects.map(prospect => (
            <div key={prospect.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(prospect.status)}`}>
                      {statuses.find(s => s.id === prospect.status)?.label}
                    </span>
                    <span className="text-xs text-gray-400">{prospect.source}</span>
                    {prospect.industry && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                        {prospect.industry}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-800">
                    {prospect.business_name || prospect.source_url?.substring(0, 50) || 'Unknown'}
                  </h3>
                  {prospect.website && (
                    <a
                      href={prospect.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {prospect.website}
                    </a>
                  )}
                  {prospect.source_url && (
                    <a
                      href={prospect.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:text-blue-800"
                    >
                      View source →
                    </a>
                  )}

                  {/* Notes */}
                  {editingId === prospect.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        rows={2}
                        placeholder="Add notes..."
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => saveNotes(prospect.id)}
                          className="text-xs text-green-600 hover:text-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2">
                      {prospect.notes ? (
                        <p className="text-sm text-gray-600">{prospect.notes}</p>
                      ) : null}
                      <button
                        onClick={() => {
                          setEditingId(prospect.id)
                          setEditNotes(prospect.notes || '')
                        }}
                        className="text-xs text-purple-600 hover:text-purple-800 mt-1"
                      >
                        {prospect.notes ? 'Edit notes' : 'Add notes'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Status buttons */}
                <div className="flex flex-col gap-1 ml-4">
                  <select
                    value={prospect.status}
                    onChange={(e) => updateStatus(prospect.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    {statuses.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => deleteProspect(prospect.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SalesLayout>
  )
}
```

**Step 2: Commit**

```bash
git add src/pages/sales/ProspectPipeline.jsx
git commit -m "feat(sales): add prospect pipeline with status tracking and notes"
```

---

### Task 19: Create Reddit Search Page

**Files:**
- Create: `src/pages/sales/RedditSearch.jsx`

**Step 1: Create Reddit search page**

```jsx
// src/pages/sales/RedditSearch.jsx
import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import { RedditService, presetSearches } from '../../services/sales/RedditService'
import { SalesService } from '../../services/sales/SalesService'
import { segments } from '../../config/salesData'

export default function RedditSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPreset, setSelectedPreset] = useState('')
  const [customSubreddit, setCustomSubreddit] = useState('')
  const [customQuery, setCustomQuery] = useState('')
  const [addedIds, setAddedIds] = useState(new Set())

  const handlePresetSearch = async (presetId) => {
    setLoading(true)
    setError('')
    setSelectedPreset(presetId)
    try {
      const data = await RedditService.runPresetSearch(presetId)
      setResults(data)
    } catch (err) {
      setError('Search failed: ' + err.message)
    }
    setLoading(false)
  }

  const handleCustomSearch = async () => {
    if (!customSubreddit || !customQuery) {
      setError('Enter both subreddit and search query')
      return
    }
    setLoading(true)
    setError('')
    setSelectedPreset('')
    try {
      const data = await RedditService.search({
        subreddit: customSubreddit,
        query: customQuery
      })
      setResults(data)
    } catch (err) {
      setError('Search failed: ' + err.message)
    }
    setLoading(false)
  }

  const addToProspects = async (post) => {
    const preset = presetSearches.find(p => p.id === selectedPreset)
    try {
      await SalesService.addProspect({
        source: 'reddit',
        source_url: post.url,
        business_name: `u/${post.author}: ${post.title.substring(0, 50)}...`,
        status: 'found',
        notes: `Subreddit: r/${post.subreddit}\nTitle: ${post.title}\n\nSnippet: ${post.selftext.substring(0, 200)}...`
      })
      setAddedIds(prev => new Set([...prev, post.id]))
    } catch (err) {
      alert('Failed to add: ' + err.message)
    }
  }

  return (
    <SalesLayout title="Reddit Search">
      <p className="text-gray-600 mb-6">
        Find prospects by searching Reddit for ICP signals. Add promising posts to your pipeline.
      </p>

      {/* Preset searches */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Quick Searches</h3>
        <div className="flex flex-wrap gap-2">
          {presetSearches.map(preset => {
            const segment = segments.find(s => s.id === preset.segment)
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSearch(preset.id)}
                className={`px-3 py-2 rounded text-sm ${
                  selectedPreset === preset.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset.name}
                <span className="ml-2 text-xs opacity-70">({segment?.shortName})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Custom search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Custom Search</h3>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Subreddit</label>
            <div className="flex items-center">
              <span className="text-gray-400 mr-1">r/</span>
              <input
                type="text"
                value={customSubreddit}
                onChange={(e) => setCustomSubreddit(e.target.value)}
                placeholder="smallbusiness"
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
              />
            </div>
          </div>
          <div className="flex-[2]">
            <label className="block text-xs text-gray-500 mb-1">Search query</label>
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="social media help OR marketing struggle"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCustomSearch}
              disabled={loading}
              className="px-4 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Searching Reddit...</div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          <div className="text-sm text-gray-500 mb-2">{results.length} results</div>
          {results.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      r/{post.subreddit}
                    </span>
                    <span className="text-xs text-gray-400">
                      {post.createdAt} · {post.score} pts · {post.numComments} comments
                    </span>
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-800 hover:text-purple-600"
                  >
                    {post.title}
                  </a>
                  {post.selftext && (
                    <p className="text-sm text-gray-600 mt-1">
                      {post.selftext}...
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">by u/{post.author}</p>
                </div>
                <div className="ml-4">
                  {addedIds.has(post.id) ? (
                    <span className="text-xs text-green-600">Added ✓</span>
                  ) : (
                    <button
                      onClick={() => addToProspects(post)}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      Add to Pipeline
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : selectedPreset || customQuery ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No results found. Try a different search.
        </div>
      ) : null}
    </SalesLayout>
  )
}
```

**Step 2: Update exports and routes**

Add to `src/pages/sales/index.js`:
```javascript
export { default as RedditSearch } from './RedditSearch'
export { default as ProspectPipeline } from './ProspectPipeline'
```

Update `src/components/sales/SalesNav.jsx` to add links:
```jsx
<NavLink to="/sales/reddit" className={linkClass}>Reddit</NavLink>
<NavLink to="/sales/pipeline" className={linkClass}>Pipeline</NavLink>
```

Add routes in `src/App.jsx`:
```jsx
<Route path="/sales/reddit" element={<RedditSearch />} />
<Route path="/sales/pipeline" element={<ProspectPipeline />} />
```

**Step 3: Commit**

```bash
git add src/pages/sales/RedditSearch.jsx src/services/sales/RedditService.js src/pages/sales/index.js src/components/sales/SalesNav.jsx src/App.jsx
git commit -m "feat(sales): add Reddit search and prospect pipeline integration"
```

---

## Phase 4: Lead Generator (Yelp + Website Analyzer)

### Overview

Search for businesses by industry and location using Yelp API, then analyze their websites to score them as prospects.

---

### Task 20: Create Industry Data Config

**Files:**
- Create: `src/config/industryData.js`

**Step 1: Create industry configuration**

```javascript
// src/config/industryData.js

export const industries = [
  {
    id: 'realtors',
    name: 'Realtors / Real Estate',
    yelpCategory: 'realestate',
    keywords: ['realtor', 'real estate agent', 'property'],
    flagged: false
  },
  {
    id: 'dentists',
    name: 'Dentists',
    yelpCategory: 'dentists',
    keywords: ['dentist', 'dental', 'orthodontist'],
    flagged: false
  },
  {
    id: 'chiropractors',
    name: 'Chiropractors',
    yelpCategory: 'chiropractors',
    keywords: ['chiropractor', 'chiropractic'],
    flagged: false
  },
  {
    id: 'salons',
    name: 'Hair Salons / Barbers',
    yelpCategory: 'hair',
    keywords: ['salon', 'barber', 'hair'],
    flagged: false
  },
  {
    id: 'fitness',
    name: 'Fitness / Personal Trainers',
    yelpCategory: 'fitness',
    keywords: ['gym', 'fitness', 'personal trainer'],
    flagged: false
  },
  {
    id: 'restaurants',
    name: 'Restaurants / Cafes',
    yelpCategory: 'restaurants',
    keywords: ['restaurant', 'cafe', 'food'],
    flagged: false
  },
  {
    id: 'contractors',
    name: 'Contractors (HVAC, Plumbing)',
    yelpCategory: 'contractors',
    keywords: ['hvac', 'plumbing', 'electrical', 'contractor'],
    flagged: false
  },
  {
    id: 'auto',
    name: 'Auto Repair / Detailing',
    yelpCategory: 'auto',
    keywords: ['auto', 'car', 'mechanic', 'detailing'],
    flagged: true,
    flagMessage: 'Caution: Potential conflict with employer. Verify before outreach.'
  },
  {
    id: 'lawyers',
    name: 'Lawyers / Law Firms',
    yelpCategory: 'lawyers',
    keywords: ['lawyer', 'attorney', 'law firm'],
    flagged: false
  },
  {
    id: 'accountants',
    name: 'Accountants / CPAs',
    yelpCategory: 'accountants',
    keywords: ['accountant', 'cpa', 'bookkeeping'],
    flagged: false
  }
]

export const scoringCriteria = {
  noWebsite: 30,           // High score - definitely needs help
  noBlog: 20,              // Good signal
  oldBlog: 15,             // Blog exists but outdated (>30 days)
  noSocialLinks: 15,       // Missing social presence
  fewSocialLinks: 10,      // Has 1-2 but not all 4
  lowReviews: 10,          // Under 20 reviews
  newBusiness: 10          // Under 2 years old
}
```

**Step 2: Commit**

```bash
git add src/config/industryData.js
git commit -m "feat(sales): add industry configuration with Yelp categories"
```

---

### Task 21: Create Website Analyzer Service

**Files:**
- Create: `src/services/sales/WebsiteAnalyzer.js`

**Step 1: Create website analyzer**

```javascript
// src/services/sales/WebsiteAnalyzer.js

export const WebsiteAnalyzer = {
  async analyze(url) {
    try {
      // Use a CORS proxy or serverless function in production
      // For now, we'll do a simple check via fetch
      const response = await fetch(url, {
        mode: 'no-cors',
        signal: AbortSignal.timeout(5000)
      })

      // Since no-cors doesn't give us content, we'll score based on URL patterns
      // In production, use a serverless function to fetch and parse HTML
      return this.analyzeUrl(url)
    } catch (error) {
      console.error('Website fetch failed:', error)
      return this.analyzeUrl(url)
    }
  },

  analyzeUrl(url) {
    const score = { total: 0, signals: [] }
    const urlLower = url.toLowerCase()

    // Check for common platforms (indicates DIY approach)
    if (urlLower.includes('wix.') || urlLower.includes('squarespace.') || urlLower.includes('weebly.')) {
      score.signals.push({ signal: 'DIY website builder', points: 10, positive: true })
      score.total += 10
    }

    // Check for social links in URL (basic heuristic)
    const hasFacebook = urlLower.includes('facebook')
    const hasInstagram = urlLower.includes('instagram')

    if (!hasFacebook && !hasInstagram) {
      score.signals.push({ signal: 'No obvious social links', points: 15, positive: true })
      score.total += 15
    }

    // Default score for having a website
    score.signals.push({ signal: 'Has website', points: 0, positive: false })

    return score
  },

  // Simple scoring for when we only have Yelp data
  scoreFromYelp(business) {
    const score = { total: 0, signals: [] }

    // No website
    if (!business.url) {
      score.signals.push({ signal: 'No website', points: 30, positive: true })
      score.total += 30
    }

    // Low review count
    if (business.review_count < 20) {
      score.signals.push({ signal: `Only ${business.review_count} reviews`, points: 10, positive: true })
      score.total += 10
    }

    // Lower rating might mean they need help with reputation
    if (business.rating < 4.0) {
      score.signals.push({ signal: `${business.rating} star rating`, points: 5, positive: true })
      score.total += 5
    }

    // Businesses with lots of reviews are established, might have budget
    if (business.review_count > 100) {
      score.signals.push({ signal: 'Established business (100+ reviews)', points: 10, positive: true })
      score.total += 10
    }

    return score
  }
}
```

**Step 2: Commit**

```bash
git add src/services/sales/WebsiteAnalyzer.js
git commit -m "feat(sales): add website analyzer service with scoring"
```

---

### Task 22: Create Lead Generator Page

**Files:**
- Create: `src/pages/sales/LeadGenerator.jsx`

**Step 1: Create lead generator page**

Note: Yelp API requires a backend proxy due to CORS. For the MVP, we'll create the UI and simulate results. The actual Yelp integration requires a Supabase Edge Function.

```jsx
// src/pages/sales/LeadGenerator.jsx
import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import { industries } from '../../config/industryData'
import { WebsiteAnalyzer } from '../../services/sales/WebsiteAnalyzer'
import { SalesService } from '../../services/sales/SalesService'

export default function LeadGenerator() {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [addedIds, setAddedIds] = useState(new Set())

  const industry = industries.find(i => i.id === selectedIndustry)

  const handleSearch = async () => {
    if (!selectedIndustry || !location) {
      setError('Select an industry and enter a location')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Call Supabase Edge Function that wraps Yelp API
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/yelp-search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            term: industry.yelpCategory,
            location: location,
            limit: 20
          })
        }
      )

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()

      // Score each business
      const scoredResults = data.businesses.map(biz => ({
        ...biz,
        score: WebsiteAnalyzer.scoreFromYelp(biz)
      }))

      // Sort by score descending
      scoredResults.sort((a, b) => b.score.total - a.score.total)

      setResults(scoredResults)
    } catch (err) {
      setError('Search failed. Make sure the Yelp Edge Function is deployed.')
      console.error(err)
    }

    setLoading(false)
  }

  const addToProspects = async (business) => {
    try {
      await SalesService.addProspect({
        source: 'yelp',
        source_url: business.url,
        business_name: business.name,
        website: business.url,
        industry: selectedIndustry,
        location: `${business.location?.city}, ${business.location?.state}`,
        score: business.score.total,
        status: 'found',
        notes: `Rating: ${business.rating} stars\nReviews: ${business.review_count}\n\nScoring:\n${business.score.signals.map(s => `- ${s.signal}: +${s.points}`).join('\n')}`
      })
      setAddedIds(prev => new Set([...prev, business.id]))
    } catch (err) {
      alert('Failed to add: ' + err.message)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 40) return 'bg-green-100 text-green-700'
    if (score >= 20) return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <SalesLayout title="Lead Generator">
      <p className="text-gray-600 mb-6">
        Search for businesses by industry and location. Each result is scored based on signals that indicate they might need help with social media.
      </p>

      {/* Industry warning */}
      {industry?.flagged && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm font-medium">{industry.flagMessage}</p>
        </div>
      )}

      {/* Search form */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select industry...</option>
              {industries.map(ind => (
                <option key={ind.id} value={ind.id}>
                  {ind.flagged ? '⚠️ ' : ''}{ind.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State or Zip"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Find Leads'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-gray-500 mb-2">
            {results.length} businesses found · Sorted by prospect score
          </div>
          {results.map(biz => (
            <div key={biz.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${getScoreColor(biz.score.total)}`}>
                      Score: {biz.score.total}
                    </span>
                    <span className="text-xs text-gray-400">
                      {biz.rating}★ · {biz.review_count} reviews
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800">{biz.name}</h3>
                  <p className="text-sm text-gray-600">
                    {biz.location?.address1}, {biz.location?.city}, {biz.location?.state}
                  </p>
                  {biz.url && (
                    <a
                      href={biz.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View on Yelp →
                    </a>
                  )}

                  {/* Score breakdown */}
                  <div className="mt-2 text-xs text-gray-500">
                    {biz.score.signals.filter(s => s.positive).map((s, i) => (
                      <span key={i} className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded mr-1 mb-1">
                        {s.signal}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4">
                  {addedIds.has(biz.id) ? (
                    <span className="text-xs text-green-600">Added ✓</span>
                  ) : (
                    <button
                      onClick={() => addToProspects(biz)}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      Add to Pipeline
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SalesLayout>
  )
}
```

**Step 2: Update exports and routes**

Add to `src/pages/sales/index.js`:
```javascript
export { default as LeadGenerator } from './LeadGenerator'
```

Update `src/components/sales/SalesNav.jsx`:
```jsx
<NavLink to="/sales/leads" className={linkClass}>Leads</NavLink>
```

Add route in `src/App.jsx`:
```jsx
<Route path="/sales/leads" element={<LeadGenerator />} />
```

**Step 3: Commit**

```bash
git add src/pages/sales/LeadGenerator.jsx src/config/industryData.js src/services/sales/WebsiteAnalyzer.js src/pages/sales/index.js src/components/sales/SalesNav.jsx src/App.jsx
git commit -m "feat(sales): add lead generator with industry search and scoring"
```

---

### Task 23: Create Yelp Edge Function

**Files:**
- Create: `supabase/functions/yelp-search/index.ts`

**Step 1: Create the Edge Function**

```typescript
// supabase/functions/yelp-search/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const YELP_API_KEY = Deno.env.get('YELP_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { term, location, limit = 20 } = await req.json()

    const url = new URL('https://api.yelp.com/v3/businesses/search')
    url.searchParams.set('term', term)
    url.searchParams.set('location', location)
    url.searchParams.set('limit', limit.toString())

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${YELP_API_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`Yelp API error: ${response.status}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

**Step 2: Document Yelp API setup**

Add to README or create `supabase/functions/yelp-search/README.md`:

```markdown
# Yelp Search Edge Function

## Setup

1. Get a Yelp API key from https://www.yelp.com/developers
2. Set the secret in Supabase:
   ```bash
   supabase secrets set YELP_API_KEY=your-api-key
   ```
3. Deploy the function:
   ```bash
   supabase functions deploy yelp-search
   ```

## Usage

POST to `/functions/v1/yelp-search` with body:
```json
{
  "term": "dentists",
  "location": "Boston, MA",
  "limit": 20
}
```
```

**Step 3: Commit**

```bash
git add supabase/functions/yelp-search/
git commit -m "feat(sales): add Yelp search Edge Function"
```

---

## Phase 5: Export Features

### Task 24: Add CSV Export to Pipeline

**Files:**
- Modify: `src/pages/sales/ProspectPipeline.jsx`

**Step 1: Add export function**

Add this function inside the component:

```javascript
const exportToCSV = () => {
  const headers = ['Name', 'Website', 'Industry', 'Location', 'Status', 'Score', 'Source', 'Notes', 'Created']
  const rows = prospects.map(p => [
    p.business_name || '',
    p.website || '',
    p.industry || '',
    p.location || '',
    p.status,
    p.score || '',
    p.source,
    (p.notes || '').replace(/"/g, '""'),
    new Date(p.created_at).toLocaleDateString()
  ])

  const csv = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `prospects-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
```

Add export button to the filters section:

```jsx
<button
  onClick={exportToCSV}
  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
>
  Export CSV
</button>
```

**Step 2: Commit**

```bash
git add src/pages/sales/ProspectPipeline.jsx
git commit -m "feat(sales): add CSV export to prospect pipeline"
```

---

## Summary

**Complete Sales Tool Feature Set:**

| Phase | Features |
|-------|----------|
| Phase 1 | Script Library, Objections, ICP, Video Script, Password Gate |
| Phase 2 | Editable Scripts (Supabase), Conversation Flows |
| Phase 3 | Reddit Search, Prospect Pipeline with Status/Notes |
| Phase 4 | Lead Generator (Yelp + Scoring), Industry Config |
| Phase 5 | CSV Export for Prospects |

**Files Created:**
- `src/config/salesData.js`
- `src/config/flowsData.js`
- `src/config/industryData.js`
- `src/components/sales/SalesGate.jsx`
- `src/components/sales/CopyButton.jsx`
- `src/components/sales/SalesNav.jsx`
- `src/components/sales/SalesLayout.jsx`
- `src/services/sales/SalesService.js`
- `src/services/sales/RedditService.js`
- `src/services/sales/WebsiteAnalyzer.js`
- `src/pages/sales/ScriptLibrary.jsx`
- `src/pages/sales/ObjectionHandler.jsx`
- `src/pages/sales/ICPReference.jsx`
- `src/pages/sales/VideoScript.jsx`
- `src/pages/sales/ConversationFlows.jsx`
- `src/pages/sales/RedditSearch.jsx`
- `src/pages/sales/ProspectPipeline.jsx`
- `src/pages/sales/LeadGenerator.jsx`
- `src/pages/sales/index.js`
- `supabase/functions/yelp-search/index.ts`

**Files Modified:**
- `src/App.jsx`

**Supabase Tables:**
- `sales_scripts`
- `sales_flows`
- `sales_prospects`

**External APIs:**
- Reddit (free, public JSON API)
- Yelp Fusion (free tier, 5000 calls/day)
