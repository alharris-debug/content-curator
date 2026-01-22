// Yelp Business Search Edge Function
// Deploy with: supabase functions deploy yelp-search
// Set secret: supabase secrets set YELP_API_KEY=your_key_here

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const YELP_API_KEY = Deno.env.get('YELP_API_KEY')
const YELP_API_URL = 'https://api.yelp.com/v3/businesses/search'

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
    // Check for API key
    if (!YELP_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Yelp API key not configured. Set YELP_API_KEY secret.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { term, location, categories, limit = 20, offset = 0 } = await req.json()

    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build Yelp API URL
    const params = new URLSearchParams({
      location,
      limit: String(limit),
      offset: String(offset),
    })

    if (term) params.set('term', term)
    if (categories) params.set('categories', categories)

    // Call Yelp API
    const yelpResponse = await fetch(`${YELP_API_URL}?${params}`, {
      headers: {
        'Authorization': `Bearer ${YELP_API_KEY}`,
        'Accept': 'application/json',
      },
    })

    if (!yelpResponse.ok) {
      const error = await yelpResponse.text()
      console.error('Yelp API error:', error)
      return new Response(
        JSON.stringify({ error: 'Yelp API request failed', details: error }),
        { status: yelpResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await yelpResponse.json()

    // Transform response to simpler format
    const businesses = data.businesses.map((biz: any) => ({
      id: biz.id,
      name: biz.name,
      url: biz.url,
      phone: biz.phone,
      displayPhone: biz.display_phone,
      rating: biz.rating,
      reviewCount: biz.review_count,
      categories: biz.categories?.map((c: any) => c.title) || [],
      address: biz.location?.display_address?.join(', ') || '',
      city: biz.location?.city,
      state: biz.location?.state,
      zipCode: biz.location?.zip_code,
      imageUrl: biz.image_url,
      isClosed: biz.is_closed,
      coordinates: biz.coordinates,
    }))

    return new Response(
      JSON.stringify({
        businesses,
        total: data.total,
        region: data.region,
      }),
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
