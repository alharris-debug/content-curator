import { useState, useEffect } from 'react'
import PageContainer from '../components/layout/PageContainer'
import ClientSelector from '../components/clients/ClientSelector'
import { useClients } from '../hooks/useClients'
import { storage } from '../services/storage'

const PLATFORM_LABELS = { gbp: 'GBP', facebook: 'FB', instagram: 'IG', linkedin: 'LI' }

export default function History() {
  const { clients, isLoading: clientsLoading } = useClients()
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedPost, setExpandedPost] = useState(null)

  useEffect(() => { loadPosts() }, [selectedClientId])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const data = await storage.getPosts(selectedClientId || null)
      setPosts(data)
    } catch (err) { console.error('Failed to load posts:', err) }
    finally { setIsLoading(false) }
  }

  const getClientName = (clientId) => clients.find((c) => c.id === clientId)?.name || 'Unknown Client'

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); alert('Copied to clipboard!') }
    catch (err) { console.error('Failed to copy:', err) }
  }

  return (
    <PageContainer title="Post History">
      <div className="mb-6 flex items-center gap-4">
        <ClientSelector
          clients={[{ id: '', name: 'All Clients' }, ...clients]}
          selectedId={selectedClientId}
          onChange={(id) => setSelectedClientId(id || null)}
        />
      </div>

      {isLoading || clientsLoading ? (
        <div className="text-gray-600">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No posts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow">
              <div className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded ${post.type === 'service' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {post.type === 'service' ? 'Service' : 'Lifestyle'}
                      </span>
                      <span className="text-sm text-gray-500">{getClientName(post.clientId)}</span>
                    </div>
                    <p className="text-gray-800 font-medium">{post.topic}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(post.postedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {post.platformsPosted?.map((platform) => (
                        <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {PLATFORM_LABELS[platform] || platform}
                        </span>
                      ))}
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedPost === post.id ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {expandedPost === post.id && (
                <div className="border-t px-4 py-4 space-y-4">
                  {Object.entries(post.content || {}).map(([platform, content]) => (
                    <div key={platform}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{platform.toUpperCase()}</span>
                        <button onClick={(e) => { e.stopPropagation(); copyToClipboard(content) }}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">Copy</button>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded">{content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
