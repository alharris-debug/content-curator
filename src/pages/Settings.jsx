import { useState, useRef, useEffect } from 'react'
import PageContainer from '../components/layout/PageContainer'
import UsageDisplay from '../components/subscription/UsageDisplay'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { storage } from '../services/storage'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function Settings() {
  const { user, logout } = useAuth()
  const { subscription, tierLimits } = useSubscription()
  const fileInputRef = useRef(null)
  const [portalLoading, setPortalLoading] = useState(false)

  const [clientCount, setClientCount] = useState(0)
  const [importMessage, setImportMessage] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const clients = await storage.getClients()
    setClientCount(clients.length)
  }

  const handleExport = async () => {
    try {
      const data = await storage.exportAll()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `content-curator-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) { alert('Failed to export data') }
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportMessage(null)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!window.confirm('This will import data into your account. Existing clients with the same name may be duplicated. Continue?')) {
        fileInputRef.current.value = ''
        return
      }
      await storage.importAll(data)
      setImportMessage({ type: 'success', message: 'Data imported successfully! Refresh the page to see changes.' })
    } catch (err) {
      setImportMessage({ type: 'error', message: err.message || 'Failed to import data. Invalid file format.' })
    }
    fileInputRef.current.value = ''
  }

  const handleLogout = async () => {
    await logout()
  }

  const handleManageSubscription = async () => {
    if (!subscription?.stripeCustomerId) {
      alert('No subscription found')
      return
    }
    setPortalLoading(true)
    try {
      const session = await storage.getSession()
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          customerId: subscription.stripeCustomerId,
          returnUrl: window.location.href,
        }),
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return
      }
      window.location.href = data.url
    } catch (err) {
      console.error('Portal error:', err)
      alert('Failed to open subscription management')
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <PageContainer title="Settings">
      <div className="max-w-2xl space-y-6">
        <UsageDisplay clientCount={clientCount} />

        {/* Subscription Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Subscription</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                Current Plan: <span className="font-semibold text-gray-800">{tierLimits?.name || 'None'}</span>
              </p>
              {subscription?.currentPeriodEnd && (
                <p className="text-sm text-gray-500">
                  Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading || !subscription?.stripeCustomerId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {portalLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
              <a
                href="/pricing"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                View Plans
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Manage billing, update payment method, or cancel your subscription.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-600">{user?.email || 'Not logged in'}</p>
            </div>
            <button onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h2>
          <div className="space-y-4">
            <div>
              <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Export All Data</button>
              <p className="mt-1 text-sm text-gray-500">Download a backup of all clients and posts.</p>
            </div>
            <div>
              <label className="block">
                <span className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 cursor-pointer inline-block">Import Data</span>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <p className="mt-1 text-sm text-gray-500">Import from a backup file.</p>
            </div>
            {importMessage && <div className={`p-3 rounded ${importMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{importMessage.message}</div>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Version:</strong> 2.0.0</p>
            <p><strong>Storage:</strong> Supabase Cloud</p>
            <p className="text-green-600">Your data is securely stored in the cloud and synced across devices.</p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
