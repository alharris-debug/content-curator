import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useSubscription } from './contexts/SubscriptionContext'
import Login from './pages/Login'
import Pricing from './pages/Pricing'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import ClientSetup from './pages/ClientSetup'
import Generator from './pages/Generator'
import History from './pages/History'
import Settings from './pages/Settings'
import { ScriptLibrary, ObjectionHandler, ICPReference, VideoScript } from './pages/sales'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function SubscribedRoute({ children }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { subscription, isLoading: subLoading } = useSubscription()

  // Check if coming from successful checkout
  const isPostCheckout = window.location.search.includes('subscription=success')

  if (authLoading || subLoading) {
    // Show special loading screen after checkout
    if (isPostCheckout) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Setting up your account...</p>
            <p className="text-gray-400 text-sm mt-2">This only takes a moment</p>
          </div>
        </div>
      )
    }
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!subscription || subscription.status !== 'active') {
    // If post-checkout but still no subscription, keep showing loading (polling will continue)
    if (isPostCheckout) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Setting up your account...</p>
            <p className="text-gray-400 text-sm mt-2">This only takes a moment</p>
          </div>
        </div>
      )
    }
    return <Navigate to="/pricing" replace />
  }
  return children
}

function App() {
  const { isAuthenticated, isPasswordRecovery } = useAuth()

  // If in password recovery mode, always show reset password page
  if (isPasswordRecovery) {
    return <ResetPassword />
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/reset-password" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
      <Route path="/" element={<SubscribedRoute><Dashboard /></SubscribedRoute>} />
      <Route path="/clients/new" element={<SubscribedRoute><ClientSetup /></SubscribedRoute>} />
      <Route path="/clients/:id" element={<SubscribedRoute><ClientSetup /></SubscribedRoute>} />
      <Route path="/generate" element={<SubscribedRoute><Generator /></SubscribedRoute>} />
      <Route path="/history" element={<SubscribedRoute><History /></SubscribedRoute>} />
      <Route path="/settings" element={<SubscribedRoute><Settings /></SubscribedRoute>} />
      <Route path="/sales" element={<ScriptLibrary />} />
      <Route path="/sales/objections" element={<ObjectionHandler />} />
      <Route path="/sales/icp" element={<ICPReference />} />
      <Route path="/sales/video" element={<VideoScript />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
