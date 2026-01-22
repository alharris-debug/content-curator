import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { videoScript } from '../../config/salesData'

export default function VideoScript() {
  const fullScript = videoScript.sections.map(s => s.content).join('\n\n')

  return (
    <SalesLayout title="Demo Video Script">
      {/* Action Item Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-yellow-800 font-medium">
          Action item: Record a 2-minute demo video using this script.
        </p>
      </div>

      {/* Script Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Header with title and copy button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{videoScript.title}</h2>
          <CopyButton text={fullScript} />
        </div>

        {/* Timeline Sections */}
        <div className="space-y-6">
          {videoScript.sections.map((section, index) => (
            <div
              key={index}
              className="border-l-4 border-purple-300 pl-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {section.time}
                </span>
                <span className="font-medium text-gray-800">{section.label}</span>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recording Tips Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recording Tips</h3>
        <ul className="space-y-2">
          <li className="text-gray-600 flex items-start">
            <span className="mr-2">-</span>
            Keep energy conversational, not salesy
          </li>
          <li className="text-gray-600 flex items-start">
            <span className="mr-2">-</span>
            Show real UI - don't use mockups
          </li>
          <li className="text-gray-600 flex items-start">
            <span className="mr-2">-</span>
            Pause briefly after the hook to let it land
          </li>
          <li className="text-gray-600 flex items-start">
            <span className="mr-2">-</span>
            Screen record at 1080p minimum
          </li>
          <li className="text-gray-600 flex items-start">
            <span className="mr-2">-</span>
            Add captions for social media
          </li>
        </ul>
      </div>
    </SalesLayout>
  )
}
