import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PageContainer from './components/layout/PageContainer'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function Placeholder({ name }) {
  return (
    <PageContainer title={name}>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">This page is under construction.</p>
      </div>
    </PageContainer>
  )
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/clients/new" element={<ProtectedRoute><Placeholder name="Add Client" /></ProtectedRoute>} />
      <Route path="/clients/:id" element={<ProtectedRoute><Placeholder name="Edit Client" /></ProtectedRoute>} />
      <Route path="/generate" element={<ProtectedRoute><Placeholder name="Generate Posts" /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><Placeholder name="History" /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Placeholder name="Settings" /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
