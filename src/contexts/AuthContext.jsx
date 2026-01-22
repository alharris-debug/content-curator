import { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../services/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      try {
        const currentUser = await storage.getUser()
        if (currentUser) {
          setUser(currentUser)
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
      } finally {
        setIsLoading(false)
      }
    }
    checkUser()

    // Listen for auth state changes
    const { data: { subscription } } = storage.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    try {
      const data = await storage.signUp(email, password)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      const data = await storage.signIn(email, password)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await storage.signOut()
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const resetPassword = async (email) => {
    try {
      await storage.resetPassword(email)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      await storage.updatePassword(newPassword)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      signUp,
      login,
      logout,
      resetPassword,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
