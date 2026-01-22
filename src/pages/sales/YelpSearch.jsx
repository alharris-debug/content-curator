import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import { yelpService } from '../../services/yelp'
import { salesService } from '../../services/sales'
import { industries } from '../../config/industryData'

export default function YelpSearch() {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [customTerm, setCustomTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [addedIds, setAddedIds] = useState(new Set())
  const [total, setTotal] = useState(0)

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!location.trim()) {
      setError('Please enter a location')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const categories = selectedIndustry
        ? yelpService.getCategoryForIndustry(selectedIndustry)
        : ''

      const term = customTerm || (selectedIndustry
        ? industries.find(i => i.id === selectedIndustry)?.name
        : '')

      const data = await yelpService.searchBusinesses({
        term,
        location,
        categories,
        limit: 20
      })

      setResults(data.businesses || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error('Yelp search error:', err)
      if (err.message.includes('not configured')) {
        setError('Yelp API not configured. Deploy the yelp-search edge function and set YELP_API_KEY secret.')
      } else {
        setError(err.message || 'Search failed. Make sure the edge function is deployed.')
      }
    } finally {
      setLoading(false)
    }
  }

  const addToProspects = async (business) => {
    try {
      const industry = selectedIndustry
        ? industries.find(i => i.id === selectedIndustry)?.name
        : business.categories?.[0] || ''

      await salesService.addProspect({
        source: 'yelp',
        sourceUrl: business.url,
        businessName: business.name,
        website: business.url,
        industry,
        location: `${business.city}, ${business.state}`,
        notes: `Phone: ${business.displayPhone || 'N/A'}\nAddress: ${business.address}\nRating: ${business.rating}/5 (${business.reviewCount} reviews)\nCategories: ${business.categories?.join(', ') || 'N/A'}`,
        status: 'found'
      })
      setAddedIds(prev => new Set([...prev, business.id]))
    } catch (err) {
      console.error('Failed to add prospect:', err)
      alert('Failed to add to pipeline')
    }
  }

  const addAllToProspects = async () => {
    const toAdd = results.filter(b => !addedIds.has(b.id))
    for (const business of toAdd) {
      await addToProspects(business)
    }
  }

  return (
    <SalesLayout title="Yelp Business Search">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Industries</option>
                {industries.map(ind => (
                  <option key={ind.id} value={ind.id}>
                    {ind.displayName} {ind.flag ? '⚠️' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State or ZIP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Search Term</label>
              <input
                type="text"
                value={customTerm}
                onChange={(e) => setCustomTerm(e.target.value)}
                placeholder="Optional override"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {selectedIndustry && !customTerm && (
                <>Searching for: <strong>{industries.find(i => i.id === selectedIndustry)?.name}</strong></>
              )}
            </p>
            <button
              type="submit"
              disabled={loading || !location.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Yelp'}
            </button>
          </div>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Found {results.length} of {total} businesses
            </h3>
            <button
              onClick={addAllToProspects}
              disabled={results.every(b => addedIds.has(b.id))}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              Add All to Pipeline
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(business => (
              <div key={business.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  {business.imageUrl && (
                    <img
                      src={business.imageUrl}
                      alt={business.name}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    {/* Name & Rating */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 truncate">
                          <a
                            href={business.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-600"
                          >
                            {business.name}
                          </a>
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="text-yellow-500">{'★'.repeat(Math.round(business.rating))}</span>
                          <span>{business.rating}</span>
                          <span>({business.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {business.categories?.slice(0, 3).map((cat, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Address & Phone */}
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="truncate">{business.address}</p>
                      {business.displayPhone && <p>{business.displayPhone}</p>}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center gap-2">
                      {addedIds.has(business.id) ? (
                        <span className="text-green-600 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Added
                        </span>
                      ) : (
                        <button
                          onClick={() => addToProspects(business)}
                          className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          + Pipeline
                        </button>
                      )}
                      <a
                        href={business.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        View on Yelp →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500">Search for businesses by industry and location</p>
          <p className="text-sm text-gray-400 mt-1">Select an industry and enter a city to find prospects</p>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <h4 className="font-medium text-gray-700 mb-2">Setup Required:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Get a free Yelp Fusion API key at <a href="https://fusion.yelp.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">fusion.yelp.com</a></li>
          <li>Deploy the edge function: <code className="bg-gray-200 px-1 rounded">supabase functions deploy yelp-search</code></li>
          <li>Set the secret: <code className="bg-gray-200 px-1 rounded">supabase secrets set YELP_API_KEY=your_key</code></li>
        </ol>
      </div>
    </SalesLayout>
  )
}
