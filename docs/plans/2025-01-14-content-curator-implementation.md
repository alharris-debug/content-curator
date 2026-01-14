# Content Curator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a multi-client blog post generator with AI-powered content creation for GBP, Facebook, Instagram, and LinkedIn.

**Architecture:** React SPA with localStorage for Phase 1, abstracted storage layer for future Supabase migration. Claude API for content generation and website analysis. Simple password authentication.

**Tech Stack:** React 18, Vite, Tailwind CSS, React Router, Claude API (Anthropic SDK)

---

## Phase 1: Project Setup

### Task 1: Initialize Vite + React Project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

**Step 1: Create Vite React project**

Run:
```bash
cd /c/Users/alhar/Projects/content-curator
npm create vite@latest . -- --template react
```

Select: Overwrite existing files if prompted (only config files exist)

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Verify project runs**

Run:
```bash
npm run dev
```

Expected: Dev server starts at http://localhost:5173, shows Vite + React default page

**Step 4: Stop dev server and commit**

```bash
git add .
git commit -m "chore: initialize Vite + React project"
```

---

### Task 2: Add Tailwind CSS

**Files:**
- Modify: `package.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Modify: `src/index.css`

**Step 1: Install Tailwind and dependencies**

Run:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 2: Configure Tailwind content paths**

Replace `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 3: Add Tailwind directives to CSS**

Replace `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Test Tailwind is working**

Replace `src/App.jsx`:
```jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-600">
        Content Curator
      </h1>
    </div>
  )
}

export default App
```

**Step 5: Verify styling works**

Run:
```bash
npm run dev
```

Expected: Blue "Content Curator" heading centered on gray background

**Step 6: Commit**

```bash
git add .
git commit -m "chore: add Tailwind CSS"
```

---

### Task 3: Add React Router

**Files:**
- Modify: `package.json`
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`

**Step 1: Install React Router**

Run:
```bash
npm install react-router-dom
```

**Step 2: Set up router in main.jsx**

Replace `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

**Step 3: Add placeholder routes in App.jsx**

Replace `src/App.jsx`:
```jsx
import { Routes, Route } from 'react-router-dom'

function Placeholder({ name }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder name="Dashboard" />} />
      <Route path="/login" element={<Placeholder name="Login" />} />
      <Route path="/clients/new" element={<Placeholder name="Add Client" />} />
      <Route path="/clients/:id" element={<Placeholder name="Edit Client" />} />
      <Route path="/generate" element={<Placeholder name="Generate Posts" />} />
      <Route path="/history" element={<Placeholder name="History" />} />
      <Route path="/settings" element={<Placeholder name="Settings" />} />
    </Routes>
  )
}

export default App
```

**Step 4: Verify routing works**

Run:
```bash
npm run dev
```

Navigate to:
- http://localhost:5173/ → Shows "Dashboard"
- http://localhost:5173/login → Shows "Login"
- http://localhost:5173/settings → Shows "Settings"

**Step 5: Commit**

```bash
git add .
git commit -m "chore: add React Router with placeholder routes"
```

---

## Phase 2: Core Infrastructure

### Task 4: Create Storage Service Interface

**Files:**
- Create: `src/services/storage/StorageService.js`

**Step 1: Define storage interface**

Create `src/services/storage/StorageService.js`:
```javascript
/**
 * Storage Service Interface
 * Phase 1: LocalStorageService
 * Phase 2: SupabaseService (future)
 */

export class StorageService {
  // Client methods
  async getClients() {
    throw new Error('Not implemented')
  }

  async getClient(id) {
    throw new Error('Not implemented')
  }

  async saveClient(client) {
    throw new Error('Not implemented')
  }

  async deleteClient(id) {
    throw new Error('Not implemented')
  }

  // Post methods
  async getPosts(clientId = null, limit = null) {
    throw new Error('Not implemented')
  }

  async savePost(post) {
    throw new Error('Not implemented')
  }

  // Settings methods
  async getSettings() {
    throw new Error('Not implemented')
  }

  async saveSettings(settings) {
    throw new Error('Not implemented')
  }

  // Export/Import methods
  async exportAll() {
    throw new Error('Not implemented')
  }

  async importAll(data) {
    throw new Error('Not implemented')
  }
}
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add StorageService interface"
```

---

### Task 5: Implement LocalStorageService

**Files:**
- Create: `src/services/storage/LocalStorageService.js`
- Create: `src/services/storage/index.js`

**Step 1: Implement LocalStorageService**

Create `src/services/storage/LocalStorageService.js`:
```javascript
import { StorageService } from './StorageService'

const STORAGE_KEYS = {
  CLIENTS: 'content-curator-clients',
  POSTS: 'content-curator-posts',
  SETTINGS: 'content-curator-settings',
}

const DEFAULT_SETTINGS = {
  apiKey: '',
  appPassword: '',
  version: '1.0',
}

export class LocalStorageService extends StorageService {
  // Helper to generate unique IDs
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Helper to safely parse JSON from localStorage
  _getItem(key, defaultValue = []) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  // Helper to save to localStorage
  _setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  // Client methods
  async getClients() {
    return this._getItem(STORAGE_KEYS.CLIENTS, [])
  }

  async getClient(id) {
    const clients = await this.getClients()
    return clients.find(c => c.id === id) || null
  }

  async saveClient(client) {
    const clients = await this.getClients()
    const now = new Date().toISOString()

    if (client.id) {
      // Update existing
      const index = clients.findIndex(c => c.id === client.id)
      if (index !== -1) {
        clients[index] = { ...client, updatedAt: now }
      }
    } else {
      // Create new
      client.id = this._generateId()
      client.createdAt = now
      client.updatedAt = now
      clients.push(client)
    }

    this._setItem(STORAGE_KEYS.CLIENTS, clients)
    return client
  }

  async deleteClient(id) {
    const clients = await this.getClients()
    const filtered = clients.filter(c => c.id !== id)
    this._setItem(STORAGE_KEYS.CLIENTS, filtered)

    // Also delete associated posts
    const posts = await this.getPosts()
    const filteredPosts = posts.filter(p => p.clientId !== id)
    this._setItem(STORAGE_KEYS.POSTS, filteredPosts)
  }

  // Post methods
  async getPosts(clientId = null, limit = null) {
    let posts = this._getItem(STORAGE_KEYS.POSTS, [])

    if (clientId) {
      posts = posts.filter(p => p.clientId === clientId)
    }

    // Sort by postedAt descending (newest first)
    posts.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))

    if (limit) {
      posts = posts.slice(0, limit)
    }

    return posts
  }

  async savePost(post) {
    const posts = this._getItem(STORAGE_KEYS.POSTS, [])

    post.id = this._generateId()
    post.postedAt = new Date().toISOString()
    posts.push(post)

    this._setItem(STORAGE_KEYS.POSTS, posts)
    return post
  }

  // Settings methods
  async getSettings() {
    return this._getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  }

  async saveSettings(settings) {
    const current = await this.getSettings()
    const updated = { ...current, ...settings }
    this._setItem(STORAGE_KEYS.SETTINGS, updated)
    return updated
  }

  // Export/Import methods
  async exportAll() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        clients: await this.getClients(),
        posts: this._getItem(STORAGE_KEYS.POSTS, []),
        settings: {
          ...(await this.getSettings()),
          apiKey: '', // Don't export API key
        },
      },
    }
  }

  async importAll(data) {
    if (!data.version || !data.data) {
      throw new Error('Invalid import file format')
    }

    if (data.data.clients) {
      this._setItem(STORAGE_KEYS.CLIENTS, data.data.clients)
    }
    if (data.data.posts) {
      this._setItem(STORAGE_KEYS.POSTS, data.data.posts)
    }
    // Don't import settings (preserve API key)

    return true
  }
}
```

**Step 2: Create index export**

Create `src/services/storage/index.js`:
```javascript
import { LocalStorageService } from './LocalStorageService'

// Export singleton instance
// Phase 2: swap this for SupabaseService
export const storage = new LocalStorageService()
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: implement LocalStorageService"
```

---

### Task 6: Create Auth Context

**Files:**
- Create: `src/contexts/AuthContext.jsx`

**Step 1: Implement auth context**

Create `src/contexts/AuthContext.jsx`:
```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../services/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user was previously authenticated this session
    const sessionAuth = sessionStorage.getItem('content-curator-auth')
    if (sessionAuth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (password) => {
    const settings = await storage.getSettings()

    // If no password is set yet, set it
    if (!settings.appPassword) {
      await storage.saveSettings({ appPassword: password })
      sessionStorage.setItem('content-curator-auth', 'true')
      setIsAuthenticated(true)
      return { success: true, isFirstLogin: true }
    }

    // Check password
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
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

**Step 2: Wrap app with AuthProvider**

Modify `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add AuthContext for password authentication"
```

---

### Task 7: Build Login Page

**Files:**
- Create: `src/pages/Login.jsx`
- Modify: `src/App.jsx`

**Step 1: Create Login page component**

Create `src/pages/Login.jsx`:
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(password)

      if (result.success) {
        if (result.isFirstLogin) {
          // Could show a welcome message
        }
        navigate('/')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Content Curator
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your password to continue
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          First time? Your password will be set on first login.
        </p>
      </div>
    </div>
  )
}
```

**Step 2: Update App.jsx with protected routes**

Replace `src/App.jsx`:
```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function Placeholder({ name }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
    </div>
  )
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Placeholder name="Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/new"
        element={
          <ProtectedRoute>
            <Placeholder name="Add Client" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute>
            <Placeholder name="Edit Client" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <Placeholder name="Generate Posts" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Placeholder name="History" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Placeholder name="Settings" />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
```

**Step 3: Verify login flow**

Run:
```bash
npm run dev
```

Test:
1. Go to http://localhost:5173/ → Redirects to /login
2. Enter any password → Sets as app password, redirects to Dashboard
3. Open new tab → Should still be authenticated (session storage)
4. Close all tabs, reopen → Should require login again

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Login page with protected routes"
```

---

### Task 8: Create Layout Components

**Files:**
- Create: `src/components/layout/Navigation.jsx`
- Create: `src/components/layout/PageContainer.jsx`
- Modify: `src/App.jsx`

**Step 1: Create Navigation component**

Create `src/components/layout/Navigation.jsx`:
```jsx
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navigation() {
  const { logout } = useAuth()

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-blue-700 text-white'
        : 'text-blue-100 hover:bg-blue-600'
    }`

  return (
    <nav className="bg-blue-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold text-lg">
              Content Curator
            </span>
            <div className="flex space-x-1">
              <NavLink to="/" className={linkClass} end>
                Clients
              </NavLink>
              <NavLink to="/generate" className={linkClass}>
                Generate Posts
              </NavLink>
              <NavLink to="/history" className={linkClass}>
                History
              </NavLink>
              <NavLink to="/settings" className={linkClass}>
                Settings
              </NavLink>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-blue-100 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
```

**Step 2: Create PageContainer component**

Create `src/components/layout/PageContainer.jsx`:
```jsx
import Navigation from './Navigation'

export default function PageContainer({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {title && (
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
        )}
        {children}
      </main>
    </div>
  )
}
```

**Step 3: Update App.jsx to use layout**

Replace the `Placeholder` function in `src/App.jsx`:
```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import PageContainer from './components/layout/PageContainer'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function Placeholder({ name }) {
  return (
    <PageContainer title={name}>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">This page is under construction.</p>
      </div>
    </PageContainer>
  )
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Placeholder name="Clients" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/new"
        element={
          <ProtectedRoute>
            <Placeholder name="Add Client" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute>
            <Placeholder name="Edit Client" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <Placeholder name="Generate Posts" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <Placeholder name="History" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Placeholder name="Settings" />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
```

**Step 4: Verify layout**

Run:
```bash
npm run dev
```

Test:
1. Login → Should see navigation bar with Clients, Generate Posts, History, Settings
2. Click each nav link → Should navigate and highlight active link
3. Click Logout → Should return to login page

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add Navigation and PageContainer layout components"
```

---

## Phase 3: Client Management

### Task 9: Build Client Dashboard

**Files:**
- Create: `src/pages/Dashboard.jsx`
- Create: `src/components/clients/ClientCard.jsx`
- Create: `src/hooks/useClients.js`
- Modify: `src/App.jsx`

**Step 1: Create useClients hook**

Create `src/hooks/useClients.js`:
```jsx
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

  return {
    clients,
    isLoading,
    error,
    refresh: loadClients,
    deleteClient,
  }
}
```

**Step 2: Create ClientCard component**

Create `src/components/clients/ClientCard.jsx`:
```jsx
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
    <Link
      to={`/clients/${client.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {client.name}
            </h3>
            <p className="text-sm text-gray-500">{client.industry}</p>
          </div>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 p-1"
            title="Delete client"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          {client.url && (
            <span className="truncate block">{client.url}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
```

**Step 3: Create Dashboard page**

Create `src/pages/Dashboard.jsx`:
```jsx
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ClientCard from '../components/clients/ClientCard'
import { useClients } from '../hooks/useClients'

export default function Dashboard() {
  const { clients, isLoading, error, deleteClient } = useClients()

  const handleDelete = async (id) => {
    const result = await deleteClient(id)
    if (!result.success) {
      alert(result.error)
    }
  }

  return (
    <PageContainer title="Clients">
      <div className="mb-6">
        <Link
          to="/clients/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Client
        </Link>
      </div>

      {isLoading && (
        <div className="text-gray-600">Loading clients...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!isLoading && !error && clients.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No clients yet.</p>
          <Link
            to="/clients/new"
            className="text-blue-600 hover:text-blue-800"
          >
            Add your first client
          </Link>
        </div>
      )}

      {!isLoading && clients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
```

**Step 4: Update App.jsx to use Dashboard**

In `src/App.jsx`, add import and replace the "/" route:
```jsx
import Dashboard from './pages/Dashboard'

// In the Routes, replace the "/" route:
<Route
  path="/"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

**Step 5: Verify Dashboard**

Run:
```bash
npm run dev
```

Test:
1. Login → Should see "Clients" page with "Add Client" button
2. Shows "No clients yet" message
3. Navigation should work

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Client Dashboard with ClientCard component"
```

---

### Task 10: Build Client Setup Form

**Files:**
- Create: `src/pages/ClientSetup.jsx`
- Create: `src/components/clients/ClientForm.jsx`
- Modify: `src/App.jsx`

**Step 1: Create ClientForm component**

Create `src/components/clients/ClientForm.jsx`:
```jsx
import { useState } from 'react'

export default function ClientForm({ client, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    url: client?.url || '',
    industry: client?.industry || '',
    targetAudience: client?.targetAudience || '',
    brandVoice: client?.brandVoice || '',
    scrapedContent: client?.scrapedContent || {
      services: [],
      aboutText: '',
      keyPhrases: [],
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...client,
      ...formData,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL *
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={!formData.url || isLoading}
          >
            Analyze Website
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Click "Analyze Website" to auto-fill fields below
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client/Business Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Business Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Industry *
        </label>
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g., Day Spa & Wellness"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience
        </label>
        <input
          type="text"
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          placeholder="e.g., Women 30-55 seeking relaxation and self-care"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand Voice
        </label>
        <textarea
          name="brandVoice"
          value={formData.brandVoice}
          onChange={handleChange}
          placeholder="e.g., Warm, nurturing, professional but approachable"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : client?.id ? 'Update Client' : 'Save Client'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
```

**Step 2: Create ClientSetup page**

Create `src/pages/ClientSetup.jsx`:
```jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ClientForm from '../components/clients/ClientForm'
import { storage } from '../services/storage'

export default function ClientSetup() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  const isEditing = !!id

  useEffect(() => {
    if (id) {
      loadClient()
    }
  }, [id])

  const loadClient = async () => {
    try {
      const data = await storage.getClient(id)
      if (data) {
        setClient(data)
      } else {
        setError('Client not found')
      }
    } catch (err) {
      setError('Failed to load client')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (clientData) => {
    setIsSaving(true)
    setError(null)

    try {
      await storage.saveClient(clientData)
      navigate('/')
    } catch (err) {
      setError('Failed to save client')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (isLoading) {
    return (
      <PageContainer title={isEditing ? 'Edit Client' : 'Add Client'}>
        <div className="text-gray-600">Loading...</div>
      </PageContainer>
    )
  }

  if (error && isEditing) {
    return (
      <PageContainer title="Edit Client">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={isEditing ? 'Edit Client' : 'Add Client'}>
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <ClientForm
            client={client}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
          />
        </div>
      </div>
    </PageContainer>
  )
}
```

**Step 3: Update App.jsx**

Add import and update routes in `src/App.jsx`:
```jsx
import ClientSetup from './pages/ClientSetup'

// Update routes:
<Route
  path="/clients/new"
  element={
    <ProtectedRoute>
      <ClientSetup />
    </ProtectedRoute>
  }
/>
<Route
  path="/clients/:id"
  element={
    <ProtectedRoute>
      <ClientSetup />
    </ProtectedRoute>
  }
/>
```

**Step 4: Verify client creation flow**

Run:
```bash
npm run dev
```

Test:
1. Click "Add Client" → Shows form
2. Fill in required fields (URL, Name, Industry)
3. Click Save → Redirects to Dashboard, shows new client card
4. Click client card → Opens edit form with data populated
5. Update and save → Changes persist

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add ClientSetup page with ClientForm"
```

---

### Task 11: Add Claude API Service

**Files:**
- Create: `src/services/ai/ClaudeService.js`
- Create: `src/services/ai/prompts.js`
- Modify: `package.json`

**Step 1: Install Anthropic SDK**

Run:
```bash
npm install @anthropic-ai/sdk
```

**Step 2: Create prompts file**

Create `src/services/ai/prompts.js`:
```javascript
export const ANALYZE_WEBSITE_PROMPT = `Analyze this website content and extract the following information. Return a JSON object with these exact keys:

{
  "name": "The business/company name",
  "industry": "The industry or business type (e.g., 'Day Spa & Wellness', 'Accounting Firm')",
  "targetAudience": "Who the business serves (e.g., 'Women 30-55 seeking relaxation')",
  "brandVoice": "The tone and style of their communication (e.g., 'Warm, professional, approachable')",
  "services": ["List", "of", "main", "services"],
  "aboutText": "A brief summary of what the business does",
  "keyPhrases": ["Important", "phrases", "or", "taglines", "from", "the", "site"]
}

Website content:
`

export const GENERATE_SERVICE_POST_PROMPT = `You are a social media content creator. Generate a post about a service offered by this business.

Business Info:
- Name: {name}
- Industry: {industry}
- Target Audience: {targetAudience}
- Brand Voice: {brandVoice}
- Services: {services}

{serviceFocus}

{recentTopics}

Generate a post that:
1. Highlights a specific service or benefit
2. Matches the brand voice
3. Appeals to the target audience
4. Avoids any recently covered topics

Return a JSON object with these exact keys:
{
  "topic": "Brief description of the post topic",
  "gbp": "Google Business Profile version (under 1500 chars, concise, local-focused, no hashtags)",
  "facebook": "Facebook version (conversational, can include CTA, 1-3 hashtags)",
  "instagram": "Instagram version (engaging hook, emoji-friendly, 5-10 relevant hashtags)",
  "linkedin": "LinkedIn version (professional tone, industry-relevant, 1-3 hashtags)"
}
`

export const GENERATE_LIFESTYLE_POST_PROMPT = `You are a social media content creator. Generate a lifestyle/non-industry post that would appeal to this business's audience.

Business Info:
- Name: {name}
- Industry: {industry}
- Target Audience: {targetAudience}
- Brand Voice: {brandVoice}

{category}

{recentTopics}

Generate a post that:
1. Is NOT about the business's services directly
2. Would appeal to and resonate with the target audience
3. Could be a recipe, book recommendation, motivational content, seasonal tip, or local event idea
4. Maintains the brand voice
5. Avoids any recently covered topics

Return a JSON object with these exact keys:
{
  "topic": "Brief description of the post topic",
  "gbp": "Google Business Profile version (under 1500 chars, concise, local-focused, no hashtags)",
  "facebook": "Facebook version (conversational, can include CTA, 1-3 hashtags)",
  "instagram": "Instagram version (engaging hook, emoji-friendly, 5-10 relevant hashtags)",
  "linkedin": "LinkedIn version (professional tone, industry-relevant, 1-3 hashtags)"
}
`

export const REGENERATE_POST_PROMPT = `You are a social media content creator. Regenerate a post with the following adjustment:

Original post topic: {originalTopic}

User's adjustment request: {adjustment}

Business Info:
- Name: {name}
- Industry: {industry}
- Target Audience: {targetAudience}
- Brand Voice: {brandVoice}

Generate a new version of the post incorporating the user's requested changes while:
1. Maintaining the brand voice
2. Keeping it relevant to the target audience

Return a JSON object with these exact keys:
{
  "topic": "Brief description of the new post topic",
  "gbp": "Google Business Profile version (under 1500 chars, concise, local-focused, no hashtags)",
  "facebook": "Facebook version (conversational, can include CTA, 1-3 hashtags)",
  "instagram": "Instagram version (engaging hook, emoji-friendly, 5-10 relevant hashtags)",
  "linkedin": "LinkedIn version (professional tone, industry-relevant, 1-3 hashtags)"
}
`
```

**Step 3: Create ClaudeService**

Create `src/services/ai/ClaudeService.js`:
```javascript
import Anthropic from '@anthropic-ai/sdk'
import {
  ANALYZE_WEBSITE_PROMPT,
  GENERATE_SERVICE_POST_PROMPT,
  GENERATE_LIFESTYLE_POST_PROMPT,
  REGENERATE_POST_PROMPT,
} from './prompts'

class ClaudeService {
  constructor() {
    this.client = null
  }

  initialize(apiKey) {
    this.client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    })
  }

  isInitialized() {
    return this.client !== null
  }

  async _sendMessage(prompt) {
    if (!this.client) {
      throw new Error('Claude API not initialized. Please add your API key in Settings.')
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = response.content[0].text

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ||
                        text.match(/```\n?([\s\S]*?)\n?```/) ||
                        [null, text]

      return JSON.parse(jsonMatch[1] || text)
    } catch (error) {
      if (error.status === 401) {
        throw new Error('Invalid API key. Please check your key in Settings.')
      }
      if (error.status === 429) {
        throw new Error('Rate limited. Please wait a moment and try again.')
      }
      if (error.message?.includes('JSON')) {
        throw new Error('Failed to parse AI response. Please try again.')
      }
      throw new Error(`AI request failed: ${error.message}`)
    }
  }

  async analyzeWebsite(websiteContent) {
    const prompt = ANALYZE_WEBSITE_PROMPT + websiteContent
    return this._sendMessage(prompt)
  }

  async generateServicePost(client, serviceFocus = null, recentTopics = []) {
    let prompt = GENERATE_SERVICE_POST_PROMPT
      .replace('{name}', client.name)
      .replace('{industry}', client.industry)
      .replace('{targetAudience}', client.targetAudience || 'General audience')
      .replace('{brandVoice}', client.brandVoice || 'Professional and friendly')
      .replace('{services}', client.scrapedContent?.services?.join(', ') || 'Various services')

    prompt = prompt.replace(
      '{serviceFocus}',
      serviceFocus ? `Focus specifically on: ${serviceFocus}` : 'Choose a service to highlight.'
    )

    prompt = prompt.replace(
      '{recentTopics}',
      recentTopics.length > 0
        ? `Avoid these recently covered topics:\n${recentTopics.map(t => `- ${t}`).join('\n')}`
        : ''
    )

    return this._sendMessage(prompt)
  }

  async generateLifestylePost(client, category = null, recentTopics = []) {
    let prompt = GENERATE_LIFESTYLE_POST_PROMPT
      .replace('{name}', client.name)
      .replace('{industry}', client.industry)
      .replace('{targetAudience}', client.targetAudience || 'General audience')
      .replace('{brandVoice}', client.brandVoice || 'Professional and friendly')

    prompt = prompt.replace(
      '{category}',
      category && category !== 'surprise'
        ? `Generate a post in this category: ${category}`
        : 'Choose an appropriate lifestyle topic.'
    )

    prompt = prompt.replace(
      '{recentTopics}',
      recentTopics.length > 0
        ? `Avoid these recently covered topics:\n${recentTopics.map(t => `- ${t}`).join('\n')}`
        : ''
    )

    return this._sendMessage(prompt)
  }

  async regeneratePost(client, originalTopic, adjustment) {
    const prompt = REGENERATE_POST_PROMPT
      .replace('{originalTopic}', originalTopic)
      .replace('{adjustment}', adjustment)
      .replace('{name}', client.name)
      .replace('{industry}', client.industry)
      .replace('{targetAudience}', client.targetAudience || 'General audience')
      .replace('{brandVoice}', client.brandVoice || 'Professional and friendly')

    return this._sendMessage(prompt)
  }
}

export const claude = new ClaudeService()
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Claude API service with prompts"
```

---

### Task 12: Add Website Scraping Service

**Files:**
- Create: `src/services/scraper/WebsiteScraper.js`

**Step 1: Create WebsiteScraper**

Create `src/services/scraper/WebsiteScraper.js`:
```javascript
/**
 * Website Scraper Service
 * Uses a CORS proxy to fetch website content for analysis
 */

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
]

class WebsiteScraper {
  async fetchWithProxy(url) {
    // Try each proxy until one works
    for (const proxy of CORS_PROXIES) {
      try {
        const response = await fetch(proxy + encodeURIComponent(url), {
          headers: {
            'Accept': 'text/html',
          },
        })

        if (response.ok) {
          return await response.text()
        }
      } catch (error) {
        console.warn(`Proxy ${proxy} failed:`, error.message)
        continue
      }
    }

    throw new Error('Could not fetch website. Please check the URL and try again.')
  }

  extractTextContent(html) {
    // Create a DOM parser
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // Remove scripts, styles, and other non-content elements
    const removeSelectors = [
      'script', 'style', 'noscript', 'iframe', 'svg',
      'header nav', 'footer', '.cookie-banner', '#cookie-consent'
    ]
    removeSelectors.forEach(selector => {
      doc.querySelectorAll(selector).forEach(el => el.remove())
    })

    // Extract title
    const title = doc.querySelector('title')?.textContent || ''

    // Extract meta description
    const metaDesc = doc.querySelector('meta[name="description"]')?.content || ''

    // Extract main content areas
    const contentSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.content',
      '#content',
      '.main-content',
      '.page-content',
    ]

    let mainContent = ''
    for (const selector of contentSelectors) {
      const el = doc.querySelector(selector)
      if (el) {
        mainContent = el.textContent
        break
      }
    }

    // Fallback to body if no main content found
    if (!mainContent) {
      mainContent = doc.body?.textContent || ''
    }

    // Extract headings for services/sections
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3'))
      .map(h => h.textContent.trim())
      .filter(h => h.length > 0 && h.length < 100)
      .slice(0, 20)

    // Clean up whitespace
    const cleanText = (text) => {
      return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim()
        .slice(0, 8000) // Limit content length for API
    }

    return {
      title: cleanText(title),
      metaDescription: cleanText(metaDesc),
      headings,
      content: cleanText(mainContent),
    }
  }

  async scrape(url) {
    // Validate URL
    try {
      new URL(url)
    } catch {
      throw new Error('Invalid URL format')
    }

    // Fetch the page
    const html = await this.fetchWithProxy(url)

    // Extract content
    const extracted = this.extractTextContent(html)

    // Format for AI analysis
    const formattedContent = `
Website URL: ${url}
Title: ${extracted.title}
Meta Description: ${extracted.metaDescription}

Page Headings:
${extracted.headings.map(h => `- ${h}`).join('\n')}

Page Content:
${extracted.content}
    `.trim()

    return formattedContent
  }
}

export const scraper = new WebsiteScraper()
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add WebsiteScraper service"
```

---

### Task 13: Integrate Website Analysis into Client Form

**Files:**
- Modify: `src/components/clients/ClientForm.jsx`
- Modify: `src/pages/ClientSetup.jsx`

**Step 1: Update ClientForm with analyze functionality**

Replace `src/components/clients/ClientForm.jsx`:
```jsx
import { useState } from 'react'

export default function ClientForm({
  client,
  onSave,
  onCancel,
  onAnalyze,
  isLoading,
  isAnalyzing,
}) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    url: client?.url || '',
    industry: client?.industry || '',
    targetAudience: client?.targetAudience || '',
    brandVoice: client?.brandVoice || '',
    scrapedContent: client?.scrapedContent || {
      services: [],
      aboutText: '',
      keyPhrases: [],
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAnalyze = async () => {
    if (!formData.url) return

    const result = await onAnalyze(formData.url)
    if (result) {
      setFormData((prev) => ({
        ...prev,
        name: result.name || prev.name,
        industry: result.industry || prev.industry,
        targetAudience: result.targetAudience || prev.targetAudience,
        brandVoice: result.brandVoice || prev.brandVoice,
        scrapedContent: {
          services: result.services || [],
          aboutText: result.aboutText || '',
          keyPhrases: result.keyPhrases || [],
        },
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...client,
      ...formData,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL *
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!formData.url || isAnalyzing || isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Click "Analyze Website" to auto-fill fields below
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client/Business Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Business Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Industry *
        </label>
        <input
          type="text"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g., Day Spa & Wellness"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Audience
        </label>
        <input
          type="text"
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          placeholder="e.g., Women 30-55 seeking relaxation and self-care"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand Voice
        </label>
        <textarea
          name="brandVoice"
          value={formData.brandVoice}
          onChange={handleChange}
          placeholder="e.g., Warm, nurturing, professional but approachable"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {formData.scrapedContent?.services?.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Detected Services
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.scrapedContent.services.map((service, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || isAnalyzing}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : client?.id ? 'Update Client' : 'Save Client'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading || isAnalyzing}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
```

**Step 2: Update ClientSetup to handle analysis**

Replace `src/pages/ClientSetup.jsx`:
```jsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ClientForm from '../components/clients/ClientForm'
import { storage } from '../services/storage'
import { scraper } from '../services/scraper/WebsiteScraper'
import { claude } from '../services/ai/ClaudeService'

export default function ClientSetup() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)

  const isEditing = !!id

  useEffect(() => {
    if (id) {
      loadClient()
    }
    initializeAI()
  }, [id])

  const initializeAI = async () => {
    const settings = await storage.getSettings()
    if (settings.apiKey) {
      claude.initialize(settings.apiKey)
    }
  }

  const loadClient = async () => {
    try {
      const data = await storage.getClient(id)
      if (data) {
        setClient(data)
      } else {
        setError('Client not found')
      }
    } catch (err) {
      setError('Failed to load client')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async (url) => {
    if (!claude.isInitialized()) {
      setError('Please add your Claude API key in Settings first.')
      return null
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      // Scrape the website
      const websiteContent = await scraper.scrape(url)

      // Analyze with Claude
      const analysis = await claude.analyzeWebsite(websiteContent)

      return analysis
    } catch (err) {
      setError(err.message || 'Failed to analyze website')
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSave = async (clientData) => {
    setIsSaving(true)
    setError(null)

    try {
      await storage.saveClient(clientData)
      navigate('/')
    } catch (err) {
      setError('Failed to save client')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (isLoading) {
    return (
      <PageContainer title={isEditing ? 'Edit Client' : 'Add Client'}>
        <div className="text-gray-600">Loading...</div>
      </PageContainer>
    )
  }

  if (error && isEditing && !client) {
    return (
      <PageContainer title="Edit Client">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={isEditing ? 'Edit Client' : 'Add Client'}>
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <ClientForm
            client={client}
            onSave={handleSave}
            onCancel={handleCancel}
            onAnalyze={handleAnalyze}
            isLoading={isSaving}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </PageContainer>
  )
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: integrate website analysis into client form"
```

---

## Phase 4: Post Generation

### Task 14: Build Post Generator Page

**Files:**
- Create: `src/pages/Generator.jsx`
- Create: `src/components/posts/PostCard.jsx`
- Create: `src/components/clients/ClientSelector.jsx`
- Modify: `src/App.jsx`

**Step 1: Create ClientSelector component**

Create `src/components/clients/ClientSelector.jsx`:
```jsx
export default function ClientSelector({ clients, selectedId, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">
        Select Client:
      </label>
      <select
        value={selectedId || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
      >
        <option value="">Choose a client...</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
    </div>
  )
}
```

**Step 2: Create PostCard component**

Create `src/components/posts/PostCard.jsx`:
```jsx
import { useState } from 'react'

const PLATFORMS = [
  { id: 'gbp', label: 'Google Business', color: 'blue' },
  { id: 'facebook', label: 'Facebook', color: 'indigo' },
  { id: 'instagram', label: 'Instagram', color: 'pink' },
  { id: 'linkedin', label: 'LinkedIn', color: 'sky' },
]

export default function PostCard({
  title,
  post,
  onRegenerate,
  onMarkAsPosted,
  isRegenerating,
}) {
  const [showOtherPlatforms, setShowOtherPlatforms] = useState(false)
  const [regeneratePrompt, setRegeneratePrompt] = useState('')
  const [showRegenerateInput, setShowRegenerateInput] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [showPostModal, setShowPostModal] = useState(false)

  const copyToClipboard = async (text, platform) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add toast notification here
      alert(`Copied ${platform} post to clipboard!`)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleRegenerate = () => {
    if (showRegenerateInput) {
      onRegenerate(regeneratePrompt)
      setRegeneratePrompt('')
      setShowRegenerateInput(false)
    } else {
      setShowRegenerateInput(true)
    }
  }

  const handleMarkAsPosted = () => {
    if (selectedPlatforms.length > 0) {
      onMarkAsPosted(selectedPlatforms)
      setSelectedPlatforms([])
      setShowPostModal(false)
    }
  }

  const togglePlatform = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    )
  }

  if (!post) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-500">Click generate to create a post.</p>
      </div>
    )
  }

  const PlatformContent = ({ platformId, label }) => {
    const content = post[platformId]
    const charCount = content?.length || 0

    return (
      <div className="border-t pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{charCount} chars</span>
            <button
              onClick={() => copyToClipboard(content, label)}
              className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Copy
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-sm whitespace-pre-wrap">{content}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">Topic: {post.topic}</p>
        </div>
      </div>

      {/* GBP (Primary) */}
      <PlatformContent platformId="gbp" label="Google Business Profile" />

      {/* Other Platforms Toggle */}
      <button
        onClick={() => setShowOtherPlatforms(!showOtherPlatforms)}
        className="mt-4 text-sm text-blue-600 hover:text-blue-800"
      >
        {showOtherPlatforms ? 'Hide other platforms' : 'Show other platforms'}
      </button>

      {showOtherPlatforms && (
        <div className="mt-4 space-y-4">
          <PlatformContent platformId="facebook" label="Facebook" />
          <PlatformContent platformId="instagram" label="Instagram" />
          <PlatformContent platformId="linkedin" label="LinkedIn" />
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
        {showRegenerateInput ? (
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={regeneratePrompt}
              onChange={(e) => setRegeneratePrompt(e.target.value)}
              placeholder="e.g., focus on nail services instead"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isRegenerating ? 'Regenerating...' : 'Go'}
            </button>
            <button
              onClick={() => setShowRegenerateInput(false)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 disabled:opacity-50"
            >
              Regenerate
            </button>
            <button
              onClick={() => setShowPostModal(true)}
              className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            >
              Mark as Posted
            </button>
          </>
        )}
      </div>

      {/* Mark as Posted Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h4 className="font-semibold text-gray-800 mb-4">
              Select platforms where this was posted:
            </h4>
            <div className="space-y-2">
              {PLATFORMS.map((platform) => (
                <label
                  key={platform.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={() => togglePlatform(platform.id)}
                    className="rounded"
                  />
                  <span>{platform.label}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={handleMarkAsPosted}
                disabled={selectedPlatforms.length === 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowPostModal(false)
                  setSelectedPlatforms([])
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

**Step 3: Create Generator page**

Create `src/pages/Generator.jsx`:
```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import ClientSelector from '../components/clients/ClientSelector'
import PostCard from '../components/posts/PostCard'
import { storage } from '../services/storage'
import { claude } from '../services/ai/ClaudeService'

const LIFESTYLE_CATEGORIES = [
  { id: 'surprise', label: 'Surprise Me' },
  { id: 'recipe', label: 'Recipe' },
  { id: 'book', label: 'Book Recommendation' },
  { id: 'motivational', label: 'Motivational Quote' },
  { id: 'seasonal', label: 'Seasonal Tip' },
  { id: 'local', label: 'Local Event Idea' },
]

export default function Generator() {
  const [clients, setClients] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Service post state
  const [servicePost, setServicePost] = useState(null)
  const [serviceFocus, setServiceFocus] = useState('')
  const [isGeneratingService, setIsGeneratingService] = useState(false)

  // Lifestyle post state
  const [lifestylePost, setLifestylePost] = useState(null)
  const [lifestyleCategory, setLifestyleCategory] = useState('surprise')
  const [isGeneratingLifestyle, setIsGeneratingLifestyle] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedClientId) {
      const client = clients.find((c) => c.id === selectedClientId)
      setSelectedClient(client || null)
      // Reset posts when client changes
      setServicePost(null)
      setLifestylePost(null)
    } else {
      setSelectedClient(null)
    }
  }, [selectedClientId, clients])

  const loadData = async () => {
    try {
      const [clientsData, settings] = await Promise.all([
        storage.getClients(),
        storage.getSettings(),
      ])

      setClients(clientsData)

      if (settings.apiKey) {
        claude.initialize(settings.apiKey)
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const getRecentTopics = async (clientId) => {
    const posts = await storage.getPosts(clientId, 15)
    return posts.map((p) => p.topic)
  }

  const handleGenerateService = async () => {
    if (!selectedClient) return
    if (!claude.isInitialized()) {
      setError('Please add your Claude API key in Settings first.')
      return
    }

    setIsGeneratingService(true)
    setError(null)

    try {
      const recentTopics = await getRecentTopics(selectedClient.id)
      const result = await claude.generateServicePost(
        selectedClient,
        serviceFocus || null,
        recentTopics
      )
      setServicePost(result)
    } catch (err) {
      setError(err.message || 'Failed to generate post')
    } finally {
      setIsGeneratingService(false)
    }
  }

  const handleGenerateLifestyle = async () => {
    if (!selectedClient) return
    if (!claude.isInitialized()) {
      setError('Please add your Claude API key in Settings first.')
      return
    }

    setIsGeneratingLifestyle(true)
    setError(null)

    try {
      const recentTopics = await getRecentTopics(selectedClient.id)
      const result = await claude.generateLifestylePost(
        selectedClient,
        lifestyleCategory,
        recentTopics
      )
      setLifestylePost(result)
    } catch (err) {
      setError(err.message || 'Failed to generate post')
    } finally {
      setIsGeneratingLifestyle(false)
    }
  }

  const handleRegenerateService = async (prompt) => {
    if (!selectedClient || !servicePost) return

    setIsGeneratingService(true)
    setError(null)

    try {
      const result = await claude.regeneratePost(
        selectedClient,
        servicePost.topic,
        prompt || 'Generate a fresh variation'
      )
      setServicePost(result)
    } catch (err) {
      setError(err.message || 'Failed to regenerate post')
    } finally {
      setIsGeneratingService(false)
    }
  }

  const handleRegenerateLifestyle = async (prompt) => {
    if (!selectedClient || !lifestylePost) return

    setIsGeneratingLifestyle(true)
    setError(null)

    try {
      const result = await claude.regeneratePost(
        selectedClient,
        lifestylePost.topic,
        prompt || 'Generate a fresh variation'
      )
      setLifestylePost(result)
    } catch (err) {
      setError(err.message || 'Failed to regenerate post')
    } finally {
      setIsGeneratingLifestyle(false)
    }
  }

  const handleMarkAsPosted = async (post, type, platforms) => {
    try {
      await storage.savePost({
        clientId: selectedClient.id,
        type,
        content: {
          gbp: post.gbp,
          facebook: post.facebook,
          instagram: post.instagram,
          linkedin: post.linkedin,
        },
        platformsPosted: platforms,
        topic: post.topic,
      })
      alert('Post saved to history!')
    } catch (err) {
      setError('Failed to save post')
    }
  }

  if (isLoading) {
    return (
      <PageContainer title="Generate Posts">
        <div className="text-gray-600">Loading...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Generate Posts">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {clients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No clients yet.</p>
          <Link to="/clients/new" className="text-blue-600 hover:text-blue-800">
            Add your first client
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <ClientSelector
              clients={clients}
              selectedId={selectedClientId}
              onChange={setSelectedClientId}
            />
          </div>

          {!selectedClient ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">
                Select a client to generate posts.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Service Post Card */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Service-Based Post
                  </h3>
                  <div className="flex gap-2">
                    <select
                      value={serviceFocus}
                      onChange={(e) => setServiceFocus(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Auto-select service</option>
                      {selectedClient.scrapedContent?.services?.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleGenerateService}
                      disabled={isGeneratingService}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isGeneratingService ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>

                <PostCard
                  title="Service Post"
                  post={servicePost}
                  onRegenerate={handleRegenerateService}
                  onMarkAsPosted={(platforms) =>
                    handleMarkAsPosted(servicePost, 'service', platforms)
                  }
                  isRegenerating={isGeneratingService}
                />
              </div>

              {/* Lifestyle Post Card */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Lifestyle Post
                  </h3>
                  <div className="flex gap-2">
                    <select
                      value={lifestyleCategory}
                      onChange={(e) => setLifestyleCategory(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      {LIFESTYLE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleGenerateLifestyle}
                      disabled={isGeneratingLifestyle}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isGeneratingLifestyle ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>

                <PostCard
                  title="Lifestyle Post"
                  post={lifestylePost}
                  onRegenerate={handleRegenerateLifestyle}
                  onMarkAsPosted={(platforms) =>
                    handleMarkAsPosted(lifestylePost, 'lifestyle', platforms)
                  }
                  isRegenerating={isGeneratingLifestyle}
                />
              </div>
            </div>
          )}
        </>
      )}
    </PageContainer>
  )
}
```

**Step 4: Update App.jsx**

Add import and update route in `src/App.jsx`:
```jsx
import Generator from './pages/Generator'

// Update route:
<Route
  path="/generate"
  element={
    <ProtectedRoute>
      <Generator />
    </ProtectedRoute>
  }
/>
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add Post Generator page with service and lifestyle posts"
```

---

## Phase 5: History & Settings

### Task 15: Build History Page

**Files:**
- Create: `src/pages/History.jsx`
- Create: `src/hooks/usePosts.js`
- Modify: `src/App.jsx`

**Step 1: Create usePosts hook**

Create `src/hooks/usePosts.js`:
```jsx
import { useState, useEffect, useCallback } from 'react'
import { storage } from '../services/storage'

export function usePosts(clientId = null) {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await storage.getPosts(clientId)
      setPosts(data)
      setError(null)
    } catch (err) {
      setError('Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  return {
    posts,
    isLoading,
    error,
    refresh: loadPosts,
  }
}
```

**Step 2: Create History page**

Create `src/pages/History.jsx`:
```jsx
import { useState, useEffect } from 'react'
import PageContainer from '../components/layout/PageContainer'
import ClientSelector from '../components/clients/ClientSelector'
import { useClients } from '../hooks/useClients'
import { storage } from '../services/storage'

const PLATFORM_LABELS = {
  gbp: 'GBP',
  facebook: 'FB',
  instagram: 'IG',
  linkedin: 'LI',
}

export default function History() {
  const { clients, isLoading: clientsLoading } = useClients()
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedPost, setExpandedPost] = useState(null)

  useEffect(() => {
    loadPosts()
  }, [selectedClientId])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const data = await storage.getPosts(selectedClientId || null)
      setPosts(data)
    } catch (err) {
      console.error('Failed to load posts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId)
    return client?.name || 'Unknown Client'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <PageContainer title="Post History">
      <div className="mb-6 flex items-center gap-4">
        <ClientSelector
          clients={[{ id: '', name: 'All Clients' }, ...clients]}
          selectedId={selectedClientId}
          onChange={(id) => setSelectedClientId(id || null)}
        />
      </div>

      {isLoading || clientsLoading ? (
        <div className="text-gray-600">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No posts yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpandedPost(expandedPost === post.id ? null : post.id)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          post.type === 'service'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {post.type === 'service' ? 'Service' : 'Lifestyle'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {getClientName(post.clientId)}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium">{post.topic}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(post.postedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {post.platformsPosted?.map((platform) => (
                        <span
                          key={platform}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {PLATFORM_LABELS[platform] || platform}
                        </span>
                      ))}
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedPost === post.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {expandedPost === post.id && (
                <div className="border-t px-4 py-4 space-y-4">
                  {Object.entries(post.content || {}).map(([platform, content]) => (
                    <div key={platform}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {platform.toUpperCase()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(content)
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                        {content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
```

**Step 3: Update App.jsx**

Add import and update route:
```jsx
import History from './pages/History'

// Update route:
<Route
  path="/history"
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add History page with post listing"
```

---

### Task 16: Build Settings Page

**Files:**
- Create: `src/pages/Settings.jsx`
- Create: `src/hooks/useSettings.js`
- Modify: `src/App.jsx`

**Step 1: Create useSettings hook**

Create `src/hooks/useSettings.js`:
```jsx
import { useState, useEffect, useCallback } from 'react'
import { storage } from '../services/storage'

export function useSettings() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await storage.getSettings()
      setSettings(data)
      setError(null)
    } catch (err) {
      setError('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const updateSettings = async (updates) => {
    try {
      const updated = await storage.saveSettings(updates)
      setSettings(updated)
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Failed to save settings' }
    }
  }

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refresh: loadSettings,
  }
}
```

**Step 2: Create Settings page**

Create `src/pages/Settings.jsx`:
```jsx
import { useState, useRef } from 'react'
import PageContainer from '../components/layout/PageContainer'
import { useSettings } from '../hooks/useSettings'
import { useAuth } from '../contexts/AuthContext'
import { storage } from '../services/storage'
import { claude } from '../services/ai/ClaudeService'

export default function Settings() {
  const { settings, isLoading, updateSettings } = useSettings()
  const { changePassword } = useAuth()
  const fileInputRef = useRef(null)

  const [apiKey, setApiKey] = useState('')
  const [isTestingApi, setIsTestingApi] = useState(false)
  const [apiStatus, setApiStatus] = useState(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState(null)

  const [importMessage, setImportMessage] = useState(null)

  // Initialize apiKey from settings when loaded
  useState(() => {
    if (settings?.apiKey) {
      setApiKey(settings.apiKey)
    }
  }, [settings])

  const handleSaveApiKey = async () => {
    const result = await updateSettings({ apiKey })
    if (result.success) {
      claude.initialize(apiKey)
      setApiStatus({ type: 'success', message: 'API key saved!' })
    } else {
      setApiStatus({ type: 'error', message: result.error })
    }
  }

  const handleTestApi = async () => {
    if (!apiKey) {
      setApiStatus({ type: 'error', message: 'Please enter an API key first.' })
      return
    }

    setIsTestingApi(true)
    setApiStatus(null)

    try {
      claude.initialize(apiKey)
      // Simple test - just try to make a minimal request
      await claude._sendMessage('Say "API working" in exactly two words.')
      setApiStatus({ type: 'success', message: 'API connection successful!' })
    } catch (err) {
      setApiStatus({ type: 'error', message: err.message })
    } finally {
      setIsTestingApi(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMessage(null)

    const result = await changePassword(currentPassword, newPassword)

    if (result.success) {
      setPasswordMessage({ type: 'success', message: 'Password changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
    } else {
      setPasswordMessage({ type: 'error', message: result.error })
    }
  }

  const handleExport = async () => {
    try {
      const data = await storage.exportAll()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `content-curator-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to export data')
    }
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

  if (isLoading) {
    return (
      <PageContainer title="Settings">
        <div className="text-gray-600">Loading...</div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Settings">
      <div className="max-w-2xl space-y-6">
        {/* API Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            API Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Claude API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Key
              </button>
              <button
                onClick={handleTestApi}
                disabled={isTestingApi}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                {isTestingApi ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            {apiStatus && (
              <div
                className={`p-3 rounded ${
                  apiStatus.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {apiStatus.message}
              </div>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Change App Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Change Password
            </button>
            {passwordMessage && (
              <div
                className={`p-3 rounded ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {passwordMessage.message}
              </div>
            )}
          </form>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Data Management
          </h2>
          <div className="space-y-4">
            <div>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Export All Data
              </button>
              <p className="mt-1 text-sm text-gray-500">
                Download a backup of all clients and posts.
              </p>
            </div>
            <div>
              <label className="block">
                <span className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 cursor-pointer inline-block">
                  Import Data
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Restore from a backup file. This will replace existing data.
              </p>
            </div>
            {importMessage && (
              <div
                className={`p-3 rounded ${
                  importMessage.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {importMessage.message}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Version:</strong> 1.0.0
            </p>
            <p>
              <strong>Storage:</strong> Local Storage (browser only)
            </p>
            <p className="text-yellow-600">
              Data is stored in this browser only. Use Export to backup your
              data.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
```

**Step 3: Update App.jsx**

Add import and update route:
```jsx
import Settings from './pages/Settings'

// Update route:
<Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Settings page with API key, password, and data management"
```

---

## Phase 6: Polish & Deploy

### Task 17: Create Toast Notification System

**Files:**
- Create: `src/components/shared/Toast.jsx`
- Create: `src/contexts/ToastContext.jsx`
- Modify: `src/main.jsx`

**Step 1: Create Toast component**

Create `src/components/shared/Toast.jsx`:
```jsx
export default function Toast({ message, type = 'info', onClose }) {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type]

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px]`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
```

**Step 2: Create ToastContext**

Create `src/contexts/ToastContext.jsx`:
```jsx
import { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/shared/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    info: (message) => addToast(message, 'info'),
    warning: (message) => addToast(message, 'warning'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
```

**Step 3: Add ToastProvider to main.jsx**

Update `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Toast notification system"
```

---

### Task 18: Final Cleanup and Complete App.jsx

**Files:**
- Modify: `src/App.jsx`

**Step 1: Complete final App.jsx**

Replace `src/App.jsx`:
```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientSetup from './pages/ClientSetup'
import Generator from './pages/Generator'
import History from './pages/History'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/new"
        element={
          <ProtectedRoute>
            <ClientSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute>
            <ClientSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <Generator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
```

**Step 2: Commit**

```bash
git add .
git commit -m "chore: finalize App.jsx with all routes"
```

---

### Task 19: Add Vite Config for Deployment

**Files:**
- Modify: `vite.config.js`
- Create: `vercel.json`

**Step 1: Update Vite config**

Replace `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

**Step 2: Create Vercel config for SPA routing**

Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Step 3: Update .gitignore**

Append to `.gitignore`:
```
# Dependencies
node_modules

# Build output
dist

# Environment
.env
.env.local

# IDE
.idea
.vscode

# OS
.DS_Store
Thumbs.db

# Temp files
tmpclaude-*
```

**Step 4: Commit**

```bash
git add .
git commit -m "chore: add deployment configuration"
```

---

### Task 20: Build and Test Production Build

**Step 1: Run production build**

```bash
cd /c/Users/alhar/Projects/content-curator
npm run build
```

Expected: Build completes without errors, creates `dist/` folder

**Step 2: Preview production build**

```bash
npm run preview
```

Expected: Opens preview at http://localhost:4173

**Step 3: Test all functionality**

1. Login with new password
2. Add API key in Settings
3. Create a client with website analysis
4. Generate service and lifestyle posts
5. Mark posts as posted
6. View history
7. Export data
8. Logout and login again

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: verify production build"
git push
```

---

### Task 21: Deploy to Vercel

**Step 1: Install Vercel CLI (if not installed)**

```bash
npm install -g vercel
```

**Step 2: Deploy**

```bash
cd /c/Users/alhar/Projects/content-curator
vercel
```

Follow prompts:
- Set up and deploy? Yes
- Which scope? Select your account
- Link to existing project? No
- Project name? content-curator
- Directory with code? ./
- Override settings? No

**Step 3: Get production URL**

After deployment, Vercel will provide a URL like `content-curator-xxx.vercel.app`

**Step 4: Test deployed app**

Open the Vercel URL and verify everything works.

**Step 5: Final commit with deployment info**

```bash
git add .
git commit -m "docs: add deployment to Vercel"
git push
```

---

## Summary

This plan builds Content Curator in 21 tasks across 6 phases:

1. **Phase 1 (Tasks 1-3):** Project setup with Vite, React, Tailwind, React Router
2. **Phase 2 (Tasks 4-8):** Core infrastructure - storage service, auth, layout
3. **Phase 3 (Tasks 9-13):** Client management with website analysis
4. **Phase 4 (Task 14):** Post generation with Claude API
5. **Phase 5 (Tasks 15-16):** History and Settings pages
6. **Phase 6 (Tasks 17-21):** Polish, toast notifications, deployment

Each task is self-contained with explicit file paths, code, and commands.
