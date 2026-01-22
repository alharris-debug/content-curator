import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

class SalesService {
  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  }

  // ============ SCRIPT OVERRIDES ============
  // Scripts are stored in salesData.js by default
  // Overrides are stored in DB and merged at runtime

  async getScriptOverride(scriptId) {
    const { data, error } = await this.supabase
      .from('sales_scripts')
      .select('*')
      .eq('id', scriptId)
      .single()

    if (error) return null
    return data
  }

  async getAllScriptOverrides() {
    const { data, error } = await this.supabase
      .from('sales_scripts')
      .select('*')

    if (error) return {}
    // Return as a map: { scriptId: content }
    return data.reduce((acc, row) => {
      acc[row.id] = row.content
      return acc
    }, {})
  }

  async saveScriptOverride(scriptId, content) {
    const { data, error } = await this.supabase
      .from('sales_scripts')
      .upsert({
        id: scriptId,
        content,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteScriptOverride(scriptId) {
    const { error } = await this.supabase
      .from('sales_scripts')
      .delete()
      .eq('id', scriptId)

    if (error) throw error
  }

  // ============ PROSPECTS ============

  async getProspects(filters = {}) {
    let query = this.supabase
      .from('sales_prospects')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.source) {
      query = query.eq('source', filters.source)
    }
    if (filters.industry) {
      query = query.eq('industry', filters.industry)
    }

    const { data, error } = await query
    if (error) throw error
    return data.map(this._mapProspectFromDb)
  }

  async getProspect(id) {
    const { data, error } = await this.supabase
      .from('sales_prospects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return this._mapProspectFromDb(data)
  }

  async addProspect(prospect) {
    const dbProspect = {
      source: prospect.source,
      source_url: prospect.sourceUrl,
      business_name: prospect.businessName,
      website: prospect.website,
      industry: prospect.industry,
      location: prospect.location,
      score: prospect.score,
      status: prospect.status || 'found',
      notes: prospect.notes,
    }

    const { data, error } = await this.supabase
      .from('sales_prospects')
      .insert(dbProspect)
      .select()
      .single()

    if (error) throw error
    return this._mapProspectFromDb(data)
  }

  async updateProspect(id, updates) {
    const dbUpdates = {
      updated_at: new Date().toISOString(),
    }

    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.score !== undefined) dbUpdates.score = updates.score
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes
    if (updates.businessName !== undefined) dbUpdates.business_name = updates.businessName
    if (updates.website !== undefined) dbUpdates.website = updates.website
    if (updates.industry !== undefined) dbUpdates.industry = updates.industry
    if (updates.location !== undefined) dbUpdates.location = updates.location

    const { data, error } = await this.supabase
      .from('sales_prospects')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this._mapProspectFromDb(data)
  }

  async deleteProspect(id) {
    const { error } = await this.supabase
      .from('sales_prospects')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // ============ CONVERSATION FLOWS ============

  async getFlows() {
    const { data, error } = await this.supabase
      .from('sales_flows')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this._mapFlowFromDb)
  }

  async getFlow(id) {
    const { data, error } = await this.supabase
      .from('sales_flows')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return this._mapFlowFromDb(data)
  }

  async saveFlow(flow) {
    const dbFlow = {
      name: flow.name,
      segment: flow.segment,
      steps: flow.steps,
      updated_at: new Date().toISOString(),
    }

    if (flow.id) {
      const { data, error } = await this.supabase
        .from('sales_flows')
        .update(dbFlow)
        .eq('id', flow.id)
        .select()
        .single()

      if (error) throw error
      return this._mapFlowFromDb(data)
    } else {
      const { data, error } = await this.supabase
        .from('sales_flows')
        .insert(dbFlow)
        .select()
        .single()

      if (error) throw error
      return this._mapFlowFromDb(data)
    }
  }

  async deleteFlow(id) {
    const { error } = await this.supabase
      .from('sales_flows')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // ============ MAPPERS ============

  _mapProspectFromDb(row) {
    return {
      id: row.id,
      source: row.source,
      sourceUrl: row.source_url,
      businessName: row.business_name,
      website: row.website,
      industry: row.industry,
      location: row.location,
      score: row.score,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  _mapFlowFromDb(row) {
    return {
      id: row.id,
      name: row.name,
      segment: row.segment,
      steps: row.steps,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }
}

export const salesService = new SalesService()
