import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { storage } from '../services/storage'
import { getTierLimits } from '../config/tiers'

const SubscriptionContext = createContext(null)

export function SubscriptionProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [usage, setUsage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      loadSubscriptionData()
    } else {
      setSubscription(null)
      setUsage(null)
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const loadSubscriptionData = async (retryCount = 0) => {
    setIsLoading(true)
    try {
      const [sub, currentUsage] = await Promise.all([
        storage.getSubscription(),
        storage.getCurrentUsage(),
      ])

      // If coming from checkout and no subscription yet, poll for it
      const isPostCheckout = window.location.search.includes('subscription=success')
      if (isPostCheckout && (!sub || sub.status !== 'active') && retryCount < 10) {
        // Wait 1 second and try again (webhook might still be processing)
        setTimeout(() => loadSubscriptionData(retryCount + 1), 1000)
        return // Don't set loading to false, keep showing loading state
      }

      setSubscription(sub)
      setUsage(currentUsage)
      setIsLoading(false)
    } catch (err) {
      console.error('Failed to load subscription:', err)
      setIsLoading(false)
    }
  }

  const refreshUsage = async () => {
    try {
      const currentUsage = await storage.getCurrentUsage()
      setUsage(currentUsage)
    } catch (err) {
      console.error('Failed to refresh usage:', err)
    }
  }

  const incrementUsage = async () => {
    try {
      await storage.incrementUsage()
      await refreshUsage()
    } catch (err) {
      console.error('Failed to increment usage:', err)
      throw err
    }
  }

  // Get current tier limits
  const tierLimits = subscription ? getTierLimits(subscription.tier) : null

  // Check if user can perform actions
  const canAddClient = (currentClientCount) => {
    if (!subscription || !tierLimits) return false
    return currentClientCount < tierLimits.clients
  }

  const canGenerate = () => {
    if (!subscription || !tierLimits || !usage) return false
    return usage.generationsUsed < tierLimits.generations
  }

  // Get usage stats for display
  const getUsageStats = () => {
    if (!subscription || !tierLimits || !usage) {
      return {
        clientsUsed: 0,
        clientsLimit: 0,
        generationsUsed: 0,
        generationsLimit: 0,
        periodEnd: null,
      }
    }
    return {
      tier: subscription.tier,
      tierName: tierLimits.name,
      generationsUsed: usage.generationsUsed,
      generationsLimit: tierLimits.generations,
      clientsLimit: tierLimits.clients,
      periodEnd: subscription.currentPeriodEnd,
    }
  }

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      usage,
      tierLimits,
      isLoading,
      canAddClient,
      canGenerate,
      getUsageStats,
      incrementUsage,
      refreshUsage,
      reload: loadSubscriptionData,
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) throw new Error('useSubscription must be used within a SubscriptionProvider')
  return context
}
