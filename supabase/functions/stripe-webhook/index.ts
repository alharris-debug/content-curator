import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!

Deno.serve(async (req) => {
  try {
    const body = await req.text()
    const event = JSON.parse(body)

    console.log('Webhook event:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const customerEmail = session.customer_email
      const subscriptionId = session.subscription

      console.log('Processing checkout for:', customerEmail, 'subscription:', subscriptionId)

      // Get subscription details from Stripe
      const subResponse = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
        headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY}` },
      })
      const subscription = await subResponse.json()

      console.log('Stripe subscription response:', JSON.stringify(subscription))

      if (subscription.error) {
        console.error('Stripe API error:', subscription.error)
        throw new Error(`Stripe API error: ${subscription.error.message}`)
      }

      const priceId = subscription.items?.data?.[0]?.price?.id
      console.log('Price ID:', priceId)

      // Map price ID to tier using env vars
      const tierMap: Record<string, string> = {
        [Deno.env.get('STRIPE_PRICE_STARTER_MONTHLY')!]: 'starter',
        [Deno.env.get('STRIPE_PRICE_STARTER_YEARLY')!]: 'starter',
        [Deno.env.get('STRIPE_PRICE_PRO_MONTHLY')!]: 'pro',
        [Deno.env.get('STRIPE_PRICE_PRO_YEARLY')!]: 'pro',
        [Deno.env.get('STRIPE_PRICE_AGENCY_MONTHLY')!]: 'agency',
        [Deno.env.get('STRIPE_PRICE_AGENCY_YEARLY')!]: 'agency',
      }
      const tier = tierMap[priceId] || 'starter'
      console.log('Mapped tier:', tier)

      // Find user by email
      const { data: users } = await supabase.auth.admin.listUsers()
      const user = users.users.find((u: any) => u.email === customerEmail)

      if (user) {
        console.log('Creating subscription for user:', user.id, 'tier:', tier)

        const periodStart = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000).toISOString()
          : new Date().toISOString()
        const periodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

        const { error: upsertError } = await supabase.from('subscriptions').upsert({
          user_id: user.id,
          tier,
          status: 'active',
          stripe_customer_id: session.customer,
          stripe_subscription_id: subscriptionId,
          current_period_start: periodStart,
          current_period_end: periodEnd,
        })

        if (upsertError) {
          console.error('Supabase upsert error:', upsertError)
          throw upsertError
        }
        console.log('Subscription created successfully')
      } else {
        console.error('User not found for email:', customerEmail)
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
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
