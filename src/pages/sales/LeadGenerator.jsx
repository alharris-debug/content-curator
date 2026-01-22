import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import { industries, getIndustry } from '../../config/industryData'
import { websiteAnalyzer } from '../../services/analyzer'
import { salesService } from '../../services/sales'

export default function LeadGenerator() {
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [location, setLocation] = useState('')
  const [responses, setResponses] = useState({})
  const [score, setScore] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const scoringCriteria = websiteAnalyzer.getScoringCriteria()

  const handleResponseChange = (criterionId, value) => {
    const newResponses = { ...responses, [criterionId]: value }
    setResponses(newResponses)
    setScore(websiteAnalyzer.calculateScore(newResponses))
  }

  const resetForm = () => {
    setWebsiteUrl('')
    setBusinessName('')
    setLocation('')
    setResponses({})
    setScore(null)
    setSaved(false)
  }

  const addToPipeline = async () => {
    if (!businessName || !selectedIndustry) {
      alert('Please enter a business name and select an industry')
      return
    }

    setSaving(true)
    try {
      const notes = websiteAnalyzer.generateOutreachNotes(
        websiteAnalyzer.extractDomain(websiteUrl || 'unknown'),
        score || 0,
        responses
      )

      await salesService.addProspect({
        source: 'manual',
        businessName,
        website: websiteUrl,
        industry: selectedIndustry.name,
        location,
        score: score || 0,
        status: 'found',
        notes: `${notes}\n\nIndustry Notes:\n- ${selectedIndustry.pitch_angle}`
      })

      setSaved(true)
    } catch (error) {
      console.error('Failed to add prospect:', error)
      alert('Failed to add to pipeline. Make sure the sales_prospects table exists in Supabase.')
    } finally {
      setSaving(false)
    }
  }

  const fitTier = score !== null ? websiteAnalyzer.getFitTier(score) : null

  return (
    <SalesLayout title="Lead Generator">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Industry Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-900 mb-4">Select Industry</h3>
            <div className="space-y-2">
              {industries.map(industry => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedIndustry?.id === industry.id
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'hover:bg-gray-50 border border-transparent'
                  } ${industry.flag ? 'border-l-4 border-l-red-400' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{industry.displayName}</span>
                    {industry.flag && (
                      <span className="text-xs text-red-500" title="Potential employer conflict">
                        ⚠️
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Industry Details */}
          {selectedIndustry && (
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedIndustry.displayName}</h4>

              {selectedIndustry.flag && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-red-700">
                    <strong>Warning:</strong> This industry is flagged as potential employer conflict. Proceed with caution.
                  </p>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div>
                  <h5 className="font-medium text-gray-700">Pain Points:</h5>
                  <ul className="mt-1 list-disc list-inside text-gray-600">
                    {selectedIndustry.pain_points.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700">Pitch Angle:</h5>
                  <p className="mt-1 text-gray-600 italic">"{selectedIndustry.pitch_angle}"</p>
                </div>

                <div className="flex gap-4">
                  <div>
                    <span className="text-gray-500">Deal Value:</span>
                    <span className="ml-1 font-medium">{selectedIndustry.avgDealValue}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Social Importance:</span>
                    <span className="ml-1 font-medium">{selectedIndustry.socialImportance}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Lead Entry & Scoring */}
        <div className="lg:col-span-2">
          {/* Business Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Smith Dental"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Austin, TX"
                />
              </div>
            </div>

            {/* Quick Links */}
            {websiteUrl && (
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Visit Website →
                </a>
                {websiteAnalyzer.getSocialUrlsToCheck(websiteAnalyzer.extractDomain(websiteUrl)).map(social => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Check {social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Scoring Checklist */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Lead Scoring Checklist</h3>
              {score !== null && fitTier && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  fitTier.tier === 'hot' ? 'bg-green-100 text-green-700' :
                  fitTier.tier === 'warm' ? 'bg-yellow-100 text-yellow-700' :
                  fitTier.tier === 'cool' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {score}/100 - {fitTier.label}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {scoringCriteria.map(criterion => (
                <div key={criterion.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <label className="font-medium text-gray-800 text-sm">
                        {criterion.label}
                        <span className="ml-2 text-gray-400 text-xs">({criterion.weight} pts)</span>
                      </label>
                      {criterion.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{criterion.description}</p>
                      )}
                    </div>

                    {criterion.options ? (
                      <select
                        value={responses[criterion.id] ?? ''}
                        onChange={(e) => handleResponseChange(criterion.id, parseInt(e.target.value))}
                        className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select...</option>
                        {criterion.options.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="checkbox"
                        checked={responses[criterion.id] || false}
                        onChange={(e) => handleResponseChange(criterion.id, e.target.checked)}
                        className="ml-4 w-5 h-5 text-purple-600 rounded"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Display & Actions */}
          {score !== null && fitTier && (
            <div className={`rounded-lg p-6 mb-6 ${
              fitTier.tier === 'hot' ? 'bg-green-50 border border-green-200' :
              fitTier.tier === 'warm' ? 'bg-yellow-50 border border-yellow-200' :
              fitTier.tier === 'cool' ? 'bg-blue-50 border border-blue-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{score}<span className="text-lg text-gray-500">/100</span></div>
                  <div className={`text-lg font-medium ${
                    fitTier.tier === 'hot' ? 'text-green-700' :
                    fitTier.tier === 'warm' ? 'text-yellow-700' :
                    fitTier.tier === 'cool' ? 'text-blue-700' :
                    'text-gray-700'
                  }`}>
                    {fitTier.label}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{fitTier.description}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  {saved ? (
                    <span className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Added to Pipeline
                    </span>
                  ) : (
                    <button
                      onClick={addToPipeline}
                      disabled={saving || !businessName || !selectedIndustry}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Adding...' : 'Add to Pipeline'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!selectedIndustry && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-gray-500">Select an industry to start qualifying leads</p>
            </div>
          )}
        </div>
      </div>
    </SalesLayout>
  )
}
