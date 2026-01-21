export const TIERS = {
  starter: {
    name: 'Starter',
    clients: 1,
    generations: 30,
    monthlyPrice: 15,
    yearlyPrice: 144,
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_STARTER_MONTHLY,
    stripePriceIdYearly: import.meta.env.VITE_STRIPE_PRICE_STARTER_YEARLY,
  },
  pro: {
    name: 'Pro',
    clients: 5,
    generations: 100,
    monthlyPrice: 29,
    yearlyPrice: 279,
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY,
    stripePriceIdYearly: import.meta.env.VITE_STRIPE_PRICE_PRO_YEARLY,
  },
  agency: {
    name: 'Agency',
    clients: 15,
    generations: 300,
    monthlyPrice: 59,
    yearlyPrice: 569,
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_AGENCY_MONTHLY,
    stripePriceIdYearly: import.meta.env.VITE_STRIPE_PRICE_AGENCY_YEARLY,
  },
}

export const getTierLimits = (tier) => {
  return TIERS[tier] || TIERS.starter
}

export const DEFAULT_TIER = 'starter'
