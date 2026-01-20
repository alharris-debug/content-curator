import Anthropic from '@anthropic-ai/sdk'
import { ANALYZE_WEBSITE_PROMPT, GENERATE_SERVICE_POST_PROMPT, GENERATE_LIFESTYLE_POST_PROMPT, REGENERATE_POST_PROMPT } from './prompts'

const BUILT_IN_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY

class ClaudeService {
  constructor() {
    this.client = null
    // Auto-initialize with built-in key if available
    if (BUILT_IN_API_KEY) {
      this.initialize(BUILT_IN_API_KEY)
    }
  }

  initialize(apiKey) {
    this.client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  }

  isInitialized() {
    return this.client !== null
  }

  async _sendMessage(prompt) {
    if (!this.client) throw new Error('AI service not available. Please contact support.')

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].text
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/```\n?([\s\S]*?)\n?```/) || [null, text]
      return JSON.parse(jsonMatch[1] || text)
    } catch (error) {
      if (error.status === 401) throw new Error('AI service configuration error. Please contact support.')
      if (error.status === 429) throw new Error('Rate limited. Please wait a moment and try again.')
      if (error.message?.includes('JSON')) throw new Error('Failed to parse AI response. Please try again.')
      throw new Error(`AI request failed: ${error.message}`)
    }
  }

  async analyzeWebsite(websiteContent) {
    return this._sendMessage(ANALYZE_WEBSITE_PROMPT + websiteContent)
  }

  async generateServicePost(client, serviceFocus = null, recentTopics = []) {
    let prompt = GENERATE_SERVICE_POST_PROMPT
      .replace('{name}', client.name)
      .replace('{industry}', client.industry)
      .replace('{targetAudience}', client.targetAudience || 'General audience')
      .replace('{brandVoice}', client.brandVoice || 'Professional and friendly')
      .replace('{services}', client.scrapedContent?.services?.join(', ') || 'Various services')
      .replace('{serviceFocus}', serviceFocus ? `Focus specifically on: ${serviceFocus}` : 'Choose a service to highlight.')
      .replace('{recentTopics}', recentTopics.length > 0 ? `Avoid these recently covered topics:\n${recentTopics.map(t => `- ${t}`).join('\n')}` : '')

    return this._sendMessage(prompt)
  }

  async generateLifestylePost(client, category = null, recentTopics = []) {
    let prompt = GENERATE_LIFESTYLE_POST_PROMPT
      .replace('{name}', client.name)
      .replace('{industry}', client.industry)
      .replace('{targetAudience}', client.targetAudience || 'General audience')
      .replace('{brandVoice}', client.brandVoice || 'Professional and friendly')
      .replace('{category}', category && category !== 'surprise' ? `Generate a post in this category: ${category}` : 'Choose an appropriate lifestyle topic.')
      .replace('{recentTopics}', recentTopics.length > 0 ? `Avoid these recently covered topics:\n${recentTopics.map(t => `- ${t}`).join('\n')}` : '')

    return this._sendMessage(prompt)
  }

  async regeneratePost(client, originalTopic, adjustment) {
    const prompt = REGENERATE_POST_PROMPT
      .replace('{originalTopic}', originalTopic)
      .replace('{adjustment}', adjustment)
      .replace('{name}', client.name)
      .replace('{industry}', client.industry)
      .replace('{targetAudience}', client.targetAudience || 'General audience')
      .replace('{brandVoice}', client.brandVoice || 'Professional and friendly')

    return this._sendMessage(prompt)
  }
}

export const claude = new ClaudeService()
