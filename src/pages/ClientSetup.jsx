import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ClientForm from '../components/clients/ClientForm'
import { storage } from '../services/storage'
import { scraper } from '../services/scraper/WebsiteScraper'
import { claude } from '../services/ai/ClaudeService'

export default function ClientSetup() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  const isEditing = !!id

  useEffect(() => {
    if (id) loadClient()
    initializeAI()
  }, [id])

  const initializeAI = async () => {
    const settings = await storage.getSettings()
    if (settings.apiKey) claude.initialize(settings.apiKey)
  }

  const loadClient = async () => {
    try {
      const data = await storage.getClient(id)
      if (data) setClient(data)
      else setError('Client not found')
    } catch (err) {
      setError('Failed to load client')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async (url) => {
    if (!claude.isInitialized()) {
      setError('Please add your Claude API key in Settings first.')
      return null
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const websiteContent = await scraper.scrape(url)
      const analysis = await claude.analyzeWebsite(websiteContent)
      return analysis
    } catch (err) {
      setError(err.message || 'Failed to analyze website')
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSave = async (clientData) => {
    setIsSaving(true)
    setError(null)
    try {
      await storage.saveClient(clientData)
      navigate('/')
    } catch (err) {
      setError('Failed to save client')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => navigate('/')

  if (isLoading) {
    return (
      <PageContainer title={isEditing ? 'Edit Client' : 'Add Client'}>
        <div className="text-gray-600">Loading...</div>
      </PageContainer>
    )
  }

  if (error && isEditing && !client) {
    return (
      <PageContainer title="Edit Client">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={isEditing ? 'Edit Client' : 'Add Client'}>
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
          <ClientForm
            client={client}
            onSave={handleSave}
            onCancel={handleCancel}
            onAnalyze={handleAnalyze}
            isLoading={isSaving}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </PageContainer>
  )
}
