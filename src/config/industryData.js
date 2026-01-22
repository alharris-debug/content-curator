// Industry Configuration for Lead Generation
// These are curated industries that are good targets for Content Curator

export const industries = [
  {
    id: 'realtors',
    name: 'Real Estate',
    displayName: 'Realtors & Real Estate Agents',
    yelpCategory: 'realestate',
    keywords: ['realtor', 'real estate', 'property', 'homes for sale'],
    pain_points: [
      'Need consistent visibility in competitive market',
      'Juggling multiple listings and client communications',
      'Seasonal business requires year-round presence'
    ],
    pitch_angle: 'Stay top of mind with prospects between listings',
    avgDealValue: 'High',
    socialImportance: 'Very High',
    flag: null
  },
  {
    id: 'dentists',
    name: 'Dental',
    displayName: 'Dentists & Dental Practices',
    yelpCategory: 'dentists',
    keywords: ['dentist', 'dental', 'orthodontist', 'teeth'],
    pain_points: [
      'Patient acquisition in competitive local market',
      'Building trust before first appointment',
      'Educational content takes time to create'
    ],
    pitch_angle: 'Build trust and educate patients without the time investment',
    avgDealValue: 'Medium-High',
    socialImportance: 'High',
    flag: null
  },
  {
    id: 'chiropractors',
    name: 'Chiropractic',
    displayName: 'Chiropractors',
    yelpCategory: 'chiropractors',
    keywords: ['chiropractor', 'chiropractic', 'spine', 'adjustment'],
    pain_points: [
      'Explaining value to skeptical prospects',
      'Building recurring patient relationships',
      'Standing out from other practitioners'
    ],
    pitch_angle: 'Educate and build credibility with consistent content',
    avgDealValue: 'Medium',
    socialImportance: 'High',
    flag: null
  },
  {
    id: 'salons',
    name: 'Beauty & Hair',
    displayName: 'Hair Salons & Beauty',
    yelpCategory: 'hair',
    keywords: ['salon', 'hair', 'beauty', 'stylist', 'barber'],
    pain_points: [
      'Visual business needs constant fresh content',
      'Keeping chairs filled during slow days',
      'Showcasing work without being salesy'
    ],
    pitch_angle: 'Keep your books full with content that showcases your artistry',
    avgDealValue: 'Medium',
    socialImportance: 'Very High',
    flag: null
  },
  {
    id: 'fitness',
    name: 'Fitness',
    displayName: 'Gyms & Personal Trainers',
    yelpCategory: 'fitness',
    keywords: ['gym', 'fitness', 'personal trainer', 'workout'],
    pain_points: [
      'High competition for attention',
      'Motivation content is time-consuming',
      'Seasonal fluctuations (New Year, summer)'
    ],
    pitch_angle: 'Keep members engaged and attract new clients year-round',
    avgDealValue: 'Medium',
    socialImportance: 'Very High',
    flag: null
  },
  {
    id: 'restaurants',
    name: 'Food & Dining',
    displayName: 'Restaurants & Cafes',
    yelpCategory: 'restaurants',
    keywords: ['restaurant', 'cafe', 'food', 'dining'],
    pain_points: [
      'Need to drive foot traffic consistently',
      'Specials and events require regular promotion',
      'Visual content is essential but time-consuming'
    ],
    pitch_angle: 'Fill seats with content that makes mouths water',
    avgDealValue: 'Medium',
    socialImportance: 'Very High',
    flag: null
  },
  {
    id: 'contractors',
    name: 'Home Services',
    displayName: 'Contractors & Home Services',
    yelpCategory: 'contractors',
    keywords: ['contractor', 'plumber', 'electrician', 'HVAC', 'handyman'],
    pain_points: [
      'Referrals are great but inconsistent',
      'Hard to showcase work without being on site',
      'Seasonal demand requires off-season marketing'
    ],
    pitch_angle: 'Build the online presence that generates referrals on autopilot',
    avgDealValue: 'High',
    socialImportance: 'Medium-High',
    flag: null
  },
  {
    id: 'auto',
    name: 'Automotive',
    displayName: 'Auto Shops & Dealers',
    yelpCategory: 'autorepair',
    keywords: ['auto', 'car', 'mechanic', 'dealership'],
    pain_points: [
      'Building trust in historically distrusted industry',
      'Explaining services without being technical',
      'Competing with chains and dealerships'
    ],
    pitch_angle: 'Build trust and stand out from the competition',
    avgDealValue: 'Medium-High',
    socialImportance: 'Medium',
    flag: 'potential-conflict' // Flagged: Could be employer conflict
  },
  {
    id: 'lawyers',
    name: 'Legal',
    displayName: 'Lawyers & Law Firms',
    yelpCategory: 'lawyers',
    keywords: ['lawyer', 'attorney', 'law firm', 'legal'],
    pain_points: [
      'Strict advertising regulations',
      'Building authority and trust',
      'Differentiating from other firms'
    ],
    pitch_angle: 'Build authority within advertising guidelines',
    avgDealValue: 'Very High',
    socialImportance: 'Medium',
    flag: null
  },
  {
    id: 'accountants',
    name: 'Financial',
    displayName: 'Accountants & CPAs',
    yelpCategory: 'accountants',
    keywords: ['accountant', 'CPA', 'tax', 'bookkeeper'],
    pain_points: [
      'Seasonal business (tax season)',
      'Need to stay top of mind year-round',
      'Explaining value of proactive accounting'
    ],
    pitch_angle: 'Stay visible between tax seasons with valuable content',
    avgDealValue: 'High',
    socialImportance: 'Medium',
    flag: null
  }
]

// Get industry by ID
export const getIndustry = (id) => {
  return industries.find(i => i.id === id)
}

// Get industries without flags (safe to target)
export const getSafeIndustries = () => {
  return industries.filter(i => !i.flag)
}

// Get flagged industries
export const getFlaggedIndustries = () => {
  return industries.filter(i => i.flag)
}

// Industry display helpers
export const industryOptions = industries.map(i => ({
  value: i.id,
  label: i.displayName,
  flag: i.flag
}))
