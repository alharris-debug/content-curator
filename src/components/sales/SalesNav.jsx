import { NavLink, useNavigate } from 'react-router-dom'

export default function SalesNav() {
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-purple-700 text-white' : 'text-purple-100 hover:bg-purple-600'
    }`

  return (
    <nav className="bg-purple-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold text-lg">Sales Tool</span>
            <div className="flex space-x-1">
              <NavLink to="/sales" className={linkClass} end>Scripts</NavLink>
              <NavLink to="/sales/flows" className={linkClass}>Flows</NavLink>
              <NavLink to="/sales/pipeline" className={linkClass}>Pipeline</NavLink>
              <NavLink to="/sales/reddit" className={linkClass}>Reddit</NavLink>
              <NavLink to="/sales/yelp" className={linkClass}>Yelp</NavLink>
              <NavLink to="/sales/leads" className={linkClass}>Leads</NavLink>
              <NavLink to="/sales/objections" className={linkClass}>Objections</NavLink>
              <NavLink to="/sales/icp" className={linkClass}>ICP</NavLink>
              <NavLink to="/sales/video" className={linkClass}>Video</NavLink>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-purple-100 hover:text-white text-sm px-3 py-2 rounded-md hover:bg-purple-600"
            >
              Back to App
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
