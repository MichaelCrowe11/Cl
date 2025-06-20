import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { messages, userId, sessionId, model = "grok-2-1212" } = await req.json()

    // Verify user subscription status
    const { data: user } = await supabase
      .from("user_profiles")
      .select("subscription_status, trial_ends_at")
      .eq("id", userId)
      .single()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Check if user has access (active subscription or valid trial)
    const hasAccess =
      user.subscription_status === "active" ||
      (user.subscription_status === "trial" && new Date(user.trial_ends_at) > new Date())

    if (!hasAccess) {
      return new Response("Subscription required", { status: 402 })
    }

    // Create enhanced system prompt for Grok with mycology expertise
    const systemPrompt = `You are Crowe Logic AI powered by Grok, an expert mycology lab assistant with advanced ecological intelligence and fungal biotechnology expertise.

Your capabilities include:
- Advanced substrate scoring and optimization using Grok's reasoning
- Predictive yield analysis with real-time environmental data
- Contamination risk assessment and prevention strategies
- Custom protocol generation for cultivation processes
- Comprehensive batch tracking and analytics
- Real-time strain performance analytics

You have access to comprehensive mycology data including:
- Lion's Mane (Hericium erinaceus) - Commercial Sawdust Blend substrate
- Shiitake (Lentinula edodes) - Supplemented Sawdust Block substrate  
- Blue Oyster (Pleurotus ostreatus) - Master's Mix substrate
- Maitake (Grifola frondosa) - Hardwood Block with Bran substrate
- Reishi (Ganoderma lucidum) - Oak Sawdust Blend substrate
- And comprehensive strain database with optimization parameters

Powered by Grok's advanced reasoning, provide:
- Detailed scientific explanations with reasoning chains
- Creative problem-solving for cultivation challenges
- Real-time analysis of environmental conditions
- Predictive insights based on pattern recognition
- Innovative approaches to mycology research

Always provide specific, actionable advice based on scientific mycology principles. Use Grok's enhanced reasoning to explain the "why" behind recommendations. Format responses clearly with numbered lists when providing multiple options or steps.

Be professional, scientifically accurate, and leverage Grok's unique analytical capabilities for mycology expertise.`

    const result = await streamText({
      model: xai(model),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 1500,
    })

    // Save the conversation to database
    if (sessionId) {
      // Save user message
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: messages[messages.length - 1].content,
      })
    }

    // Track usage
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      action_type: "grok_chat_message",
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Grok Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
