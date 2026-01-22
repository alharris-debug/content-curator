import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ClientCard from '../components/clients/ClientCard'
import { useClients } from '../hooks/useClients'

export default function Dashboard() {
  const { clients, isLoading, error, deleteClient } = useClients()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (searchParams.get('subscription') === 'success') {
      setShowWelcome(true)
      // Clear the URL parameter
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  const handleDelete = async (id) => {
    const result = await deleteClient(id)
    if (!result.success) alert(result.error)
  }

  return (
    <PageContainer title="Clients">
      {showWelcome && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start justify-between">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-green-800">Welcome to Content Curator!</p>
              <p className="text-green-700 text-sm">Your subscription is now active. Start by adding your first client below.</p>
            </div>
          </div>
          <button onClick={() => setShowWelcome(false)} className="text-green-500 hover:text-green-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="mb-6">
        <Link to="/clients/new" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </Link>
      </div>

      {isLoading && <div className="text-gray-600">Loading clients...</div>}

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {!isLoading && !error && clients.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No clients yet.</p>
          <Link to="/clients/new" className="text-blue-600 hover:text-blue-800">Add your first client</Link>
        </div>
      )}

      {!isLoading && clients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
