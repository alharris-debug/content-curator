import { useState, useMemo } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { scripts, segments, channels, scriptTypes } from '../../config/salesData'

function highlightPlaceholders(text) {
  return text.split(/(\[[^\]]+\])/).map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return <span key={i} className="bg-yellow-200 text-yellow-800 px-1 rounded">{part}</span>
    }
    return part
  })
}

export default function ScriptLibrary() {
  const [selectedSegment, setSelectedSegment] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [expandedScript, setExpandedScript] = useState(null)

  const filteredScripts = useMemo(() => {
    return scripts.filter(script => {
      if (selectedSegment && script.segment !== selectedSegment) return false
      if (selectedChannel && script.channel !== selectedChannel) return false
      if (selectedType && script.type !== selectedType) return false
      return true
    })
  }, [selectedSegment, selectedChannel, selectedType])

  const hasActiveFilters = selectedSegment || selectedChannel || selectedType

  const clearFilters = () => {
    setSelectedSegment('')
    setSelectedChannel('')
    setSelectedType('')
  }

  const toggleScript = (scriptId) => {
    setExpandedScript(expandedScript === scriptId ? null : scriptId)
  }

  const getSegmentLabel = (segmentId) => {
    const segment = segments.find(s => s.id === segmentId)
    return segment ? segment.label : segmentId
  }

  const getChannelLabel = (channelId) => {
    const channel = channels.find(c => c.id === channelId)
    return channel ? channel.label : channelId
  }

  const getTypeLabel = (typeId) => {
    const type = scriptTypes.find(t => t.id === typeId)
    return type ? type.label : typeId
  }

  return (
    <SalesLayout title="Script Library">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="segment-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Segment
            </label>
            <select
              id="segment-filter"
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Segments</option>
              {segments.map(segment => (
                <option key={segment.id} value={segment.id}>{segment.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="channel-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Channel
            </label>
            <select
              id="channel-filter"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Channels</option>
              {channels.map(channel => (
                <option key={channel.id} value={channel.id}>{channel.label}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {scriptTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex items-end pb-1">
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Script Count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredScripts.length} of {scripts.length} scripts
      </div>

      {/* Scripts List */}
      <div className="space-y-4">
        {filteredScripts.map(script => {
          const isExpanded = expandedScript === script.id
          return (
            <div key={script.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Script Header - Clickable */}
              <button
                onClick={() => toggleScript(script.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{script.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {getSegmentLabel(script.segment)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {getChannelLabel(script.channel)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      {getTypeLabel(script.type)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {script.content.length} chars
                    </span>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                      {highlightPlaceholders(script.content)}
                    </pre>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <CopyButton text={script.content} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredScripts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No scripts match the selected filters.</p>
          <button
            onClick={clearFilters}
            className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </SalesLayout>
  )
}
