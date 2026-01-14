import { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../services/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('content-curator-auth')
    if (sessionAuth === 'true') setIsAuthenticated(true)
    setIsLoading(false)
  }, [])

  const login = async (password) => {
    const settings = await storage.getSettings()
    if (!settings.appPassword) {
      await storage.saveSettings({ appPassword: password })
      sessionStorage.setItem('content-curator-auth', 'true')
      setIsAuthenticated(true)
      return { success: true, isFirstLogin: true }
    }
    if (password === settings.appPassword) {
      sessionStorage.setItem('content-curator-auth', 'true')
      setIsAuthenticated(true)
      return { success: true }
    }
    return { success: false, error: 'Incorrect password' }
  }

  const logout = () => {
    sessionStorage.removeItem('content-curator-auth')
    setIsAuthenticated(false)
  }

  const changePassword = async (currentPassword, newPassword) => {
    const settings = await storage.getSettings()
    if (settings.appPassword && currentPassword !== settings.appPassword) {
      return { success: false, error: 'Current password is incorrect' }
    }
    await storage.saveSettings({ appPassword: newPassword })
    return { success: true }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
