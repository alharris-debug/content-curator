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

## Phase 2: Prospect Finder (Future)

### Overview

Add a tool that takes industry/location/segment inputs and outputs a list of communities to find prospects.

### Tasks (to be expanded later)

1. Create `src/config/communityData.js` with curated list of subreddits, Facebook groups, LinkedIn searches by industry
2. Create `ProspectFinder.jsx` page with input form
3. Add filtering and matching logic
4. Add "Save search" functionality (requires Supabase table)
5. Optional: Claude API integration for AI-suggested communities

---

## Summary

**Phase 1 delivers:**
- Password-protected sales tool at `/sales`
- Script Library with segment/channel/type filtering
- One-click copy with placeholder highlighting
- Objection Handler with accordion UI
- ICP Reference with value props and platform links
- Video Script reference with recording tips

**Files created:**
- `src/config/salesData.js`
- `src/components/sales/SalesGate.jsx`
- `src/components/sales/CopyButton.jsx`
- `src/components/sales/SalesNav.jsx`
- `src/components/sales/SalesLayout.jsx`
- `src/pages/sales/ScriptLibrary.jsx`
- `src/pages/sales/ObjectionHandler.jsx`
- `src/pages/sales/ICPReference.jsx`
- `src/pages/sales/VideoScript.jsx`
- `src/pages/sales/index.js`

**Files modified:**
- `src/App.jsx` (add routes)
