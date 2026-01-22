import { createClient } from '@supabase/supabase-js'
import { StorageService } from './StorageService'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export class SupabaseService extends StorageService {
  constructor() {
    super()
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  }

  // Auth helpers
  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }

  async getSession() {
    const { data: { session } } = await this.supabase.auth.getSession()
    return session
  }

  async signUp(email, password) {
    const { data, error } = await this.supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  async signIn(email, password) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async resetPassword(email) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  async updatePassword(newPassword) {
    const { error } = await this.supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  // Client methods
  async getClients() {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this._mapClientFromDb)
  }

  async getClient(id) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return this._mapClientFromDb(data)
  }

  async saveClient(client) {
    const user = await this.getUser()
    if (!user) throw new Error('Not authenticated')

    const dbClient = {
      user_id: user.id,
      name: client.name,
      url: client.url,
      industry: client.industry,
      target_audience: client.targetAudience,
      brand_voice: client.brandVoice,
      scraped_content: client.scrapedContent,
      updated_at: new Date().toISOString(),
    }

    if (client.id) {
      // Update existing
      const { data, error } = await this.supabase
        .from('clients')
        .update(dbClient)
        .eq('id', client.id)
        .select()
        .single()

      if (error) throw error
      return this._mapClientFromDb(data)
    } else {
      // Create new
      const { data, error } = await this.supabase
        .from('clients')
        .insert(dbClient)
        .select()
        .single()

      if (error) throw error
      return this._mapClientFromDb(data)
    }
  }

  async deleteClient(id) {
    // Posts will be cascade deleted due to foreign key
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Post methods
  async getPosts(clientId = null, limit = null) {
    let query = this.supabase
      .from('posts')
      .select('*')
      .order('posted_at', { ascending: false })

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data.map(this._mapPostFromDb)
  }

  async savePost(post) {
    const user = await this.getUser()
    if (!user) throw new Error('Not authenticated')

    const dbPost = {
      user_id: user.id,
      client_id: post.clientId,
      type: post.type,
      content: post.content,
      platforms_posted: post.platformsPosted,
      topic: post.topic,
      posted_at: new Date().toISOString(),
    }

    const { data, error } = await this.supabase
      .from('posts')
      .insert(dbPost)
      .select()
      .single()

    if (error) throw error
    return this._mapPostFromDb(data)
  }

  // Settings methods
  async getSettings() {
    const user = await this.getUser()
    if (!user) return { apiKey: '', version: '1.0' }

    const { data, error } = await this.supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return { apiKey: '', version: '1.0' }
    }

    return {
      apiKey: data.api_key || '',
      version: '1.0',
    }
  }

  async saveSettings(settings) {
    const user = await this.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await this.supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        api_key: settings.apiKey,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return { apiKey: data.api_key || '', version: '1.0' }
  }

  // Subscription methods
  async getSubscription() {
    const user = await this.getUser()
    if (!user) return null

    const { data, error } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error || !data) return null
    return {
      id: data.id,
      tier: data.tier,
      status: data.status,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      currentPeriodStart: data.current_period_start,
      currentPeriodEnd: data.current_period_end,
    }
  }

  async createSubscription(tier = 'starter') {
    const user = await this.getUser()
    if (!user) throw new Error('Not authenticated')

    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const { data, error } = await this.supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        tier,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Usage methods
  async getCurrentUsage() {
    const user = await this.getUser()
    if (!user) return null

    const sub = await this.getSubscription()
    if (!sub) return null

    const { data, error } = await this.supabase
      .from('usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('period_start', sub.currentPeriodStart)
      .single()

    if (error || !data) {
      // No usage record for this period yet, return zeros
      return {
        generationsUsed: 0,
        periodStart: sub.currentPeriodStart,
        periodEnd: sub.currentPeriodEnd,
      }
    }

    return {
      id: data.id,
      generationsUsed: data.generations_used,
      periodStart: data.period_start,
      periodEnd: data.period_end,
    }
  }

  async incrementUsage() {
    const user = await this.getUser()
    if (!user) throw new Error('Not authenticated')

    const sub = await this.getSubscription()
    if (!sub) throw new Error('No subscription found')

    // Try to update existing usage record
    const { data: existing } = await this.supabase
      .from('usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('period_start', sub.currentPeriodStart)
      .single()

    if (existing) {
      const { error } = await this.supabase
        .from('usage')
        .update({
          generations_used: existing.generations_used + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) throw error
    } else {
      // Create new usage record for this period
      const { error } = await this.supabase
        .from('usage')
        .insert({
          user_id: user.id,
          period_start: sub.currentPeriodStart,
          period_end: sub.currentPeriodEnd,
          generations_used: 1,
        })

      if (error) throw error
    }
  }

  // Export/Import
  async exportAll() {
    const [clients, posts, settings] = await Promise.all([
      this.getClients(),
      this.getPosts(),
      this.getSettings(),
    ])

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        clients,
        posts,
        settings: { ...settings, apiKey: '' }, // Don't export API key
      },
    }
  }

  async importAll(data) {
    if (!data.version || !data.data) {
      throw new Error('Invalid import file format')
    }

    const user = await this.getUser()
    if (!user) throw new Error('Not authenticated')

    // Import clients
    if (data.data.clients?.length > 0) {
      for (const client of data.data.clients) {
        await this.saveClient({
          name: client.name,
          url: client.url,
          industry: client.industry,
          targetAudience: client.targetAudience,
          brandVoice: client.brandVoice,
          scrapedContent: client.scrapedContent,
        })
      }
    }

    return true
  }

  // Mappers (DB snake_case -> JS camelCase)
  _mapClientFromDb(row) {
    return {
      id: row.id,
      name: row.name,
      url: row.url,
      industry: row.industry,
      targetAudience: row.target_audience,
      brandVoice: row.brand_voice,
      scrapedContent: row.scraped_content,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  _mapPostFromDb(row) {
    return {
      id: row.id,
      clientId: row.client_id,
      type: row.type,
      content: row.content,
      platformsPosted: row.platforms_posted,
      topic: row.topic,
      postedAt: row.posted_at,
    }
  }
}
