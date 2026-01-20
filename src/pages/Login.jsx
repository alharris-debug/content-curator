import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState('login') // 'login', 'signup', 'reset'
  const { login, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      if (mode === 'login') {
        const result = await login(email, password)
        if (result.success) navigate('/')
        else setError(result.error)
      } else if (mode === 'signup') {
        const result = await signUp(email, password)
        if (result.success) {
          setMessage('Check your email to confirm your account, then log in.')
          setMode('login')
        } else {
          setError(result.error)
        }
      } else if (mode === 'reset') {
        const result = await resetPassword(email)
        if (result.success) {
          setMessage('Check your email for a password reset link.')
          setMode('login')
        } else {
          setError(result.error)
        }
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Content Curator</h1>
        <p className="text-gray-600 text-center mb-6">
          {mode === 'login' && 'Sign in to your account'}
          {mode === 'signup' && 'Create a new account'}
          {mode === 'reset' && 'Reset your password'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com" required />
          </div>

          {mode !== 'reset' && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password" required minLength={6} />
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{message}</div>}

          <button type="submit" disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? 'Please wait...' : (
              mode === 'login' ? 'Sign In' :
              mode === 'signup' ? 'Create Account' :
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-4 text-sm text-center space-y-2">
          {mode === 'login' && (
            <>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); setMessage('') }}
                  className="text-blue-600 hover:underline">Sign up</button>
              </p>
              <p>
                <button onClick={() => { setMode('reset'); setError(''); setMessage('') }}
                  className="text-gray-500 hover:underline">Forgot password?</button>
              </p>
            </>
          )}
          {(mode === 'signup' || mode === 'reset') && (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); setMessage('') }}
                className="text-blue-600 hover:underline">Sign in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
