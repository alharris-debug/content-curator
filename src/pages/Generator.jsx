import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ClientSelector from '../components/clients/ClientSelector'
import PostCard from '../components/posts/PostCard'
import { storage } from '../services/storage'
import { claude } from '../services/ai/ClaudeService'

const LIFESTYLE_CATEGORIES = [
  { id: 'surprise', label: 'Surprise Me' },
  { id: 'recipe', label: 'Recipe' },
  { id: 'book', label: 'Book Recommendation' },
  { id: 'motivational', label: 'Motivational Quote' },
  { id: 'seasonal', label: 'Seasonal Tip' },
  { id: 'local', label: 'Local Event Idea' },
]

export default function Generator() {
  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [servicePost, setServicePost] = useState(null)
  const [serviceFocus, setServiceFocus] = useState('')
  const [isGeneratingService, setIsGeneratingService] = useState(false)

  const [lifestylePost, setLifestylePost] = useState(null)
  const [lifestyleCategory, setLifestyleCategory] = useState('surprise')
  const [isGeneratingLifestyle, setIsGeneratingLifestyle] = useState(false)

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find((c) => c.id === selectedClientId)
      setSelectedClient(client || null)
      setServicePost(null)
      setLifestylePost(null)
    } else {
      setSelectedClient(null)
    }
  }, [selectedClientId, clients])

  const loadData = async () => {
    try {
      const [clientsData, settings] = await Promise.all([storage.getClients(), storage.getSettings()])
      setClients(clientsData)
      if (settings.apiKey) claude.initialize(settings.apiKey)
    } catch (err) { setError('Failed to load data') }
    finally { setIsLoading(false) }
  }

  const getRecentTopics = async (clientId) => {
    const posts = await storage.getPosts(clientId, 15)
    return posts.map((p) => p.topic)
  }

  const handleGenerateService = async () => {
    if (!selectedClient) return
    if (!claude.isInitialized()) { setError('Please add your Claude API key in Settings first.'); return }
    setIsGeneratingService(true)
    setError(null)
    try {
      const recentTopics = await getRecentTopics(selectedClient.id)
      const result = await claude.generateServicePost(selectedClient, serviceFocus || null, recentTopics)
      setServicePost(result)
    } catch (err) { setError(err.message || 'Failed to generate post') }
    finally { setIsGeneratingService(false) }
  }

  const handleGenerateLifestyle = async () => {
    if (!selectedClient) return
    if (!claude.isInitialized()) { setError('Please add your Claude API key in Settings first.'); return }
    setIsGeneratingLifestyle(true)
    setError(null)
    try {
      const recentTopics = await getRecentTopics(selectedClient.id)
      const result = await claude.generateLifestylePost(selectedClient, lifestyleCategory, recentTopics)
      setLifestylePost(result)
    } catch (err) { setError(err.message || 'Failed to generate post') }
    finally { setIsGeneratingLifestyle(false) }
  }

  const handleRegenerateService = async (prompt) => {
    if (!selectedClient || !servicePost) return
    setIsGeneratingService(true)
    setError(null)
    try {
      const result = await claude.regeneratePost(selectedClient, servicePost.topic, prompt || 'Generate a fresh variation')
      setServicePost(result)
    } catch (err) { setError(err.message || 'Failed to regenerate post') }
    finally { setIsGeneratingService(false) }
  }

  const handleRegenerateLifestyle = async (prompt) => {
    if (!selectedClient || !lifestylePost) return
    setIsGeneratingLifestyle(true)
    setError(null)
    try {
      const result = await claude.regeneratePost(selectedClient, lifestylePost.topic, prompt || 'Generate a fresh variation')
      setLifestylePost(result)
    } catch (err) { setError(err.message || 'Failed to regenerate post') }
    finally { setIsGeneratingLifestyle(false) }
  }

  const handleMarkAsPosted = async (post, type, platforms) => {
    try {
      await storage.savePost({
        clientId: selectedClient.id,
        type,
        content: { gbp: post.gbp, facebook: post.facebook, instagram: post.instagram, linkedin: post.linkedin },
        platformsPosted: platforms,
        topic: post.topic,
      })
      alert('Post saved to history!')
    } catch (err) { setError('Failed to save post') }
  }

  if (isLoading) return <PageContainer title="Generate Posts"><div className="text-gray-600">Loading...</div></PageContainer>

  return (
    <PageContainer title="Generate Posts">
      {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {clients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No clients yet.</p>
          <Link to="/clients/new" className="text-blue-600 hover:text-blue-800">Add your first client</Link>
        </div>
      ) : (
        <>
          <div className="mb-6"><ClientSelector clients={clients} selectedId={selectedClientId} onChange={setSelectedClientId} /></div>

          {!selectedClient ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">Select a client to generate posts.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Service-Based Post</h3>
                  <div className="flex gap-2">
                    <select value={serviceFocus} onChange={(e) => setServiceFocus(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option value="">Auto-select service</option>
                      {selectedClient.scrapedContent?.services?.map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                    <button onClick={handleGenerateService} disabled={isGeneratingService}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                      {isGeneratingService ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>
                <PostCard title="Service Post" post={servicePost} onRegenerate={handleRegenerateService}
                  onMarkAsPosted={(platforms) => handleMarkAsPosted(servicePost, 'service', platforms)}
                  isRegenerating={isGeneratingService} />
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Lifestyle Post</h3>
                  <div className="flex gap-2">
                    <select value={lifestyleCategory} onChange={(e) => setLifestyleCategory(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
                      {LIFESTYLE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                    <button onClick={handleGenerateLifestyle} disabled={isGeneratingLifestyle}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                      {isGeneratingLifestyle ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>
                <PostCard title="Lifestyle Post" post={lifestylePost} onRegenerate={handleRegenerateLifestyle}
                  onMarkAsPosted={(platforms) => handleMarkAsPosted(lifestylePost, 'lifestyle', platforms)}
                  isRegenerating={isGeneratingLifestyle} />
              </div>
            </div>
          )}
        </>
      )}
    </PageContainer>
  )
}
