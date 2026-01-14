/**
 * Storage Service Interface
 * Phase 1: LocalStorageService
 * Phase 2: SupabaseService (future)
 */

export class StorageService {
  async getClients() { throw new Error('Not implemented') }
  async getClient(id) { throw new Error('Not implemented') }
  async saveClient(client) { throw new Error('Not implemented') }
  async deleteClient(id) { throw new Error('Not implemented') }
  async getPosts(clientId, limit) { throw new Error('Not implemented') }
  async savePost(post) { throw new Error('Not implemented') }
  async getSettings() { throw new Error('Not implemented') }
  async saveSettings(settings) { throw new Error('Not implemented') }
  async exportAll() { throw new Error('Not implemented') }
  async importAll(data) { throw new Error('Not implemented') }
}
