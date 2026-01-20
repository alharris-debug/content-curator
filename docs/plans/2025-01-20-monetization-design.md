# Content Curator Monetization Design

## Overview

Transform the current free multi-user app into a paid SaaS with usage-based tiers and Stripe billing.

## Pricing Tiers

| Tier | Monthly | Annual (20% off) | Clients | Generations/mo |
|------|---------|------------------|---------|----------------|
| Starter | $15 | $144 | 1 | 30 |
| Pro | $29 | $279 | 5 | 100 |
| Agency | $59 | $569 | 15 | 300 |

**What counts as a "generation":**
- Generating a service post (1 generation)
- Generating a lifestyle post (1 generation)
- Analyzing a website (1 generation)

## Key Changes

1. Built-in Claude API key (users no longer enter their own)
2. Usage tracking (clients count, generations per billing cycle)
3. Hard limits enforced (blocked when over limit)
4. Stripe Checkout for subscriptions
5. Settings page shows current plan and usage
6. Generation counter resets monthly on billing cycle

**No free trial for now** - placeholder for future. Beta testers get Stripe coupon codes (100% off).

---

## Database Schema Changes

### New table: `subscriptions`

```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  tier TEXT CHECK (tier IN ('starter', 'pro', 'agency')) NOT NULL DEFAULT 'starter',
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
```

### New table: `usage`

```sql
CREATE TABLE usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  generations_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period_start)
);

-- RLS
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own usage" ON usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON usage FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage" ON usage FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Tier limits (app constants, not in DB)

```javascript
export const TIER_LIMITS = {
  starter: { clients: 1, generations: 30, monthlyPrice: 15, yearlyPrice: 144 },
  pro: { clients: 5, generations: 100, monthlyPrice: 29, yearlyPrice: 279 },
  agency: { clients: 15, generations: 300, monthlyPrice: 59, yearlyPrice: 569 },
}
```

---

## Stripe Integration

### Products to create in Stripe Dashboard:
- **Content Curator Starter** - $15/mo, $144/yr
- **Content Curator Pro** - $29/mo, $279/yr
- **Content Curator Agency** - $59/mo, $569/yr

### Environment variables needed:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx (server-side only, for webhooks)
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Flow:

1. **New user signs up** → Redirected to pricing page
2. **User selects tier** → Stripe Checkout session created
3. **Payment succeeds** → Stripe webhook fires
4. **Webhook handler** → Creates/updates `subscriptions` row
5. **User redirected back** → App checks subscription, grants access

### Webhook events to handle:
- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Plan change, renewal
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_failed` - Mark as past_due

### Webhook endpoint:
Need a serverless function (Vercel API route or Supabase Edge Function) to handle webhooks since we can't expose Stripe secret key to frontend.

**Recommended:** Supabase Edge Function at `/functions/v1/stripe-webhook`

---

## Application Changes

### 1. Remove user API key input

**Files affected:**
- `src/pages/Settings.jsx` - Remove API key section
- `src/services/ai/ClaudeService.js` - Use env var instead of stored key

**New env var:**
```
VITE_CLAUDE_API_KEY=sk-ant-xxx
```

Note: This exposes the key in frontend bundle. For production, move AI calls to a Supabase Edge Function.

### 2. Add usage tracking

**SupabaseService.js additions:**
```javascript
async getSubscription() {
  const user = await this.getUser()
  if (!user) return null
  const { data } = await this.supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()
  return data
}

async getCurrentUsage() {
  const user = await this.getUser()
  if (!user) return null
  const now = new Date()
  const { data } = await this.supabase
    .from('usage')
    .select('*')
    .eq('user_id', user.id)
    .lte('period_start', now.toISOString())
    .gte('period_end', now.toISOString())
    .single()
  return data
}

async incrementUsage() {
  // Increment generations_used by 1 for current period
}
```

### 3. Enforce limits

**Before generating (Generator.jsx, ClientSetup.jsx):**
```javascript
const canGenerate = async () => {
  const sub = await storage.getSubscription()
  const usage = await storage.getCurrentUsage()
  const limit = TIER_LIMITS[sub.tier].generations
  return usage.generations_used < limit
}

const canAddClient = async () => {
  const sub = await storage.getSubscription()
  const clients = await storage.getClients()
  const limit = TIER_LIMITS[sub.tier].clients
  return clients.length < limit
}
```

### 4. New UI components

**PricingPage.jsx** - Shown after signup if no subscription
- Three tier cards with features
- Monthly/annual toggle
- "Subscribe" button → Stripe Checkout

**UsageDisplay.jsx** - Shown in Settings and/or Dashboard
- Current plan name
- Generations: 45/100 used (progress bar)
- Clients: 3/5 used
- Billing cycle: Resets Jan 25
- "Upgrade" / "Manage subscription" buttons

**UpgradePrompt.jsx** - Modal shown when hitting limits
- "You've reached your limit"
- Show next tier benefits
- CTA to upgrade

### 5. Settings page updates

Replace API key section with:
- Current plan display
- Usage stats
- "Manage Subscription" → Stripe Customer Portal
- "Upgrade Plan" → Pricing page

---

## Implementation Phases

### Phase 1: Database & Usage Tracking
- Create `subscriptions` and `usage` tables
- Add SupabaseService methods for subscriptions/usage
- Manually insert test subscription rows for beta testers

### Phase 2: Limit Enforcement
- Add tier constants
- Check limits before generating/adding clients
- Show usage in Settings page
- Block actions with upgrade prompt when over limit

### Phase 3: Stripe Integration
- Create Stripe products and prices
- Build pricing page UI
- Implement Stripe Checkout flow
- Create Supabase Edge Function for webhooks
- Handle subscription lifecycle events

### Phase 4: Polish
- Add Stripe Customer Portal for self-service
- Usage reset on billing cycle
- Email notifications (approaching limit, payment failed)
- Annual billing option

### Phase 5: Built-in API Key (Security Hardening)
- Move Claude API calls to Supabase Edge Function
- Remove API key from frontend entirely
- Rate limiting on edge function

---

## Beta Tester Setup

Until Stripe is wired up:
1. Manually insert rows in `subscriptions` table via Supabase dashboard
2. Set `tier` to 'agency' and `status` to 'active'
3. Set `current_period_end` to a date far in future

Once Stripe is live:
1. Create 100% off coupon in Stripe dashboard
2. Share coupon code with beta testers
3. They go through normal checkout flow but pay $0

---

## Security Considerations

1. **Stripe webhook verification** - Always verify webhook signatures
2. **API key protection** - Move to edge function before public launch
3. **RLS on all tables** - Users can only see their own data
4. **Rate limiting** - Prevent abuse even within limits
5. **Subscription validation** - Check server-side, not just frontend

---

## Future Enhancements (Parking Lot)

- Free trial (7 days or X generations)
- Team seats / multi-user per account
- Usage analytics dashboard
- Overage pricing (pay per extra generation)
- Enterprise tier with custom limits
- Referral program
