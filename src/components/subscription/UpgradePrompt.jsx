import { TIERS } from '../../config/tiers'

export default function UpgradePrompt({ type, currentTier, onClose }) {
  const tierOrder = ['starter', 'pro', 'agency']
  const currentIndex = tierOrder.indexOf(currentTier)
  const nextTier = currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null
  const nextTierInfo = nextTier ? TIERS[nextTier] : null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {type === 'clients' ? 'Client Limit Reached' : 'Generation Limit Reached'}
        </h2>

        <p className="text-gray-600 mb-4">
          {type === 'clients'
            ? `You've reached the maximum number of clients for your ${TIERS[currentTier].name} plan.`
            : `You've used all your AI generations for this billing period.`
          }
        </p>

        {nextTierInfo ? (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="font-medium text-blue-800 mb-2">
              Upgrade to {nextTierInfo.name} for:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>Up to {nextTierInfo.clients} clients</li>
              <li>{nextTierInfo.generations} AI generations/month</li>
              <li>Only ${nextTierInfo.monthlyPrice}/month</li>
            </ul>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-600">
              You're on our highest tier. Contact us for custom enterprise pricing.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {nextTierInfo && (
            <button
              onClick={() => window.location.href = '/settings?upgrade=true'}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Upgrade Now
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
