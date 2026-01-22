import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { objections } from '../../config/salesData'

export default function ObjectionHandler() {
  const [expandedId, setExpandedId] = useState(null)

  const toggleObjection = (objectionId) => {
    setExpandedId(expandedId === objectionId ? null : objectionId)
  }

  return (
    <SalesLayout title="Objection Handling">
      <p className="text-gray-600 mb-6">
        Quick responses to common objections. Click to expand, copy to clipboard.
      </p>

      <div className="space-y-4">
        {objections.map(objection => {
          const isExpanded = expandedId === objection.id
          return (
            <div key={objection.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Objection Header - Clickable */}
              <button
                onClick={() => toggleObjection(objection.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800">{objection.objection}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Response */}
              {isExpanded && (
                <div className="px-4 pb-4">
                  <div className="p-4 bg-green-50 rounded-md">
                    <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                      {objection.response}
                    </pre>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <CopyButton text={objection.response} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SalesLayout>
  )
}
