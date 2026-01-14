import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navigation() {
  const { logout } = useAuth()

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
          <button onClick={logout} className="text-blue-100 hover:text-white text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
