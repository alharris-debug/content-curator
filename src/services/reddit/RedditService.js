// Reddit Search Service
// Uses Supabase Edge Function to proxy Reddit API (avoids CORS)

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

class RedditService {
  constructor() {
    this.functionUrl = `${SUPABASE_URL}/functions/v1/reddit-search`
  }

  async _callFunction(params) {
    const response = await fetch(this.functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(params)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Reddit search failed')
    }

    return response.json()
  }

  // Search subreddits for posts matching keywords
  async searchPosts(query, options = {}) {
    const {
      subreddit = null,
      sort = 'relevance',
      time = 'month',
      limit = 25
    } = options

    try {
      const data = await this._callFunction({
        action: 'search',
        query,
        subreddit,
        sort,
        time,
        limit
      })

      return this._mapPosts(data.data?.children || [])
    } catch (error) {
      console.error('Reddit search failed:', error)
      throw error
    }
  }

  // Get comments from a specific post
  async getPostComments(postId, subreddit, limit = 50) {
    try {
      const data = await this._callFunction({
        action: 'comments',
        postId,
        subreddit,
        limit
      })

      const comments = data[1]?.data?.children || []
      return this._mapComments(comments)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      throw error
    }
  }

  // Search for subreddits
  async searchSubreddits(query, limit = 10) {
    try {
      const data = await this._callFunction({
        action: 'subreddits',
        query,
        limit
      })

      return this._mapSubreddits(data.data?.children || [])
    } catch (error) {
      console.error('Subreddit search failed:', error)
      throw error
    }
  }

  // Predefined searches for finding social media help seekers
  getSuggestedSearches() {
    return [
      {
        category: 'Business Owners',
        queries: [
          { query: 'need help social media small business', description: 'Business owners seeking social media help' },
          { query: 'hate creating content', description: 'People frustrated with content creation' },
          { query: 'social media too time consuming', description: 'Time-strapped business owners' },
          { query: 'how to post consistently', description: 'Struggling with consistency' },
          { query: 'social media marketing overwhelmed', description: 'Overwhelmed with social marketing' }
        ]
      },
      {
        category: 'AI Tool Frustration',
        queries: [
          { query: 'chatgpt sounds generic', description: 'ChatGPT output quality issues' },
          { query: 'AI content doesn\'t sound like me', description: 'Brand voice problems with AI' },
          { query: 'chatgpt social media posts', description: 'Using ChatGPT for social' },
          { query: 'AI writing too robotic', description: 'AI content lacking personality' }
        ]
      },
      {
        category: 'Industry Specific',
        queries: [
          { query: 'realtor social media tips', description: 'Real estate agents' },
          { query: 'dentist marketing instagram', description: 'Dental practices' },
          { query: 'salon social media ideas', description: 'Hair/beauty salons' },
          { query: 'fitness trainer content', description: 'Personal trainers' },
          { query: 'restaurant social media strategy', description: 'Restaurant owners' }
        ]
      }
    ]
  }

  // Suggested subreddits for prospecting
  getSuggestedSubreddits() {
    return [
      { name: 'smallbusiness', description: 'Small business owners community' },
      { name: 'Entrepreneur', description: 'Entrepreneurs and startup founders' },
      { name: 'socialmedia', description: 'Social media marketing discussions' },
      { name: 'marketing', description: 'General marketing community' },
      { name: 'digitalmarketing', description: 'Digital marketing professionals' },
      { name: 'freelance', description: 'Freelancers and independent workers' },
      { name: 'RealEstate', description: 'Real estate professionals' },
      { name: 'dentistry', description: 'Dental professionals' },
      { name: 'Fitness', description: 'Fitness professionals' },
      { name: 'restaurateur', description: 'Restaurant owners' },
      { name: 'sweatystartup', description: 'Service-based small businesses' },
      { name: 'SideProject', description: 'Side project builders' }
    ]
  }

  // Map Reddit API response to cleaner format
  _mapPosts(posts) {
    return posts
      .filter(post => post.kind === 't3')
      .map(post => {
        const data = post.data
        return {
          id: data.id,
          title: data.title,
          selftext: data.selftext || '',
          author: data.author,
          subreddit: data.subreddit,
          score: data.score,
          numComments: data.num_comments,
          createdUtc: data.created_utc,
          createdAt: new Date(data.created_utc * 1000).toISOString(),
          url: `https://reddit.com${data.permalink}`,
          permalink: data.permalink,
          isNsfw: data.over_18,
          hasWebsiteMention: this._detectWebsiteMention(data.selftext),
          hasBusinessContext: this._detectBusinessContext(data.title + ' ' + data.selftext),
          hasHelpRequest: this._detectHelpRequest(data.title + ' ' + data.selftext)
        }
      })
  }

  _mapComments(comments) {
    return comments
      .filter(c => c.kind === 't1')
      .map(c => {
        const data = c.data
        return {
          id: data.id,
          body: data.body,
          author: data.author,
          score: data.score,
          createdUtc: data.created_utc,
          createdAt: new Date(data.created_utc * 1000).toISOString(),
          permalink: data.permalink ? `https://reddit.com${data.permalink}` : null
        }
      })
  }

  _mapSubreddits(subreddits) {
    return subreddits
      .filter(s => s.kind === 't5')
      .map(s => {
        const data = s.data
        return {
          name: data.display_name,
          title: data.title,
          description: data.public_description,
          subscribers: data.subscribers,
          url: `https://reddit.com/r/${data.display_name}`
        }
      })
  }

  _detectWebsiteMention(text) {
    if (!text) return false
    const websitePatterns = [
      /\b(website|site|url|link)\b/i,
      /\.(com|net|org|io|co)\b/i,
      /https?:\/\//i
    ]
    return websitePatterns.some(p => p.test(text))
  }

  _detectBusinessContext(text) {
    if (!text) return false
    const businessTerms = [
      /\b(business|company|startup|entrepreneur|owner|founder|client|customer)\b/i,
      /\b(small business|side hustle|freelance|agency)\b/i,
      /\b(revenue|sales|marketing|brand)\b/i
    ]
    return businessTerms.some(p => p.test(text))
  }

  _detectHelpRequest(text) {
    if (!text) return false
    const helpPatterns = [
      /\b(help|advice|tips|suggestions|recommendations)\b/i,
      /\b(struggling|overwhelmed|frustrated|hate|difficult)\b/i,
      /\b(how do|how to|what should|looking for)\b/i,
      /\?$/
    ]
    return helpPatterns.some(p => p.test(text))
  }
}

export const redditService = new RedditService()
