/**
 * Sales Data Configuration
 * Contains all data structures for the sales enablement hub
 */

// Customer segments targeting different user personas
export const segments = [
  { id: 'business-owner', label: 'Small Business Owners' },
  { id: 'freelancer', label: 'Freelance Social Media Managers' },
  { id: 'chatgpt-struggler', label: 'ChatGPT Strugglers' },
];

// Communication channels for outreach
export const channels = [
  { id: 'dm', label: 'Direct Message' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' },
];

// Types of sales scripts
export const scriptTypes = [
  { id: 'cold-outreach', label: 'Cold Outreach' },
  { id: 'social-post', label: 'Social Post' },
  { id: 'objection', label: 'Objection Handling' },
];

// Sales scripts with customizable placeholders
export const scripts = [
  // Cold DMs for each segment
  {
    id: 'cold-dm-business-owner',
    title: 'Cold DM - Small Business Owner',
    segment: 'business-owner',
    channel: 'dm',
    type: 'cold-outreach',
    content: `Hey [NAME],

I noticed you run [BUSINESS_NAME] and wanted to reach out. A lot of small business owners I talk to struggle with creating consistent social media content while juggling everything else.

I built Content Curator specifically for busy business owners - it helps you create a week's worth of posts in about 15 minutes. No more staring at a blank screen or spending hours trying to figure out what to post.

Would you be open to a quick 5-minute demo? I think you'd find it pretty valuable.

[YOUR_NAME]`,
    placeholders: ['NAME', 'BUSINESS_NAME', 'YOUR_NAME'],
  },
  {
    id: 'cold-dm-freelancer',
    title: 'Cold DM - Freelance Social Media Manager',
    segment: 'freelancer',
    channel: 'dm',
    type: 'cold-outreach',
    content: `Hey [NAME],

I saw you manage social media for clients and thought you might find this useful. Content Curator helps freelancers like you scale their client work without burning out.

Instead of spending hours creating content from scratch for each client, you can generate customized posts in minutes - giving you more time to take on new clients or actually enjoy your evenings.

A few freelancers I know are using it to manage 3-4x more clients. Want me to show you how it works?

[YOUR_NAME]`,
    placeholders: ['NAME', 'YOUR_NAME'],
  },
  {
    id: 'cold-dm-chatgpt-struggler',
    title: 'Cold DM - ChatGPT Struggler',
    segment: 'chatgpt-struggler',
    channel: 'dm',
    type: 'cold-outreach',
    content: `Hey [NAME],

I noticed your post about [TOPIC_THEY_POSTED_ABOUT]. A lot of people try using ChatGPT for social media content but end up frustrated because the output sounds robotic or needs tons of editing.

I built Content Curator to solve exactly that - it's trained specifically for social media, so you get posts that actually sound human and are ready to use. No more prompt engineering or endless rewrites.

Would a quick demo be helpful? I can show you how it compares to what you're doing now.

[YOUR_NAME]`,
    placeholders: ['NAME', 'TOPIC_THEY_POSTED_ABOUT', 'YOUR_NAME'],
  },
  // Reddit replies
  {
    id: 'reddit-reply-tools',
    title: 'Reddit Reply - Tool Recommendations',
    segment: 'chatgpt-struggler',
    channel: 'reddit',
    type: 'social-post',
    content: `I struggled with this exact problem for months. ChatGPT is great for a lot of things, but social media content always came out sounding... off.

What finally worked for me was using a tool specifically built for social media (Content Curator). The difference is it understands platform-specific formats, hooks, and engagement patterns.

Instead of spending 20 minutes editing each post, I just tweak a few words and I'm done. Might be worth checking out if you're still fighting with generic AI outputs.`,
    placeholders: [],
  },
  {
    id: 'reddit-reply-time',
    title: 'Reddit Reply - Time Saving',
    segment: 'business-owner',
    channel: 'reddit',
    type: 'social-post',
    content: `Fellow small business owner here. I used to spend my Sunday evenings batch-creating content for the week. It was exhausting.

Now I use Content Curator and honestly, it's cut my content creation time by about 80%. What used to take 3-4 hours takes me maybe 30-40 minutes now.

The key is finding tools that understand your audience and industry. Generic AI tools just don't cut it for this specific use case.`,
    placeholders: [],
  },
  // LinkedIn posts
  {
    id: 'linkedin-post-productivity',
    title: 'LinkedIn Post - Productivity Story',
    segment: 'business-owner',
    channel: 'linkedin',
    type: 'social-post',
    content: `Last year, I spent [HOURS] hours per week on social media content.

This year? About [NEW_HOURS] minutes.

Here's what changed:

I stopped treating content creation like a creative exercise and started treating it like a system.

The tools matter. I switched from generic AI to something built specifically for social media content.

But more importantly, I batch everything. One focused session beats scattered attempts throughout the week.

Small business owners: your time is your most valuable asset. Protect it.

What's eating up YOUR time that shouldn't be?`,
    placeholders: ['HOURS', 'NEW_HOURS'],
  },
  {
    id: 'linkedin-post-freelancer',
    title: 'LinkedIn Post - Freelancer Scaling',
    segment: 'freelancer',
    channel: 'linkedin',
    type: 'social-post',
    content: `Unpopular opinion: Freelance social media managers who don't use AI tools are leaving money on the table.

I used to cap out at [OLD_CLIENTS] clients because I simply ran out of hours.

Now I manage [NEW_CLIENTS] clients and work LESS than before.

The secret isn't working harder. It's working smarter with the right tools.

Content Curator lets me generate client-specific content in minutes instead of hours. That's not cheating - that's being strategic about your time.

The freelancers who embrace this shift will thrive. The ones who don't will keep burning out.

Which side are you on?`,
    placeholders: ['OLD_CLIENTS', 'NEW_CLIENTS'],
  },
  // Facebook posts
  {
    id: 'facebook-post-struggle',
    title: 'Facebook Post - Relatable Struggle',
    segment: 'chatgpt-struggler',
    channel: 'facebook',
    type: 'social-post',
    content: `Be honest... who else has spent way too long trying to get ChatGPT to write a decent social media post?

I'd write a prompt. Get garbage. Rewrite the prompt. Get slightly better garbage. Edit for 20 minutes. End up basically writing it myself anyway.

Then I found out there are tools built SPECIFICALLY for social media content. Game changer.

The posts actually sound human. They understand hooks and engagement. And I'm not spending my entire afternoon fighting with AI.

If you're still struggling with generic AI for your content, DM me - I'll share what's working for me.`,
    placeholders: [],
  },
  {
    id: 'facebook-group-value',
    title: 'Facebook Group Post - Value Add',
    segment: 'business-owner',
    channel: 'facebook',
    type: 'social-post',
    content: `Quick tip for anyone struggling with consistent social media posting:

Stop trying to create content from scratch every time.

Here's my system:
1. Batch create content once a week (I use Content Curator)
2. Schedule everything in advance
3. Spend the rest of the week actually running my business

The tool I use generates posts that actually sound like me, not like a robot wrote them. That was the missing piece for me.

Happy to share more details if anyone's interested - just drop a comment!`,
    placeholders: [],
  },
  {
    id: 'facebook-testimonial',
    title: 'Facebook Post - Testimonial Style',
    segment: 'freelancer',
    channel: 'facebook',
    type: 'social-post',
    content: `6 months ago I was managing [OLD_CLIENTS] social media clients and completely burned out.

Today I manage [NEW_CLIENTS] clients, work fewer hours, and actually enjoy my weekends again.

The difference? I stopped trying to do everything manually.

Content Curator has honestly been a game-changer for my freelance business. My clients get better content, delivered faster, and I have the bandwidth to actually grow.

If you're a social media manager feeling stretched thin, there's a better way. Feel free to reach out if you want to know more.`,
    placeholders: ['OLD_CLIENTS', 'NEW_CLIENTS'],
  },
];

// Common objections with recommended responses
export const objections = [
  {
    id: 'free-chatgpt',
    objection: "I already use ChatGPT for free",
    response: `I totally get it - ChatGPT is amazing for a lot of things. The difference is that Content Curator is specifically trained for social media content.

With ChatGPT, you're constantly tweaking prompts and editing outputs to make them sound human. Our tool understands platform-specific formats, hooks, and engagement patterns out of the box.

Most users tell us they save 2-3 hours per week compared to using ChatGPT. At even $20/hour for your time, that's $200-300/month in time savings for a fraction of the cost.

Would it help to see a side-by-side comparison of outputs?`,
  },
  {
    id: 'no-budget',
    objection: "I don't have the budget",
    response: `Totally understand - budget is always a consideration. Let me ask you this: how much time are you currently spending on content creation each week?

If it's more than a couple hours, Content Curator typically pays for itself in time savings alone. Most users save 3-4 hours per week.

We also have a free trial so you can see the value before committing anything. And our starter plan is less than the cost of a coffee per day.

Would it make sense to try the free trial and see if the time savings justify the investment?`,
  },
  {
    id: 'tried-before',
    objection: "I tried a tool like this before",
    response: `I hear that a lot, actually. Most AI content tools out there are pretty generic - they're not built specifically for social media.

What made you stop using the other tool? Was it the quality of the content, the learning curve, or something else?

Content Curator is different because it's focused exclusively on social media content. It understands hooks, platform-specific formats, and what actually drives engagement.

I'd love to show you a quick demo so you can see the difference. No pressure - just 5 minutes to see if this might work better for you.`,
  },
  {
    id: 'no-time',
    objection: "I don't have time to learn a new tool",
    response: `That's actually exactly why you need this tool - you don't have time, period.

Here's the thing: Content Curator takes about 5 minutes to learn. It's designed for busy people who don't have time to mess around with complicated software.

You answer a few questions about your business, and it generates content. That's it. No learning curve, no complex features to master.

The 5 minutes you spend learning it will save you hours every week. Can I show you how simple it is? It'll take less than 5 minutes.`,
  },
  {
    id: 'think-about-it',
    objection: "I'll think about it",
    response: `Absolutely, take your time. Just out of curiosity - is there something specific you're unsure about that I could help clarify?

Sometimes "I'll think about it" means there's a concern I haven't addressed. I'd rather help you make the right decision - even if that decision is that this isn't for you - than leave you with unanswered questions.

If it helps, you could try the free trial while you're thinking about it. No commitment, no credit card required. That way you're making a decision based on actual experience rather than just what I've told you.

What would be most helpful for you right now?`,
  },
];

// Ideal Customer Profile data
export const icpData = [
  {
    segment: 'business-owner',
    segmentLabel: 'Small Business Owners',
    whoTheyAre: 'Owners of local businesses, e-commerce shops, or service-based businesses with 1-20 employees. They handle multiple roles and social media is just one of many responsibilities.',
    whereToFind: [
      'Local business Facebook groups',
      'Small business subreddits (r/smallbusiness, r/Entrepreneur)',
      'LinkedIn (search for "Owner" + local businesses)',
      'Chamber of Commerce directories',
      'Yelp/Google Business listings',
    ],
    signals: [
      'Inconsistent posting schedule (gaps of weeks between posts)',
      'Posts that look rushed or low-effort',
      'Complaints about not having enough time',
      'Questions about social media automation',
      'Hiring posts for part-time social media help',
    ],
    valueProps: {
      hook: 'Create a week of social media content in 15 minutes',
      points: [
        'No more staring at a blank screen',
        'Consistent posting without the time investment',
        'Content that actually sounds like your brand',
        'More time to focus on running your business',
      ],
      costAngle: 'Less than the cost of one hour of a social media manager\'s time per month',
    },
  },
  {
    segment: 'freelancer',
    segmentLabel: 'Freelance Social Media Managers',
    whoTheyAre: 'Independent contractors managing social media for multiple clients. They\'re always looking for ways to scale their business without sacrificing quality or burning out.',
    whereToFind: [
      'Freelancer communities (r/freelance, Facebook groups)',
      'Upwork/Fiverr (search for social media managers)',
      'LinkedIn (search for "Freelance Social Media")',
      'Twitter/X (social media marketing hashtags)',
      'Virtual assistant communities',
    ],
    signals: [
      'Mentions of being overworked or at capacity',
      'Questions about scaling their business',
      'Looking for tools to streamline workflow',
      'Complaints about difficult clients or tight deadlines',
      'Posts about raising rates (capacity constraint)',
    ],
    valueProps: {
      hook: 'Manage 3x more clients without working more hours',
      points: [
        'Generate client-specific content in minutes',
        'Maintain quality while scaling your business',
        'More bandwidth for high-value client work',
        'Finally take on those clients you\'ve been turning away',
      ],
      costAngle: 'Pays for itself with just one additional client',
    },
  },
  {
    segment: 'chatgpt-struggler',
    segmentLabel: 'ChatGPT Strugglers',
    whoTheyAre: 'People who have tried using ChatGPT or other generic AI tools for social media content but are frustrated with the results. They know AI can help but haven\'t found the right solution.',
    whereToFind: [
      'ChatGPT subreddits and forums',
      'AI tool discussion groups',
      'Social media marketing communities',
      'YouTube comments on AI content creation videos',
      'Twitter/X threads about AI writing tools',
    ],
    signals: [
      'Complaints about AI content sounding robotic',
      'Questions about better prompts for social media',
      'Frustration with editing AI outputs',
      'Searching for "better than ChatGPT" alternatives',
      'Comments about AI content not converting',
    ],
    valueProps: {
      hook: 'Social media content that doesn\'t sound like a robot wrote it',
      points: [
        'Built specifically for social media (not generic AI)',
        'Understands hooks, engagement, and platform formats',
        'Minimal editing required - posts are ready to use',
        'No prompt engineering needed',
      ],
      costAngle: 'Stop wasting hours fixing AI outputs that never sound right',
    },
  },
];

// 2-minute demo video script
export const videoScript = {
  title: 'Content Curator - 2 Minute Demo',
  totalDuration: '2:00',
  sections: [
    {
      time: '0:00 - 0:15',
      label: 'Hook',
      content: `What if you could create an entire week of social media content in the time it takes to drink your morning coffee?

I'm going to show you exactly how in the next 2 minutes.`,
    },
    {
      time: '0:15 - 0:30',
      label: 'Problem',
      content: `If you're like most business owners, you know social media is important, but creating content is a constant struggle.

You sit down to write a post, stare at a blank screen, and 30 minutes later you've got... maybe one mediocre caption.

Generic AI tools like ChatGPT help a little, but the content always sounds robotic and needs tons of editing.`,
    },
    {
      time: '0:30 - 0:50',
      label: 'Solution Introduction',
      content: `That's why we built Content Curator - it's AI specifically trained for social media content.

Unlike generic tools, it understands what makes people stop scrolling. Hooks, engagement patterns, platform-specific formats - it's all built in.

Let me show you how it works.`,
    },
    {
      time: '0:50 - 1:20',
      label: 'Demo Walkthrough',
      content: `First, you tell it a bit about your business. What you do, who you help, your brand voice.

[Show onboarding screen]

Now, let's generate some content. I'll click "Create Posts" and choose what I need - let's do a week of Instagram content.

[Show generation in progress]

In just a few seconds, I've got 7 posts ready to go. Look at these hooks - they're designed to stop the scroll. And the content actually sounds human.

[Scroll through generated posts]

If I want to tweak anything, I just click edit. But honestly? Most of these are ready to post as-is.`,
    },
    {
      time: '1:20 - 1:40',
      label: 'Results/Social Proof',
      content: `Our users typically save 3-4 hours per week on content creation. That's time you can spend actually running your business.

Freelancers are using this to manage 3x more clients. Business owners are finally posting consistently without the stress.`,
    },
    {
      time: '1:40 - 2:00',
      label: 'Call to Action',
      content: `Ready to stop struggling with social media content?

Click the link below to start your free trial. No credit card required - just sign up and start creating.

Your first week of content is waiting. Let's make social media the easiest part of your day.`,
    },
  ],
};

// Default export with all data
export default {
  segments,
  channels,
  scriptTypes,
  scripts,
  objections,
  icpData,
  videoScript,
};
