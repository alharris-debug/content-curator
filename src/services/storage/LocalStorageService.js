import { StorageService } from './StorageService'

const KEYS = {
  CLIENTS: 'content-curator-clients',
  POSTS: 'content-curator-posts',
  SETTINGS: 'content-curator-settings',
}

const DEFAULT_SETTINGS = { apiKey: '', appPassword: '', version: '1.0' }

export class LocalStorageService extends StorageService {
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  _getItem(key, defaultValue = []) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch { return defaultValue }
  }

  _setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  async getClients() {
    return this._getItem(KEYS.CLIENTS, [])
  }

  async getClient(id) {
    const clients = await this.getClients()
    return clients.find(c => c.id === id) || null
  }

  async saveClient(client) {
    const clients = await this.getClients()
    const now = new Date().toISOString()

    if (client.id) {
      const index = clients.findIndex(c => c.id === client.id)
      if (index !== -1) clients[index] = { ...client, updatedAt: now }
    } else {
      client.id = this._generateId()
      client.createdAt = now
      client.updatedAt = now
      clients.push(client)
    }

    this._setItem(KEYS.CLIENTS, clients)
    return client
  }

  async deleteClient(id) {
    const clients = await this.getClients()
    this._setItem(KEYS.CLIENTS, clients.filter(c => c.id !== id))
    const posts = await this.getPosts()
    this._setItem(KEYS.POSTS, posts.filter(p => p.clientId !== id))
  }

  async getPosts(clientId = null, limit = null) {
    let posts = this._getItem(KEYS.POSTS, [])
    if (clientId) posts = posts.filter(p => p.clientId === clientId)
    posts.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
    if (limit) posts = posts.slice(0, limit)
    return posts
  }

  async savePost(post) {
    const posts = this._getItem(KEYS.POSTS, [])
    post.id = this._generateId()
    post.postedAt = new Date().toISOString()
    posts.push(post)
    this._setItem(KEYS.POSTS, posts)
    return post
  }

  async getSettings() {
    return this._getItem(KEYS.SETTINGS, DEFAULT_SETTINGS)
  }

  async saveSettings(settings) {
    const current = await this.getSettings()
    const updated = { ...current, ...settings }
    this._setItem(KEYS.SETTINGS, updated)
    return updated
  }

  async exportAll() {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        clients: await this.getClients(),
        posts: this._getItem(KEYS.POSTS, []),
        settings: { ...(await this.getSettings()), apiKey: '' },
      },
    }
  }

  async importAll(data) {
    if (!data.version || !data.data) throw new Error('Invalid import file format')
    if (data.data.clients) this._setItem(KEYS.CLIENTS, data.data.clients)
    if (data.data.posts) this._setItem(KEYS.POSTS, data.data.posts)
    return true
  }
}
