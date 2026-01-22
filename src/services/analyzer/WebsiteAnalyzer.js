// Website Analyzer Service
// Provides scoring framework for prospect qualification
// Note: Due to CORS, actual website fetching would need a server-side function

class WebsiteAnalyzer {
  // Scoring criteria with weights
  getScoringCriteria() {
    return [
      {
        id: 'has_website',
        label: 'Has a website',
        weight: 10,
        description: 'Business has an active website'
      },
      {
        id: 'website_quality',
        label: 'Website quality',
        weight: 15,
        options: [
          { value: 0, label: 'Poor/Outdated' },
          { value: 5, label: 'Basic' },
          { value: 10, label: 'Modern/Professional' },
          { value: 15, label: 'Excellent' }
        ],
        description: 'Overall website design and functionality'
      },
      {
        id: 'social_presence',
        label: 'Social media presence',
        weight: 20,
        options: [
          { value: 0, label: 'None visible' },
          { value: 5, label: 'Links but inactive' },
          { value: 10, label: 'Active but inconsistent' },
          { value: 15, label: 'Active and consistent' },
          { value: 20, label: 'Very active (competitor)' }
        ],
        description: 'Current social media activity level'
      },
      {
        id: 'content_quality',
        label: 'Existing content quality',
        weight: 15,
        options: [
          { value: 15, label: 'Poor/None - needs help' },
          { value: 10, label: 'Basic - could improve' },
          { value: 5, label: 'Good - might still benefit' },
          { value: 0, label: 'Excellent - may not need us' }
        ],
        description: 'Quality of their current content (lower quality = better prospect)'
      },
      {
        id: 'business_size',
        label: 'Business size indicator',
        weight: 15,
        options: [
          { value: 15, label: 'Solo/1-5 employees - perfect fit' },
          { value: 10, label: 'Small team 5-20' },
          { value: 5, label: 'Medium 20-50' },
          { value: 0, label: 'Large/Enterprise - likely has team' }
        ],
        description: 'Estimated business size'
      },
      {
        id: 'local_business',
        label: 'Local business indicator',
        weight: 10,
        description: 'Business serves local customers (good for our ICP)'
      },
      {
        id: 'clear_brand_voice',
        label: 'Clear brand voice on website',
        weight: 10,
        description: 'Website has distinctive personality/voice we can learn from'
      },
      {
        id: 'contact_info',
        label: 'Contact info easily available',
        weight: 5,
        description: 'Can reach them via website contact, email, or social'
      }
    ]
  }

  // Calculate total score based on criteria responses
  calculateScore(responses) {
    const criteria = this.getScoringCriteria()
    let totalScore = 0
    let maxPossible = 0

    criteria.forEach(criterion => {
      maxPossible += criterion.weight

      if (criterion.options) {
        // Multiple choice - find the selected value
        const value = responses[criterion.id]
        if (value !== undefined) {
          totalScore += value
        }
      } else {
        // Boolean - full weight if checked
        if (responses[criterion.id]) {
          totalScore += criterion.weight
        }
      }
    })

    // Normalize to 0-100 scale
    return Math.round((totalScore / maxPossible) * 100)
  }

  // Get fit tier based on score
  getFitTier(score) {
    if (score >= 70) {
      return {
        tier: 'hot',
        label: 'Hot Lead',
        color: 'green',
        description: 'Excellent fit - prioritize outreach'
      }
    } else if (score >= 50) {
      return {
        tier: 'warm',
        label: 'Warm Lead',
        color: 'yellow',
        description: 'Good potential - worth pursuing'
      }
    } else if (score >= 30) {
      return {
        tier: 'cool',
        label: 'Cool Lead',
        color: 'blue',
        description: 'Some potential - lower priority'
      }
    } else {
      return {
        tier: 'cold',
        label: 'Cold Lead',
        color: 'gray',
        description: 'Poor fit - consider skipping'
      }
    }
  }

  // Extract domain from URL
  extractDomain(url) {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
      return parsed.hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  // Generate social media URLs to check
  getSocialUrlsToCheck(domain) {
    const baseName = domain.split('.')[0]
    return [
      { platform: 'Facebook', url: `https://facebook.com/${baseName}` },
      { platform: 'Instagram', url: `https://instagram.com/${baseName}` },
      { platform: 'Twitter/X', url: `https://twitter.com/${baseName}` },
      { platform: 'LinkedIn', url: `https://linkedin.com/company/${baseName}` },
      { platform: 'TikTok', url: `https://tiktok.com/@${baseName}` }
    ]
  }

  // Generate suggested outreach notes based on analysis
  generateOutreachNotes(domain, score, responses) {
    const notes = []
    const tier = this.getFitTier(score)

    notes.push(`Website: ${domain}`)
    notes.push(`Fit Score: ${score}/100 (${tier.label})`)
    notes.push('')

    // Add observations based on responses
    if (responses.social_presence <= 5) {
      notes.push('- Limited social presence = strong need for content help')
    }
    if (responses.content_quality >= 10) {
      notes.push('- Current content quality is low = good opportunity')
    }
    if (responses.business_size >= 10) {
      notes.push('- Small business size = likely decision maker accessible')
    }
    if (responses.clear_brand_voice) {
      notes.push('- Has clear brand voice = Content Curator can learn their style')
    }

    return notes.join('\n')
  }
}

export const websiteAnalyzer = new WebsiteAnalyzer()
