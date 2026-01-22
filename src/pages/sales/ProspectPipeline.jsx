import { useState, useEffect } from 'react'
import SalesLayout from '../../components/sales/SalesLayout'
import { salesService } from '../../services/sales'

const STATUSES = [
  { id: 'found', label: 'Found', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  { id: 'engaged', label: 'Engaged', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  { id: 'responded', label: 'Responded', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  { id: 'converted', label: 'Converted', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  { id: 'rejected', label: 'Rejected', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' }
]

const SOURCES = [
  { id: 'reddit', label: 'Reddit' },
  { id: 'yelp', label: 'Yelp' },
  { id: 'manual', label: 'Manual' }
]

export default function ProspectPipeline() {
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [viewMode, setViewMode] = useState('kanban') // kanban or list
  const [editingProspect, setEditingProspect] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadProspects()
  }, [filterStatus, filterSource])

  const loadProspects = async () => {
    try {
      const filters = {}
      if (filterStatus) filters.status = filterStatus
      if (filterSource) filters.source = filterSource
      const data = await salesService.getProspects(filters)
      setProspects(data)
    } catch (error) {
      console.error('Failed to load prospects:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProspectStatus = async (prospectId, newStatus) => {
    try {
      await salesService.updateProspect(prospectId, { status: newStatus })
      setProspects(prev => prev.map(p =>
        p.id === prospectId ? { ...p, status: newStatus } : p
      ))
    } catch (error) {
      console.error('Failed to update prospect:', error)
    }
  }

  const deleteProspect = async (prospectId) => {
    if (!confirm('Delete this prospect?')) return
    try {
      await salesService.deleteProspect(prospectId)
      setProspects(prev => prev.filter(p => p.id !== prospectId))
    } catch (error) {
      console.error('Failed to delete prospect:', error)
    }
  }

  const getProspectsByStatus = (status) => {
    return prospects.filter(p => p.status === status)
  }

  const getStatusInfo = (statusId) => {
    return STATUSES.find(s => s.id === statusId) || STATUSES[0]
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const exportToCSV = () => {
    if (prospects.length === 0) {
      alert('No prospects to export')
      return
    }

    // CSV headers
    const headers = ['Business Name', 'Website', 'Industry', 'Location', 'Source', 'Source URL', 'Status', 'Score', 'Notes', 'Created At', 'Updated At']

    // Convert prospects to CSV rows
    const rows = prospects.map(p => [
      p.businessName || '',
      p.website || '',
      p.industry || '',
      p.location || '',
      p.source || '',
      p.sourceUrl || '',
      p.status || '',
      p.score || '',
      (p.notes || '').replace(/"/g, '""').replace(/\n/g, ' '), // Escape quotes and newlines
      p.createdAt ? new Date(p.createdAt).toISOString() : '',
      p.updatedAt ? new Date(p.updatedAt).toISOString() : ''
    ])

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `prospects-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <SalesLayout title="Prospect Pipeline">
      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'kanban'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                List
              </button>
            </div>

            {/* Filters */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Sources</option>
              {SOURCES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{prospects.length} prospects</span>
            <button
              onClick={exportToCSV}
              disabled={prospects.length === 0}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
            >
              + Add Prospect
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading prospects...</div>
      ) : viewMode === 'kanban' ? (
        /* Kanban View */
        <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STATUSES.map(status => (
            <div key={status.id} className="min-w-[250px]">
              <div className={`rounded-t-lg px-4 py-2 ${status.bgColor}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${status.textColor}`}>{status.label}</span>
                  <span className={`text-sm ${status.textColor}`}>
                    {getProspectsByStatus(status.id).length}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-b-lg p-2 min-h-[400px] space-y-2">
                {getProspectsByStatus(status.id).map(prospect => (
                  <ProspectCard
                    key={prospect.id}
                    prospect={prospect}
                    onStatusChange={updateProspectStatus}
                    onDelete={deleteProspect}
                    onEdit={() => setEditingProspect(prospect)}
                  />
                ))}
                {getProspectsByStatus(status.id).length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No prospects
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prospects.map(prospect => {
                const statusInfo = getStatusInfo(prospect.status)
                return (
                  <tr key={prospect.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{prospect.businessName || 'Unknown'}</div>
                      {prospect.website && (
                        <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {prospect.website}
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{prospect.source}</span>
                      {prospect.sourceUrl && (
                        <a href={prospect.sourceUrl} target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-600 hover:underline truncate max-w-[150px]">
                          View source
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{prospect.industry || '-'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={prospect.status}
                        onChange={(e) => updateProspectStatus(prospect.id, e.target.value)}
                        className={`text-sm rounded-full px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} border-0 cursor-pointer`}
                      >
                        {STATUSES.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {prospect.score && (
                        <span className={`text-sm font-medium ${
                          prospect.score >= 70 ? 'text-green-600' :
                          prospect.score >= 40 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {prospect.score}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(prospect.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setEditingProspect(prospect)}
                        className="text-gray-400 hover:text-gray-600 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProspect(prospect.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {prospects.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No prospects found. Add some prospects or search Reddit/Yelp for leads.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingProspect) && (
        <ProspectModal
          prospect={editingProspect}
          onClose={() => {
            setShowAddModal(false)
            setEditingProspect(null)
          }}
          onSave={async (data) => {
            if (editingProspect) {
              await salesService.updateProspect(editingProspect.id, data)
            } else {
              await salesService.addProspect(data)
            }
            loadProspects()
            setShowAddModal(false)
            setEditingProspect(null)
          }}
        />
      )}
    </SalesLayout>
  )
}

function ProspectCard({ prospect, onStatusChange, onDelete, onEdit }) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="bg-white rounded-lg shadow p-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onEdit()}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {prospect.businessName || 'Unknown Business'}
          </h4>
          {prospect.industry && (
            <span className="text-xs text-gray-500">{prospect.industry}</span>
          )}
        </div>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {showActions && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-10">
              {STATUSES.filter(s => s.id !== prospect.status).map(status => (
                <button
                  key={status.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange(prospect.id, status.id)
                    setShowActions(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Move to {status.label}
                </button>
              ))}
              <hr />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(prospect.id)
                  setShowActions(false)
                }}
                className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs">
        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
          {prospect.source}
        </span>
        {prospect.score && (
          <span className={`px-1.5 py-0.5 rounded ${
            prospect.score >= 70 ? 'bg-green-100 text-green-700' :
            prospect.score >= 40 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {prospect.score} pts
          </span>
        )}
      </div>

      {prospect.notes && (
        <p className="mt-2 text-xs text-gray-500 line-clamp-2">{prospect.notes}</p>
      )}
    </div>
  )
}

function ProspectModal({ prospect, onClose, onSave }) {
  const [formData, setFormData] = useState({
    businessName: prospect?.businessName || '',
    website: prospect?.website || '',
    industry: prospect?.industry || '',
    location: prospect?.location || '',
    source: prospect?.source || 'manual',
    sourceUrl: prospect?.sourceUrl || '',
    status: prospect?.status || 'found',
    score: prospect?.score || '',
    notes: prospect?.notes || ''
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        ...formData,
        score: formData.score ? parseInt(formData.score) : null
      })
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save prospect')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">
            {prospect ? 'Edit Prospect' : 'Add Prospect'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {SOURCES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
            <input
              type="url"
              value={formData.sourceUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, sourceUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Link to where you found this prospect"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fit Score (1-100)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Additional notes about this prospect..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
