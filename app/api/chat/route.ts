import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { messages, userId, sessionId } = await req.json()

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

    // Create system prompt with mycology expertise
    const systemPrompt = `You are Crowe Logic AI, an expert mycology lab assistant powered by advanced ecological intelligence and fungal biotechnology data.

Your capabilities include:
- Substrate scoring and optimization recommendations
- Yield prediction based on environmental factors
- Contamination risk assessment
- Protocol generation for cultivation processes
- Batch tracking and analysis
- Real-time strain analytics

You have access to comprehensive data on mushroom strains including:
- Lion's Mane (Hericium erinaceus) - Commercial Sawdust Blend substrate
- Shiitake (Lentinula edodes) - Supplemented Sawdust Block substrate  
- Blue Oyster (Pleurotus ostreatus) - Master's Mix substrate
- Maitake (Grifola frondosa) - Hardwood Block with Bran substrate
- And many other commercial strains

Always provide specific, actionable advice based on scientific mycology principles. When users mention specific substrates, strains, or cultivation parameters, reference the appropriate data and provide optimization suggestions.

Be professional, knowledgeable, and helpful. Format responses clearly with numbered lists when providing multiple options or steps.`

    const result = await streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Save the conversation to database
    if (sessionId) {
      // Save user message
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: messages[messages.length - 1].content,
      })

      // We'll save the AI response after streaming completes
    }

    // Track usage
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      action_type: "ai_chat_message",
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
