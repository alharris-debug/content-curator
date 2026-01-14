import { useState, useRef, useEffect } from 'react'
import PageContainer from '../components/layout/PageContainer'
import { useAuth } from '../contexts/AuthContext'
import { storage } from '../services/storage'
import { claude } from '../services/ai/ClaudeService'

export default function Settings() {
  const { changePassword } = useAuth()
  const fileInputRef = useRef(null)

  const [apiKey, setApiKey] = useState('')
  const [isTestingApi, setIsTestingApi] = useState(false)
  const [apiStatus, setApiStatus] = useState(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState(null)

  const [importMessage, setImportMessage] = useState(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const settings = await storage.getSettings()
    if (settings.apiKey) setApiKey(settings.apiKey)
  }

  const handleSaveApiKey = async () => {
    await storage.saveSettings({ apiKey })
    claude.initialize(apiKey)
    setApiStatus({ type: 'success', message: 'API key saved!' })
  }

  const handleTestApi = async () => {
    if (!apiKey) { setApiStatus({ type: 'error', message: 'Please enter an API key first.' }); return }
    setIsTestingApi(true)
    setApiStatus(null)
    try {
      claude.initialize(apiKey)
      await claude._sendMessage('Say "API working" in exactly two words.')
      setApiStatus({ type: 'success', message: 'API connection successful!' })
    } catch (err) { setApiStatus({ type: 'error', message: err.message }) }
    finally { setIsTestingApi(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMessage(null)
    const result = await changePassword(currentPassword, newPassword)
    if (result.success) {
      setPasswordMessage({ type: 'success', message: 'Password changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
    } else { setPasswordMessage({ type: 'error', message: result.error }) }
  }

  const handleExport = async () => {
    try {
      const data = await storage.exportAll()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `content-curator-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) { alert('Failed to export data') }
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportMessage(null)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!window.confirm('This will replace all existing data. Are you sure?')) {
        fileInputRef.current.value = ''
        return
      }
      await storage.importAll(data)
      setImportMessage({ type: 'success', message: 'Data imported successfully! Refresh the page to see changes.' })
    } catch (err) {
      setImportMessage({ type: 'error', message: err.message || 'Failed to import data. Invalid file format.' })
    }
    fileInputRef.current.value = ''
  }

  return (
    <PageContainer title="Settings">
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">API Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Claude API Key</label>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveApiKey} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Key</button>
              <button onClick={handleTestApi} disabled={isTestingApi}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50">
                {isTestingApi ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            {apiStatus && <div className={`p-3 rounded ${apiStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{apiStatus.message}</div>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Change App Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Change Password</button>
            {passwordMessage && <div className={`p-3 rounded ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{passwordMessage.message}</div>}
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h2>
          <div className="space-y-4">
            <div>
              <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Export All Data</button>
              <p className="mt-1 text-sm text-gray-500">Download a backup of all clients and posts.</p>
            </div>
            <div>
              <label className="block">
                <span className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 cursor-pointer inline-block">Import Data</span>
                <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <p className="mt-1 text-sm text-gray-500">Restore from a backup file. This will replace existing data.</p>
            </div>
            {importMessage && <div className={`p-3 rounded ${importMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{importMessage.message}</div>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Storage:</strong> Local Storage (browser only)</p>
            <p className="text-yellow-600">Data is stored in this browser only. Use Export to backup your data.</p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
