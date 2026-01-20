export const TIERS = {
  starter: {
    name: 'Starter',
    clients: 1,
    generations: 30,
    monthlyPrice: 15,
    yearlyPrice: 144,
    stripePriceIdMonthly: 'price_1SrlAW1h7jRjSfp4pt6Hl3oI',
    stripePriceIdYearly: 'price_1SrlC21h7jRjSfp4yt7A5Ibs',
  },
  pro: {
    name: 'Pro',
    clients: 5,
    generations: 100,
    monthlyPrice: 29,
    yearlyPrice: 279,
    stripePriceIdMonthly: 'price_1SrlAn1h7jRjSfp4XLPoExms',
    stripePriceIdYearly: 'price_1SrlBo1h7jRjSfp4EKWfXSrl',
  },
  agency: {
    name: 'Agency',
    clients: 15,
    generations: 300,
    monthlyPrice: 59,
    yearlyPrice: 569,
    stripePriceIdMonthly: 'price_1SrlB81h7jRjSfp4o43oAyLE',
    stripePriceIdYearly: 'price_1SrlBY1h7jRjSfp4TDH0yVOc',
  },
}

export const getTierLimits = (tier) => {
  return TIERS[tier] || TIERS.starter
}

export const DEFAULT_TIER = 'starter'
