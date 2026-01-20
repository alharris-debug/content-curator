export const TIERS = {
  starter: {
    name: 'Starter',
    clients: 1,
    generations: 30,
    monthlyPrice: 15,
    yearlyPrice: 144,
    stripePriceIdMonthly: null, // Set after creating Stripe products
    stripePriceIdYearly: null,
  },
  pro: {
    name: 'Pro',
    clients: 5,
    generations: 100,
    monthlyPrice: 29,
    yearlyPrice: 279,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
  },
  agency: {
    name: 'Agency',
    clients: 15,
    generations: 300,
    monthlyPrice: 59,
    yearlyPrice: 569,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
  },
}

export const getTierLimits = (tier) => {
  return TIERS[tier] || TIERS.starter
}

export const DEFAULT_TIER = 'starter'
