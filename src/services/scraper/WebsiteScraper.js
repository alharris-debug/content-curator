const CORS_PROXIES = ['https://api.allorigins.win/raw?url=', 'https://corsproxy.io/?']

class WebsiteScraper {
  async fetchWithProxy(url) {
    for (const proxy of CORS_PROXIES) {
      try {
        const response = await fetch(proxy + encodeURIComponent(url), { headers: { 'Accept': 'text/html' } })
        if (response.ok) return await response.text()
      } catch (error) {
        console.warn(`Proxy ${proxy} failed:`, error.message)
        continue
      }
    }
    throw new Error('Could not fetch website. Please check the URL and try again.')
  }

  extractTextContent(html) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const removeSelectors = ['script', 'style', 'noscript', 'iframe', 'svg', 'header nav', 'footer', '.cookie-banner']
    removeSelectors.forEach(selector => {
      doc.querySelectorAll(selector).forEach(el => el.remove())
    })

    const title = doc.querySelector('title')?.textContent || ''
    const metaDesc = doc.querySelector('meta[name="description"]')?.content || ''

    const contentSelectors = ['main', 'article', '[role="main"]', '.content', '#content', '.main-content']
    let mainContent = ''
    for (const selector of contentSelectors) {
      const el = doc.querySelector(selector)
      if (el) { mainContent = el.textContent; break }
    }
    if (!mainContent) mainContent = doc.body?.textContent || ''

    const headings = Array.from(doc.querySelectorAll('h1, h2, h3'))
      .map(h => h.textContent.trim())
      .filter(h => h.length > 0 && h.length < 100)
      .slice(0, 20)

    const cleanText = (text) => text.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim().slice(0, 8000)

    return { title: cleanText(title), metaDescription: cleanText(metaDesc), headings, content: cleanText(mainContent) }
  }

  async scrape(url) {
    try { new URL(url) } catch { throw new Error('Invalid URL format') }

    const html = await this.fetchWithProxy(url)
    const extracted = this.extractTextContent(html)

    return `
Website URL: ${url}
Title: ${extracted.title}
Meta Description: ${extracted.metaDescription}

Page Headings:
${extracted.headings.map(h => `- ${h}`).join('\n')}

Page Content:
${extracted.content}
    `.trim()
  }
}

export const scraper = new WebsiteScraper()
