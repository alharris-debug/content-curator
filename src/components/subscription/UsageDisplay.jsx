import { useSubscription } from '../../contexts/SubscriptionContext'
import { TIERS } from '../../config/tiers'

export default function UsageDisplay({ clientCount = 0 }) {
  const { subscription, isLoading, getUsageStats } = useSubscription()
  const stats = getUsageStats()

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Subscription</h2>
        <p className="text-gray-600 mb-4">No active subscription found.</p>
        <a href="/pricing" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block">
          View Plans
        </a>
      </div>
    )
  }

  const generationsPercent = Math.min(100, (stats.generationsUsed / stats.generationsLimit) * 100)
  const clientsPercent = Math.min(100, (clientCount / stats.clientsLimit) * 100)

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Subscription</h2>
          <p className="text-sm text-gray-500">
            {stats.tierName} Plan - ${TIERS[stats.tier].monthlyPrice}/month
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {subscription.status}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">AI Generations</span>
            <span className="font-medium">{stats.generationsUsed} / {stats.generationsLimit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${generationsPercent >= 90 ? 'bg-red-500' : generationsPercent >= 70 ? 'bg-yellow-500' : 'bg-blue-600'}`}
              style={{ width: `${generationsPercent}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Clients</span>
            <span className="font-medium">{clientCount} / {stats.clientsLimit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${clientsPercent >= 90 ? 'bg-red-500' : clientsPercent >= 70 ? 'bg-yellow-500' : 'bg-blue-600'}`}
              style={{ width: `${clientsPercent}%` }}
            ></div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Resets on {formatDate(stats.periodEnd)}
        </p>
      </div>

      {stats.tier !== 'agency' && (
        <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Upgrade Plan
        </button>
      )}
    </div>
  )
}
