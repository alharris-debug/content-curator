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

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function SubscribedRoute({ children }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { subscription, isLoading: subLoading } = useSubscription()

  if (authLoading || subLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!subscription || subscription.status !== 'active') return <Navigate to="/pricing" replace />
  return children
}

function App() {
  const { isAuthenticated } = useAuth()
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
