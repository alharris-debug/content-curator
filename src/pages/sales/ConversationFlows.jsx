import { useState } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import CopyButton from '../../components/sales/CopyButton'
import { defaultFlows, stepTypes } from '../../config/flowsData'
import { segments } from '../../config/salesData'

export default function ConversationFlows() {
  const [selectedFlow, setSelectedFlow] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [flowHistory, setFlowHistory] = useState([])

  const getSegmentLabel = (segmentId) => {
    const segment = segments.find(s => s.id === segmentId)
    return segment ? segment.label : segmentId
  }

  const selectFlow = (flow) => {
    setSelectedFlow(flow)
    setCurrentStep(1)
    setFlowHistory([1])
  }

  const goBack = () => {
    setSelectedFlow(null)
    setCurrentStep(1)
    setFlowHistory([])
  }

  const navigateToStep = (stepId) => {
    setCurrentStep(stepId)
    setFlowHistory(prev => [...prev, stepId])
  }

  const goBackStep = () => {
    if (flowHistory.length > 1) {
      const newHistory = [...flowHistory]
      newHistory.pop()
      setFlowHistory(newHistory)
      setCurrentStep(newHistory[newHistory.length - 1])
    }
  }

  const getCurrentStepData = () => {
    if (!selectedFlow) return null
    return selectedFlow.steps.find(s => s.id === currentStep)
  }

  const step = getCurrentStepData()

  return (
    <SalesLayout title="Conversation Flows">
      {!selectedFlow ? (
        /* Flow Selection View */
        <div className="space-y-4">
          <p className="text-gray-600 mb-6">
            Step-by-step conversation guides for different outreach scenarios.
            Click a flow to start the interactive walkthrough.
          </p>

          {defaultFlows.map(flow => (
            <button
              key={flow.id}
              onClick={() => selectFlow(flow)}
              className="w-full bg-white rounded-lg shadow p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{flow.name}</h3>
                  <p className="text-gray-600 mt-1">{flow.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getSegmentLabel(flow.segment)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {flow.steps.length} steps
                    </span>
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Interactive Flow View */
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to flows
            </button>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {selectedFlow.steps.length}
            </div>
          </div>

          {/* Flow Title */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{selectedFlow.name}</h2>
            <p className="text-gray-600 mt-1">{selectedFlow.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(flowHistory.length / selectedFlow.steps.length) * 100}%` }}
            />
          </div>

          {/* Current Step */}
          {step && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Step Header */}
              <div className={`px-6 py-4 ${
                step.type === 'message' ? 'bg-blue-50 border-b border-blue-100' :
                step.type === 'action' ? 'bg-green-50 border-b border-green-100' :
                'bg-yellow-50 border-b border-yellow-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
                      step.type === 'message' ? 'bg-blue-100 text-blue-800' :
                      step.type === 'action' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {stepTypes[step.type]?.label || step.type}
                    </span>
                    <h3 className="font-semibold text-gray-900">{step.label}</h3>
                  </div>
                  {flowHistory.length > 1 && (
                    <button
                      onClick={goBackStep}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Previous step
                    </button>
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                    {step.content}
                  </pre>
                </div>

                <div className="flex justify-end mb-4">
                  <CopyButton text={step.content} />
                </div>

                {/* Notes */}
                {step.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-yellow-800 text-sm">{step.notes}</p>
                    </div>
                  </div>
                )}

                {/* Wait Time */}
                {step.waitTime && (
                  <div className="text-sm text-gray-500 mb-6">
                    <span className="font-medium">Next:</span> {step.waitTime}
                  </div>
                )}

                {/* Branch Options */}
                {step.branches && step.branches.length > 0 && (
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Based on their response:</h4>
                    <div className="space-y-2">
                      {step.branches.map((branch, idx) => (
                        <button
                          key={idx}
                          onClick={() => navigateToStep(branch.nextStep)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                        >
                          <span className="text-gray-700">"{branch.response}"</span>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* End of Flow */}
                {(!step.branches || step.branches.length === 0) && (
                  <div className="border-t border-gray-100 pt-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-800 font-medium">End of this branch</p>
                      <button
                        onClick={goBack}
                        className="mt-3 text-green-700 hover:text-green-900 text-sm underline"
                      >
                        Start another flow
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flow Overview */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-700 mb-3">All steps in this flow:</h4>
            <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
              {selectedFlow.steps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigateToStep(s.id)}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${
                    s.id === currentStep ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      flowHistory.includes(s.id) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {s.id}
                    </span>
                    <span className={`text-sm ${s.id === currentStep ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {s.label}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    s.type === 'message' ? 'bg-blue-100 text-blue-700' :
                    s.type === 'action' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {stepTypes[s.type]?.label || s.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </SalesLayout>
  )
}
