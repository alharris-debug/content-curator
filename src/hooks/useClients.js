import { useState, useEffect, useCallback } from 'react'
import { storage } from '../services/storage'

export function useClients() {
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await storage.getClients()
      setClients(data)
      setError(null)
    } catch (err) {
      setError('Failed to load clients')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const deleteClient = async (id) => {
    try {
      await storage.deleteClient(id)
      await loadClients()
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Failed to delete client' }
    }
  }

  return { clients, isLoading, error, refresh: loadClients, deleteClient }
}
