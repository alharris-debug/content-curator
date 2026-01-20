# Content Curator

AI-powered social media content generator for marketing agencies. Generate platform-specific posts for multiple clients using Claude AI.

## Features

- **Multi-client management**: Create and manage client profiles with brand voice, industry, and website
- **AI content generation**: Generate posts for Google Business Profile, Facebook, Instagram, and LinkedIn
- **Website analysis**: Automatically extract business info from client websites
- **Usage tracking**: Per-subscription generation limits with soft caps
- **Subscription tiers**: Starter, Pro, and Agency plans via Stripe

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Auth & Database**: Supabase
- **AI**: Claude API (Anthropic)
- **Payments**: Stripe
- **Hosting**: Vercel

## Environment Variables

### Local Development (.env)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
VITE_CLAUDE_API_KEY=your-claude-api-key
```

### Vercel (Production)

Same variables as above, configured in Vercel dashboard.

### Supabase Edge Functions

The following secrets must be set for Edge Functions:

- `STRIPE_SECRET_KEY` - Stripe secret key (sk_live_...)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (whsec_...)

## Supabase Setup

### Database Tables

Run these in Supabase SQL Editor:

```sql
-- Clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  brand_voice TEXT,
  target_audience TEXT,
  key_services TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tier TEXT NOT NULL DEFAULT 'starter',
  status TEXT NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage table
CREATE TABLE usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start TIMESTAMPTZ NOT NULL,
  generations_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period_start)
);

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can manage own clients" ON clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own posts" ON posts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own usage" ON usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own usage" ON usage FOR ALL USING (auth.uid() = user_id);
```

### Edge Functions

Two Edge Functions are required:

#### 1. `create-checkout-session`

Creates Stripe checkout sessions for new subscriptions.

```javascript
import Stripe from 'https://esm.sh/stripe@14?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { priceId, customerEmail, successUrl, cancelUrl } = await req.json()

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

#### 2. `stripe-webhook`

Handles Stripe webhook events for subscription lifecycle.

```javascript
import Stripe from 'https://esm.sh/stripe@14?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'), {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
)

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const customerEmail = session.customer_email
    const subscriptionId = session.subscription

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0].price.id

    // Map price ID to tier
    const tierMap = {
      'price_1SrlAW1h7jRjSfp4pt6Hl3oI': 'starter',
      'price_1SrlC21h7jRjSfp4yt7A5Ibs': 'starter',
      'price_1SrlAn1h7jRjSfp4XLPoExms': 'pro',
      'price_1SrlBo1h7jRjSfp4EKWfXSrl': 'pro',
      'price_1SrlB81h7jRjSfp4o43oAyLE': 'agency',
      'price_1SrlBY1h7jRjSfp4TDH0yVOc': 'agency',
    }
    const tier = tierMap[priceId] || 'starter'

    // Find user by email
    const { data: users } = await supabase.auth.admin.listUsers()
    const user = users.users.find(u => u.email === customerEmail)

    if (user) {
      await supabase.from('subscriptions').upsert({
        user_id: user.id,
        tier,
        status: 'active',
        stripe_customer_id: session.customer,
        stripe_subscription_id: subscriptionId,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('stripe_subscription_id', subscription.id)
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

## Stripe Setup

### Products & Prices

Create three products in Stripe Dashboard with monthly and yearly prices:

| Tier | Monthly | Yearly | Clients | Generations/mo |
|------|---------|--------|---------|----------------|
| Starter | $15 | $144 | 1 | 30 |
| Pro | $29 | $279 | 5 | 100 |
| Agency | $59 | $569 | 15 | 300 |

### Webhook

Configure webhook endpoint in Stripe Dashboard:
- URL: `https://your-project.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## Local Development

```bash
npm install
npm run dev
```

## Deployment

Push to GitHub - Vercel auto-deploys from main/master branch.

## Project Structure

```
src/
  components/       # Reusable UI components
  config/
    tiers.js        # Subscription tier configuration
  contexts/
    AuthContext.jsx           # Supabase auth state
    SubscriptionContext.jsx   # Subscription & usage state
  pages/
    Login.jsx       # Auth page
    Pricing.jsx     # Subscription selection
    Dashboard.jsx   # Client overview
    ClientSetup.jsx # Client create/edit
    Generator.jsx   # Content generation
    History.jsx     # Past posts
    Settings.jsx    # User settings
  services/
    ai/
      ClaudeService.js    # Claude API integration
    storage/
      SupabaseService.js  # Database operations
```

## Status

**Completed:**
- Multi-client management
- AI content generation for 4 platforms
- Website analysis
- Supabase auth & storage
- Subscription tiers with Stripe
- Usage tracking & limits
- Session memory for drafts

**TODO:**
- Test full payment flow end-to-end
- Add subscription management (cancel/upgrade)
- Add billing portal link
