import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { TIERS } from '../config/tiers'
import { storage } from '../services/storage'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function Pricing() {
  const { user, logout } = useAuth()
  const { subscription } = useSubscription()
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [isLoading, setIsLoading] = useState(null) // tracks which tier is loading
  const [searchParams, setSearchParams] = useSearchParams()
  const [showCanceled, setShowCanceled] = useState(false)

  const hasActiveSubscription = subscription?.status === 'active'

  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      setShowCanceled(true)
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const handleLogout = async () => {
    await logout()
  }

  const handleSubscribe = async (tierKey) => {
    setIsLoading(tierKey)

    try {
      const tier = TIERS[tierKey]
      const priceId = billingCycle === 'monthly'
        ? tier.stripePriceIdMonthly
        : tier.stripePriceIdYearly

      // Get the session for auth token
      const session = await storage.getSession()

      // Call our Edge Function to create a checkout session
      const url = `${SUPABASE_URL}/functions/v1/create-checkout-session`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          priceId,
          customerEmail: user?.email,
          successUrl: `${window.location.origin}/?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      })

      const data = await response.json()

      if (data.error) {
        console.error('Checkout error:', data.error)
        alert(data.error)
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {hasActiveSubscription && (
              <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            )}
            <span className="font-semibold text-gray-800">Content Curator</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {showCanceled && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start justify-between">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Checkout canceled</p>
                  <p className="text-yellow-700 text-sm">No worries! Select a plan when you're ready.</p>
                </div>
              </div>
              <button onClick={() => setShowCanceled(false)} className="text-yellow-500 hover:text-yellow-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Plan</h1>
            <p className="text-gray-600">Start generating AI-powered content for your clients</p>
          </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Yearly <span className="text-green-600 text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(TIERS).map(([key, tier]) => (
            <div
              key={key}
              className={`bg-white rounded-lg shadow-lg p-6 ${
                key === 'pro' ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {key === 'pro' && (
                <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h2 className="text-xl font-bold text-gray-800 mt-2">{tier.name}</h2>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                </span>
                <span className="text-gray-500">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {tier.clients} client{tier.clients > 1 ? 's' : ''}
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {tier.generations} AI generations/mo
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All platforms (GBP, FB, IG, LinkedIn)
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Website analysis
                </li>
              </ul>

              {hasActiveSubscription && subscription?.tier === key ? (
                <button
                  disabled
                  className="mt-6 w-full py-3 px-4 rounded-md font-medium bg-green-100 text-green-800 cursor-default"
                >
                  Current Plan
                </button>
              ) : hasActiveSubscription ? (
                <Link
                  to="/settings"
                  className={`mt-6 w-full py-3 px-4 rounded-md font-medium transition block text-center ${
                    key === 'pro'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Manage Subscription
                </Link>
              ) : (
                <button
                  onClick={() => handleSubscribe(key)}
                  disabled={isLoading !== null}
                  className={`mt-6 w-full py-3 px-4 rounded-md font-medium transition ${
                    key === 'pro'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {isLoading === key ? 'Loading...' : 'Get Started'}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Secure payment powered by Stripe. Cancel anytime.
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
          {' · '}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
        </div>
      </div>
    </div>
  )
}
