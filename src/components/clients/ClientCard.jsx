import { Link } from 'react-router-dom'

export default function ClientCard({ client, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`Delete ${client.name}? This cannot be undone.`)) {
      onDelete(client.id)
    }
  }

  return (
    <Link to={`/clients/${client.id}`} className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.industry}</p>
          </div>
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-1" title="Delete client">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        {client.url && <div className="mt-3 text-xs text-gray-400 truncate">{client.url}</div>}
      </div>
    </Link>
  )
}
