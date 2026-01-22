// Reddit Search Edge Function
// Proxies Reddit API requests to avoid CORS issues
// Deploy with: supabase functions deploy reddit-search

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const REDDIT_BASE_URL = 'https://www.reddit.com'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, query, subreddit, sort, time, limit, postId } = await req.json()

    let url: string

    switch (action) {
      case 'search':
        // Search posts
        if (subreddit) {
          url = `${REDDIT_BASE_URL}/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=${sort || 'relevance'}&t=${time || 'month'}&limit=${limit || 25}`
        } else {
          url = `${REDDIT_BASE_URL}/search.json?q=${encodeURIComponent(query)}&sort=${sort || 'relevance'}&t=${time || 'month'}&limit=${limit || 25}`
        }
        break

      case 'subreddits':
        // Search subreddits
        url = `${REDDIT_BASE_URL}/subreddits/search.json?q=${encodeURIComponent(query)}&limit=${limit || 10}`
        break

      case 'comments':
        // Get post comments
        if (!postId || !subreddit) {
          return new Response(
            JSON.stringify({ error: 'postId and subreddit required for comments' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        url = `${REDDIT_BASE_URL}/r/${subreddit}/comments/${postId}.json?limit=${limit || 50}`
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: search, subreddits, or comments' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // Fetch from Reddit
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Reddit API error:', error)
      return new Response(
        JSON.stringify({ error: 'Reddit API request failed', status: response.status }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
