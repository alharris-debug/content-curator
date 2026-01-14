import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
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

function App() {
  const { isAuthenticated } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clients/new" element={<ProtectedRoute><ClientSetup /></ProtectedRoute>} />
      <Route path="/clients/:id" element={<ProtectedRoute><ClientSetup /></ProtectedRoute>} />
      <Route path="/generate" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
