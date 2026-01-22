import { useState, useEffect } from 'react'

const SALES_PASSWORD = 'curator2026'
const STORAGE_KEY = 'sales-tool-auth'

export default function SalesGate({ children }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const storedAuth = sessionStorage.getItem(STORAGE_KEY)
    if (storedAuth === 'true') {
      setIsAuthed(true)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (password === SALES_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setIsAuthed(true)
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  if (isAuthed) {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Sales Tool
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter password to access sales resources
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Access Sales Tool
          </button>
        </form>
      </div>
    </div>
  )
}
