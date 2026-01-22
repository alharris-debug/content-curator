// Conversation Flows for Sales Outreach
// Linear flows with light branching based on prospect responses

export const defaultFlows = [
  {
    id: 'cold-dm-business-owner',
    name: 'Cold DM - Business Owner',
    segment: 'business-owner',
    description: 'Initial outreach flow for small business owners discovered via social media or directories',
    steps: [
      {
        id: 1,
        type: 'message',
        label: 'Opening Message',
        content: `Hey [Name]! I noticed [specific observation about their business/content]. Love what you're doing with [Business Name].

Quick question - are you handling your own social media content, or do you have someone managing it for you?`,
        notes: 'Personalization is key. Reference something specific you saw.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'I handle it myself', nextStep: 2 },
          { response: 'Someone helps me / Agency', nextStep: 5 },
          { response: 'No response after 3 days', nextStep: 6 }
        ]
      },
      {
        id: 2,
        type: 'message',
        label: 'Follow-up: DIY Response',
        content: `That's what I figured! Most business owners I talk to are in the same boat - wearing all the hats.

How much time would you say you spend each week on creating posts?`,
        notes: 'Getting them to quantify their time investment.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'Any time estimate given', nextStep: 3 },
          { response: 'Not much / Quick', nextStep: 7 },
          { response: 'No response after 2 days', nextStep: 8 }
        ]
      },
      {
        id: 3,
        type: 'message',
        label: 'Value Proposition',
        content: `That adds up! I've been working on something that might help - it's called Content Curator.

Basically, it creates scroll-stopping social posts in about 2 minutes. You give it your website and it learns your brand voice, then generates content that actually sounds like you.

Would you be open to seeing a quick demo? I can show you how it works in under 5 minutes.`,
        notes: 'Keep it benefit-focused, not feature-focused.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'Yes / Interested', nextStep: 4 },
          { response: 'Not right now / Later', nextStep: 9 },
          { response: 'No thanks', nextStep: 10 }
        ]
      },
      {
        id: 4,
        type: 'action',
        label: 'Schedule Demo',
        content: `Awesome! Here's my calendar link: [calendar link]

Pick any time that works for you. Looking forward to showing you what it can do!`,
        notes: 'Move to demo. This is a win!',
        waitTime: 'End of flow - Demo scheduled',
        branches: []
      },
      {
        id: 5,
        type: 'message',
        label: 'Already Has Help',
        content: `Nice! Always good to have support. If you don't mind me asking - are you happy with the results you're getting? Is it generating the engagement you're looking for?`,
        notes: 'Probe for pain points even with existing solution.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'Yes, happy', nextStep: 11 },
          { response: 'Could be better', nextStep: 3 }
        ]
      },
      {
        id: 6,
        type: 'message',
        label: 'Follow-up #1 (No Response)',
        content: `Hey [Name]! Just bumping this up - I know things get busy. Still curious about your social media setup if you have a sec to chat.`,
        notes: 'Gentle bump, acknowledge they\'re busy.',
        waitTime: 'Wait 4 more days',
        branches: [
          { response: 'Any response', nextStep: 2 },
          { response: 'Still no response', nextStep: 12 }
        ]
      },
      {
        id: 7,
        type: 'message',
        label: 'Quick/Easy Response',
        content: `That's great that you've got a system! Out of curiosity, what are you using to create your content? Always interested to hear what's working for people.`,
        notes: 'They might be underselling the time spent, or have a tool already.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'ChatGPT / AI', nextStep: 13 },
          { response: 'Manual / Templates', nextStep: 3 },
          { response: 'A tool/app', nextStep: 11 }
        ]
      },
      {
        id: 8,
        type: 'message',
        label: 'Follow-up #2 (No Response)',
        content: `Hey! No worries if social media isn't top of mind right now. If you ever want a quick way to create content that actually converts, I'm happy to chat. Have a great week!`,
        notes: 'Soft close, leave door open.',
        waitTime: 'End of flow',
        branches: []
      },
      {
        id: 9,
        type: 'message',
        label: 'Not Right Now',
        content: `Totally get it! No pressure at all. I'll check back in a few weeks. In the meantime, if anything changes or you want to explore it, just shoot me a message. Have a great one!`,
        notes: 'Set reminder to follow up in 2-3 weeks.',
        waitTime: 'End of flow - Follow up in 2-3 weeks',
        branches: []
      },
      {
        id: 10,
        type: 'message',
        label: 'No Thanks Response',
        content: `No problem! I appreciate you getting back to me. If you ever change your mind, my DMs are always open. Best of luck with [Business Name]!`,
        notes: 'Graceful exit, stay positive.',
        waitTime: 'End of flow',
        branches: []
      },
      {
        id: 11,
        type: 'message',
        label: 'Happy with Current Solution',
        content: `That's great to hear! Sounds like you've got it figured out. If anything ever changes or you want to compare options, feel free to reach out. Keep up the great work!`,
        notes: 'Graceful exit, don\'t push.',
        waitTime: 'End of flow',
        branches: []
      },
      {
        id: 12,
        type: 'action',
        label: 'Mark Cold - No Response',
        content: `No response after multiple attempts. Mark as cold and move on.`,
        notes: 'Don\'t keep chasing. Quality over quantity.',
        waitTime: 'End of flow',
        branches: []
      },
      {
        id: 13,
        type: 'message',
        label: 'ChatGPT User',
        content: `Ah nice! ChatGPT is great for a lot of things. Do you find you spend a lot of time prompting it and editing the output to sound like you?

That's actually why I built Content Curator - it learns your brand voice from your website, so every post sounds authentic without the back-and-forth.`,
        notes: 'Position against ChatGPT - brand voice is the differentiator.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'Interested', nextStep: 4 },
          { response: 'Happy with ChatGPT', nextStep: 11 }
        ]
      }
    ]
  },
  {
    id: 'cold-dm-freelancer',
    name: 'Cold DM - Freelance SMM',
    segment: 'freelancer',
    description: 'Outreach flow for freelance social media managers',
    steps: [
      {
        id: 1,
        type: 'message',
        label: 'Opening Message',
        content: `Hey [Name]! I came across your profile and saw you do social media management. Really impressive client roster!

Quick question - how many clients are you managing content for right now?`,
        notes: 'Establish they\'re active in SMM work.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'Gives number', nextStep: 2 },
          { response: 'No response after 3 days', nextStep: 5 }
        ]
      },
      {
        id: 2,
        type: 'message',
        label: 'Follow-up: Client Count',
        content: `Nice! That's a solid workload. I'm curious - what's your biggest bottleneck when creating content for all of them? Is it coming up with ideas, maintaining different brand voices, or something else?`,
        notes: 'Identify pain point.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'Ideas / Creativity', nextStep: 3 },
          { response: 'Brand voice consistency', nextStep: 4 },
          { response: 'Time / Volume', nextStep: 3 },
          { response: 'No real issues', nextStep: 6 }
        ]
      },
      {
        id: 3,
        type: 'message',
        label: 'Value Proposition - Time/Ideas',
        content: `I hear that a lot! That's actually why I built Content Curator - it's a tool specifically for people like you who manage multiple clients.

You add a client's website, it learns their brand voice, and then you can generate on-brand posts in about 2 minutes each. One subscription covers unlimited clients.

Would you be open to a quick demo? I can show you how it could fit into your workflow.`,
        notes: 'Emphasize multi-client efficiency.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'Yes / Interested', nextStep: 7 },
          { response: 'Not right now', nextStep: 8 },
          { response: 'No thanks', nextStep: 9 }
        ]
      },
      {
        id: 4,
        type: 'message',
        label: 'Value Proposition - Brand Voice',
        content: `Brand voice is SO hard to nail, especially when you're switching between clients all day!

That's the core problem Content Curator solves - it scrapes each client's website and learns their unique tone, so every post sounds like them, not like generic AI.

Want to see how it works? I can show you in under 5 minutes.`,
        notes: 'Lead with brand voice differentiator.',
        waitTime: 'Wait for response',
        branches: [
          { response: 'Yes / Interested', nextStep: 7 },
          { response: 'Not right now', nextStep: 8 },
          { response: 'No thanks', nextStep: 9 }
        ]
      },
      {
        id: 5,
        type: 'message',
        label: 'Follow-up #1 (No Response)',
        content: `Hey! Just bumping this - I know freelance life is busy. Would love to connect about your content creation process if you have a minute.`,
        notes: 'Single follow-up for cold DMs.',
        waitTime: 'Wait 4 more days, then end flow',
        branches: [
          { response: 'Any response', nextStep: 2 }
        ]
      },
      {
        id: 6,
        type: 'message',
        label: 'No Pain Points',
        content: `That's awesome - sounds like you've got a great system! If you ever want to explore tools to scale even more or take on extra clients, let me know. Always happy to chat about what's working for other SMMs.`,
        notes: 'Graceful exit, plant seed for scaling.',
        waitTime: 'End of flow',
        branches: []
      },
      {
        id: 7,
        type: 'action',
        label: 'Schedule Demo',
        content: `Perfect! Here's my calendar: [calendar link]

Grab any time that works. Looking forward to showing you how it can help with your client work!`,
        notes: 'Win! Move to demo.',
        waitTime: 'End of flow - Demo scheduled',
        branches: []
      },
      {
        id: 8,
        type: 'message',
        label: 'Not Right Now',
        content: `No rush at all! I'll circle back in a few weeks. In the meantime, if you want to check it out: contentcurator.app. Have a great one!`,
        notes: 'Leave breadcrumb, follow up later.',
        waitTime: 'End of flow - Follow up in 3 weeks',
        branches: []
      },
      {
        id: 9,
        type: 'message',
        label: 'No Thanks',
        content: `Totally understand! Thanks for getting back to me. If anything changes, my DMs are open. Best of luck with your clients!`,
        notes: 'Graceful exit.',
        waitTime: 'End of flow',
        branches: []
      }
    ]
  }
]

// Flow step types
export const stepTypes = {
  message: { label: 'Message', color: 'blue' },
  action: { label: 'Action', color: 'green' },
  note: { label: 'Note', color: 'yellow' }
}
