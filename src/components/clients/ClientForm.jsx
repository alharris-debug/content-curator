import { useState } from 'react'

export default function ClientForm({ client, onSave, onCancel, onAnalyze, isLoading, isAnalyzing }) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    url: client?.url || '',
    industry: client?.industry || '',
    targetAudience: client?.targetAudience || '',
    brandVoice: client?.brandVoice || '',
    scrapedContent: client?.scrapedContent || { services: [], aboutText: '', keyPhrases: [] },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAnalyze = async () => {
    if (!formData.url || !onAnalyze) return
    const result = await onAnalyze(formData.url)
    if (result) {
      setFormData((prev) => ({
        ...prev,
        name: result.name || prev.name,
        industry: result.industry || prev.industry,
        targetAudience: result.targetAudience || prev.targetAudience,
        brandVoice: result.brandVoice || prev.brandVoice,
        scrapedContent: {
          services: result.services || [],
          aboutText: result.aboutText || '',
          keyPhrases: result.keyPhrases || [],
        },
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...client, ...formData })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website URL *</label>
        <div className="flex gap-2">
          <input type="url" name="url" value={formData.url} onChange={handleChange}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          {onAnalyze && (
            <button type="button" onClick={handleAnalyze} disabled={!formData.url || isAnalyzing || isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 whitespace-nowrap">
              {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">Click "Analyze Website" to auto-fill fields below</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Client/Business Name *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange}
          placeholder="Business Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
        <input type="text" name="industry" value={formData.industry} onChange={handleChange}
          placeholder="e.g., Day Spa & Wellness"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
        <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleChange}
          placeholder="e.g., Women 30-55 seeking relaxation and self-care"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Voice</label>
        <textarea name="brandVoice" value={formData.brandVoice} onChange={handleChange}
          placeholder="e.g., Warm, nurturing, professional but approachable" rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {formData.scrapedContent?.services?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Detected Services</h4>
          <div className="flex flex-wrap gap-2">
            {formData.scrapedContent.services.map((service, i) => (
              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">{service}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={isLoading || isAnalyzing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? 'Saving...' : client?.id ? 'Update Client' : 'Save Client'}
        </button>
        <button type="button" onClick={onCancel} disabled={isLoading || isAnalyzing}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Cancel</button>
      </div>
    </form>
  )
}
