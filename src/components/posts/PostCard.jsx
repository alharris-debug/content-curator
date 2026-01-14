import { useState } from 'react'

const PLATFORMS = [
  { id: 'gbp', label: 'Google Business' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
]

export default function PostCard({ title, post, onRegenerate, onMarkAsPosted, isRegenerating }) {
  const [showOtherPlatforms, setShowOtherPlatforms] = useState(false)
  const [regeneratePrompt, setRegeneratePrompt] = useState('')
  const [showRegenerateInput, setShowRegenerateInput] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [showPostModal, setShowPostModal] = useState(false)

  const copyToClipboard = async (text, platform) => {
    try {
      await navigator.clipboard.writeText(text)
      alert(`Copied ${platform} post to clipboard!`)
    } catch (err) { console.error('Failed to copy:', err) }
  }

  const handleRegenerate = () => {
    if (showRegenerateInput) {
      onRegenerate(regeneratePrompt)
      setRegeneratePrompt('')
      setShowRegenerateInput(false)
    } else {
      setShowRegenerateInput(true)
    }
  }

  const handleMarkAsPosted = () => {
    if (selectedPlatforms.length > 0) {
      onMarkAsPosted(selectedPlatforms)
      setSelectedPlatforms([])
      setShowPostModal(false)
    }
  }

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    )
  }

  if (!post) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-500">Click generate to create a post.</p>
      </div>
    )
  }

  const PlatformContent = ({ platformId, label }) => {
    const content = post[platformId]
    return (
      <div className="border-t pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{content?.length || 0} chars</span>
            <button onClick={() => copyToClipboard(content, label)}
              className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">Copy</button>
          </div>
        </div>
        <p className="text-gray-600 text-sm whitespace-pre-wrap">{content}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">Topic: {post.topic}</p>
        </div>
      </div>

      <PlatformContent platformId="gbp" label="Google Business Profile" />

      <button onClick={() => setShowOtherPlatforms(!showOtherPlatforms)}
        className="mt-4 text-sm text-blue-600 hover:text-blue-800">
        {showOtherPlatforms ? 'Hide other platforms' : 'Show other platforms'}
      </button>

      {showOtherPlatforms && (
        <div className="mt-4 space-y-4">
          <PlatformContent platformId="facebook" label="Facebook" />
          <PlatformContent platformId="instagram" label="Instagram" />
          <PlatformContent platformId="linkedin" label="LinkedIn" />
        </div>
      )}

      <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
        {showRegenerateInput ? (
          <div className="flex-1 flex gap-2">
            <input type="text" value={regeneratePrompt} onChange={(e) => setRegeneratePrompt(e.target.value)}
              placeholder="e.g., focus on nail services instead"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
            <button onClick={handleRegenerate} disabled={isRegenerating}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50">
              {isRegenerating ? 'Regenerating...' : 'Go'}
            </button>
            <button onClick={() => setShowRegenerateInput(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">Cancel</button>
          </div>
        ) : (
          <>
            <button onClick={handleRegenerate} disabled={isRegenerating}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50">Regenerate</button>
            <button onClick={() => setShowPostModal(true)}
              className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Mark as Posted</button>
          </>
        )}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h4 className="font-semibold text-gray-800 mb-4">Select platforms where this was posted:</h4>
            <div className="space-y-2">
              {PLATFORMS.map((platform) => (
                <label key={platform.id} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={selectedPlatforms.includes(platform.id)}
                    onChange={() => togglePlatform(platform.id)} className="rounded" />
                  <span>{platform.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={handleMarkAsPosted} disabled={selectedPlatforms.length === 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">Confirm</button>
              <button onClick={() => { setShowPostModal(false); setSelectedPlatforms([]) }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
