import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import { redditService } from '../../services/reddit'
import { salesService } from '../../services/sales'

export default function RedditSearch() {
  const [query, setQuery] = useState('')
  const [subreddit, setSubreddit] = useState('')
  const [sort, setSort] = useState('relevance')
  const [time, setTime] = useState('month')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [addedIds, setAddedIds] = useState(new Set())

  const suggestedSearches = redditService.getSuggestedSearches()
  const suggestedSubreddits = redditService.getSuggestedSubreddits()

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    try {
      const posts = await redditService.searchPosts(query, {
        subreddit: subreddit || null,
        sort,
        time,
        limit: 50
      })
      setResults(posts)
    } catch (err) {
      setError('Failed to search Reddit. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const runSuggestedSearch = (searchQuery) => {
    setQuery(searchQuery)
    setSubreddit('')
    setTimeout(() => handleSearch(), 0)
  }

  const addToProspects = async (post) => {
    try {
      await salesService.addProspect({
        source: 'reddit',
        sourceUrl: post.url,
        businessName: `Reddit: ${post.author}`,
        notes: `Found via search: "${query}"\n\nPost Title: ${post.title}\n\nSubreddit: r/${post.subreddit}\n\nContent: ${post.selftext?.substring(0, 500) || 'No content'}`,
        status: 'found'
      })
      setAddedIds(prev => new Set([...prev, post.id]))
    } catch (err) {
      console.error('Failed to add prospect:', err)
      alert('Failed to add to pipeline. Make sure the sales_prospects table exists in Supabase.')
    }
  }

  const formatDate = (utcTimestamp) => {
    const date = new Date(utcTimestamp * 1000)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <SalesLayout title="Reddit Search">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Query</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='e.g., "need help with social media"'
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subreddit (optional)</label>
              <input
                type="text"
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
                placeholder="e.g., smallbusiness"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="relevance">Relevance</option>
                <option value="hot">Hot</option>
                <option value="new">New</option>
                <option value="top">Top</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="day">Past Day</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Reddit'}
            </button>
          </div>
        </form>
      </div>

      {/* Suggested Searches */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested Searches</h3>
        <div className="space-y-4">
          {suggestedSearches.map((category, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">{category.category}</h4>
              <div className="flex flex-wrap gap-2">
                {category.queries.map((search, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => runSuggestedSearch(search.query)}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    title={search.description}
                  >
                    {search.query}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Subreddits */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested Subreddits</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedSubreddits.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSubreddit(sub.name)
                if (query) handleSearch()
              }}
              className={`px-3 py-1.5 text-sm rounded-full ${
                subreddit === sub.name
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={sub.description}
            >
              r/{sub.name}
            </button>
          ))}
        </div>
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
              Found {results.length} posts
            </h3>
            <div className="text-sm text-gray-500">
              Click a post to add to your pipeline
            </div>
          </div>

          {results.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Title and Meta */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-500">r/{post.subreddit}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">u/{post.author}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{formatDate(post.createdUtc)}</span>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-2">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-600"
                    >
                      {post.title}
                    </a>
                  </h4>

                  {/* Content Preview */}
                  {post.selftext && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {post.selftext}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.hasHelpRequest && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Help Request
                      </span>
                    )}
                    {post.hasBusinessContext && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Business Context
                      </span>
                    )}
                    {post.hasWebsiteMention && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Website Mentioned
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {post.score} pts
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {post.numComments} comments
                    </span>
                  </div>
                </div>

                {/* Add Button */}
                <div className="ml-4 flex-shrink-0">
                  {addedIds.has(post.id) ? (
                    <span className="inline-flex items-center px-3 py-1.5 text-sm text-green-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Added
                    </span>
                  ) : (
                    <button
                      onClick={() => addToProspects(post)}
                      className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      + Pipeline
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && query && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No posts found for "{query}"</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or time range</p>
        </div>
      )}

      {/* Initial State */}
      {!loading && results.length === 0 && !query && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500">Search Reddit for potential prospects</p>
          <p className="text-sm text-gray-400 mt-1">Use the suggested searches above or enter your own query</p>
        </div>
      )}
    </SalesLayout>
  )
}
