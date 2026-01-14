export default function ClientSelector({ clients, selectedId, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Select Client:</label>
      <select value={selectedId || ''} onChange={(e) => onChange(e.target.value || null)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]">
        <option value="">Choose a client...</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>{client.name}</option>
        ))}
      </select>
    </div>
  )
}
