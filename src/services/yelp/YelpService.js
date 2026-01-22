// Yelp Service
// Calls the yelp-search Supabase Edge Function

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

class YelpService {
  constructor() {
    this.functionUrl = `${SUPABASE_URL}/functions/v1/yelp-search`
  }

  async searchBusinesses(options) {
    const {
      term = '',
      location,
      categories = '',
      limit = 20,
      offset = 0
    } = options

    if (!location) {
      throw new Error('Location is required')
    }

    try {
      const response = await fetch(this.functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          term,
          location,
          categories,
          limit,
          offset
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Yelp search failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Yelp search error:', error)
      throw error
    }
  }

  // Industry category mappings for Yelp
  getYelpCategories() {
    return {
      realtors: 'realestate',
      dentists: 'dentists',
      chiropractors: 'chiropractors',
      salons: 'hair,beautysvc',
      fitness: 'gyms,personaltrainers',
      restaurants: 'restaurants',
      contractors: 'contractors,plumbing,electricians,hvac',
      auto: 'autorepair',
      lawyers: 'lawyers',
      accountants: 'accountants,bookkeepers'
    }
  }

  getCategoryForIndustry(industryId) {
    const categories = this.getYelpCategories()
    return categories[industryId] || ''
  }
}

export const yelpService = new YelpService()
