import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe only if the secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
}) : null

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Payment processing is unavailable.' },
      { status: 503 }
    )
  }

  try {
    const { priceId, planName, successUrl, cancelUrl } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      )
    }

    console.log('🛒 Creating Stripe checkout session...')
    console.log('Price ID:', priceId)
    console.log('Plan:', planName)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      metadata: {
        planName: planName || 'CroweOS Systems Plan',
      },
      customer_email: undefined, // In production, you'd get this from the user
      subscription_data: {
        metadata: {
          planName: planName || 'CroweOS Systems Plan',
        },
      },
    })

    console.log('✅ Stripe checkout session created:', session.id)

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
