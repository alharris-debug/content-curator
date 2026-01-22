import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useSubscription } from '../../contexts/SubscriptionContext'

export default function Navigation() {
  const { logout } = useAuth()
  const { subscription, tierLimits } = useSubscription()
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(false)

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-600'
    }`

  return (
    <nav className="bg-blue-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold text-lg">Content Curator</span>
            <div className="flex space-x-1">
              <NavLink to="/" className={linkClass} end>Clients</NavLink>
              <NavLink to="/generate" className={linkClass}>Generate Posts</NavLink>
              <NavLink to="/history" className={linkClass}>History</NavLink>
              <NavLink to="/settings" className={linkClass}>Settings</NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Help dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-blue-200 hover:text-white text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help
              </button>
              {showHelp && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-800 mb-2">Need help?</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <a href="mailto:alharris603@gmail.com" className="block hover:text-blue-600">
                        alharris603@gmail.com
                      </a>
                      <a href="tel:6038015082" className="block hover:text-blue-600">
                        603-801-5082
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Plan indicator */}
            {subscription && tierLimits && (
              <button
                onClick={() => navigate('/pricing')}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2 py-1 rounded"
              >
                {tierLimits.name} Plan
              </button>
            )}
            <button onClick={logout} className="text-blue-100 hover:text-white text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
