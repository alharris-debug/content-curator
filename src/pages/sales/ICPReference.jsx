import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { icpData } from '../../config/salesData'

export default function ICPReference() {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (segment) => {
    setExpandedId(expandedId === segment ? null : segment)
  }

  return (
    <SalesLayout title="ICP Reference">
      <div className="space-y-4">
        {icpData.map((icp) => (
          <div key={icp.segment} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header - clickable to expand */}
            <button
              onClick={() => toggleExpand(icp.segment)}
              className="w-full px-6 py-4 bg-purple-50 text-purple-900 font-semibold text-left flex items-center justify-between hover:bg-purple-100 transition-colors"
            >
              <span>{icp.segmentLabel}</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  expandedId === icp.segment ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Expanded content */}
            {expandedId === icp.segment && (
              <div className="p-6 space-y-6">
                {/* Who They Are */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Who They Are</h3>
                  <p className="text-gray-600">{icp.whoTheyAre}</p>
                </section>

                {/* Where to Find Them */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Where to Find Them</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {icp.whereToFind.map((place, index) => (
                      <li key={index} className="text-gray-600">
                        {place}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Signals They're a Fit */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Signals They're a Fit</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {icp.signals.map((signal, index) => (
                      <li key={index} className="text-gray-600">
                        {signal}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Value Proposition */}
                <section className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Value Proposition</h3>

                  {/* Hook */}
                  <div className="mb-3">
                    <p className="text-blue-800 font-medium italic text-lg">
                      "{icp.valueProps.hook}"
                    </p>
                  </div>

                  {/* Points */}
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    {icp.valueProps.points.map((point, index) => (
                      <li key={index} className="text-blue-800">
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Cost Angle */}
                  <p className="text-blue-800 italic mb-3">
                    {icp.valueProps.costAngle}
                  </p>

                  {/* Copy Button for hook */}
                  <CopyButton text={icp.valueProps.hook} />
                </section>
              </div>
            )}
          </div>
        ))}
      </div>
    </SalesLayout>
  )
}
