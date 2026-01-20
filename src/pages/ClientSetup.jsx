import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ClientForm from '../components/clients/ClientForm'
import UpgradePrompt from '../components/subscription/UpgradePrompt'
import { useSubscription } from '../contexts/SubscriptionContext'
import { storage } from '../services/storage'
import { scraper } from '../services/scraper/WebsiteScraper'
import { claude } from '../services/ai/ClaudeService'

export default function ClientSetup() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { subscription, canAddClient, canGenerate, incrementUsage } = useSubscription()

  const [client, setClient] = useState(null)
  const [clientCount, setClientCount] = useState(0)
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [upgradeType, setUpgradeType] = useState('clients')

  const isEditing = !!id

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [settings, clients] = await Promise.all([
        storage.getSettings(),
        storage.getClients(),
      ])
      if (settings.apiKey) claude.initialize(settings.apiKey)
      setClientCount(clients.length)

      if (id) {
        const data = await storage.getClient(id)
        if (data) setClient(data)
        else setError('Client not found')
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async (url) => {
    if (!claude.isInitialized()) {
      setError('Please add your Claude API key in Settings first.')
      return null
    }

    if (!canGenerate()) {
      setUpgradeType('generations')
      setShowUpgradePrompt(true)
      return null
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const websiteContent = await scraper.scrape(url)
      const analysis = await claude.analyzeWebsite(websiteContent)
      await incrementUsage() // Count website analysis as a generation
      return analysis
    } catch (err) {
      setError(err.message || 'Failed to analyze website')
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSave = async (clientData) => {
    // Check client limit for new clients
    if (!isEditing && !canAddClient(clientCount)) {
      setUpgradeType('clients')
      setShowUpgradePrompt(true)
      return
    }

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
      {showUpgradePrompt && subscription && (
        <UpgradePrompt
          type={upgradeType}
          currentTier={subscription.tier}
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}

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
