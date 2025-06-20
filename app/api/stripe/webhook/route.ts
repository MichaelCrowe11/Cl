import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,
)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        await handleSuccessfulPayment(session)
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice
        await handleSuccessfulPayment(invoice)
        break

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice
        await handleFailedPayment(failedInvoice)
        break

      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription
        await handleCancelledSubscription(subscription)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session | Stripe.Invoice) {
  const userId = session.metadata?.userId
  if (!userId) return

  await supabase
    .from("user_profiles")
    .update({
      subscription_status: "active",
      stripe_customer_id: session.customer as string,
      subscription_id: "subscription" in session ? (session.subscription as string) : session.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  const userId = invoice.metadata?.userId
  if (!userId) return

  await supabase
    .from("user_profiles")
    .update({
      subscription_status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
}

async function handleCancelledSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId
  if (!userId) return

  await supabase
    .from("user_profiles")
    .update({
      subscription_status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
}
