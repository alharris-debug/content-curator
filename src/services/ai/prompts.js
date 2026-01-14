export const ANALYZE_WEBSITE_PROMPT = `Analyze this website content and extract the following information. Return a JSON object with these exact keys:

{
  "name": "The business/company name",
  "industry": "The industry or business type (e.g., 'Day Spa & Wellness', 'Accounting Firm')",
  "targetAudience": "Who the business serves (e.g., 'Women 30-55 seeking relaxation')",
  "brandVoice": "The tone and style of their communication (e.g., 'Warm, professional, approachable')",
  "services": ["List", "of", "main", "services"],
  "aboutText": "A brief summary of what the business does",
  "keyPhrases": ["Important", "phrases", "or", "taglines", "from", "the", "site"]
}

Website content:
`

export const GENERATE_SERVICE_POST_PROMPT = `You are a social media content creator. Generate a post about a service offered by this business.

Business Info:
- Name: {name}
- Industry: {industry}
- Target Audience: {targetAudience}
- Brand Voice: {brandVoice}
- Services: {services}

{serviceFocus}

{recentTopics}

Generate a post that:
1. Highlights a specific service or benefit
2. Matches the brand voice
3. Appeals to the target audience
4. Avoids any recently covered topics

Return a JSON object with these exact keys:
{
  "topic": "Brief description of the post topic",
  "gbp": "Google Business Profile version (under 1500 chars, concise, local-focused, no hashtags)",
  "facebook": "Facebook version (conversational, can include CTA, 1-3 hashtags)",
  "instagram": "Instagram version (engaging hook, emoji-friendly, 5-10 relevant hashtags)",
  "linkedin": "LinkedIn version (professional tone, industry-relevant, 1-3 hashtags)"
}
`

export const GENERATE_LIFESTYLE_POST_PROMPT = `You are a social media content creator. Generate a lifestyle/non-industry post that would appeal to this business's audience.

Business Info:
- Name: {name}
- Industry: {industry}
- Target Audience: {targetAudience}
- Brand Voice: {brandVoice}

{category}

{recentTopics}

Generate a post that:
1. Is NOT about the business's services directly
2. Would appeal to and resonate with the target audience
3. Could be a recipe, book recommendation, motivational content, seasonal tip, or local event idea
4. Maintains the brand voice
5. Avoids any recently covered topics

Return a JSON object with these exact keys:
{
  "topic": "Brief description of the post topic",
  "gbp": "Google Business Profile version (under 1500 chars, concise, local-focused, no hashtags)",
  "facebook": "Facebook version (conversational, can include CTA, 1-3 hashtags)",
  "instagram": "Instagram version (engaging hook, emoji-friendly, 5-10 relevant hashtags)",
  "linkedin": "LinkedIn version (professional tone, industry-relevant, 1-3 hashtags)"
}
`

export const REGENERATE_POST_PROMPT = `You are a social media content creator. Regenerate a post with the following adjustment:

Original post topic: {originalTopic}

User's adjustment request: {adjustment}

Business Info:
- Name: {name}
- Industry: {industry}
- Target Audience: {targetAudience}
- Brand Voice: {brandVoice}

Generate a new version of the post incorporating the user's requested changes while:
1. Maintaining the brand voice
2. Keeping it relevant to the target audience

Return a JSON object with these exact keys:
{
  "topic": "Brief description of the new post topic",
  "gbp": "Google Business Profile version (under 1500 chars, concise, local-focused, no hashtags)",
  "facebook": "Facebook version (conversational, can include CTA, 1-3 hashtags)",
  "instagram": "Instagram version (engaging hook, emoji-friendly, 5-10 relevant hashtags)",
  "linkedin": "LinkedIn version (professional tone, industry-relevant, 1-3 hashtags)"
}
`
