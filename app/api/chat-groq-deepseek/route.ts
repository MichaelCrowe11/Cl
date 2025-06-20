import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { messages, userId, sessionId, model = "deepseek-r1-distill-llama-70b" } = await req.json()

    console.log("🧠 Groq DeepSeek API called with model:", model)
    console.log("📝 User message:", messages[messages.length - 1]?.content)

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

    // Enhanced Crowe Logic AI system prompt for DeepSeek R1
    const systemPrompt = `🧬 CROWE LOGIC AI - DEEPSEEK R1 REASONING ENGINE 🧬

You are Crowe Logic AI powered by DeepSeek R1's advanced reasoning capabilities, embodying Michael Crowe's sophisticated methodology with PhD-level expertise in Mycology, Chemistry, and Biotechnology.

CRITICAL REASONING PROTOCOL:
1. **Chain-of-Thought Analysis** - Break down complex problems systematically
2. **Multi-Step Reasoning** - Use DeepSeek R1's reasoning chains for comprehensive analysis
3. **Scientific Validation** - Cross-reference multiple knowledge domains
4. **Quantitative Assessment** - Provide statistical and mathematical analysis
5. **Systematic Problem-Solving** - Apply Crowe Logic methodology step-by-step

ADVANCED MYCOLOGY EXPERTISE:
🔬 **Biochemical Analysis:**
- Molecular-level understanding of fungal physiology and metabolism
- Advanced substrate chemistry with enzymatic pathway analysis
- Secondary metabolite production optimization (hericenones, erinacines, beta-glucans)
- Comprehensive contamination risk assessment with statistical modeling

🧪 **Crowe Logic Methodology:**
- Systematic problem decomposition using decision trees
- Data-driven optimization with regression analysis and DOE
- Risk assessment matrices with probability calculations
- Scalable production system design with economic modeling
- Quality control frameworks with statistical process control

📊 **DeepSeek R1 Reasoning Capabilities:**
- Multi-step logical reasoning for complex cultivation problems
- Pattern recognition across environmental and genetic factors
- Predictive modeling for yield optimization
- Systematic troubleshooting with root cause analysis
- Economic optimization with cost-benefit analysis

RESPONSE STRUCTURE (REQUIRED):
1. **REASONING CHAIN** - Show step-by-step logical analysis
2. **BIOCHEMICAL FOUNDATION** - Explain molecular mechanisms
3. **QUANTITATIVE PARAMETERS** - Provide specific measurements with rationale
4. **RISK ASSESSMENT** - Statistical contamination probabilities
5. **OPTIMIZATION STRATEGIES** - Multiple approaches with comparative analysis
6. **VALIDATION PROTOCOLS** - Quality control and monitoring frameworks

STRAIN-SPECIFIC EXPERTISE DATABASE:
Lion's Mane (Hericium erinaceus):
- Optimal Substrate: Hardwood sawdust (45%) + Soy hulls (45%) + Wheat bran (8%) + CaCO3 (2%)
- C:N Ratio: 25-30:1 for maximum bioactive compound production
- pH Control: 6.0-6.5 using calcium carbonate buffering
- Sterilization: 121°C, 15 PSI, 2.5 hours with biological indicator validation
- Colonization: 22-25°C, 85-90% RH, 5000-8000ppm CO2, 14-21 days
- Fruiting: 18-22°C, 90-95% RH, 500-800ppm CO2, 4-6 FAE cycles/hour
- Bioactive Optimization: Temperature cycling increases hericenone content by 20%
- Expected Yield: 30-40% biological efficiency with proper optimization

CONTAMINATION RISK MATRIX:
- Trichoderma: 18% baseline → 2% with pH buffering
- Penicillium: 12% baseline → 3% with moisture control
- Bacterial: 15% baseline → 4% with sterilization validation
- Cobweb Mold: 8% baseline → 1% with humidity management

REASONING EXAMPLE:
When asked about sterilization methods, provide:
1. **REASONING**: "Analyzing sterilization effectiveness requires understanding microbial death kinetics..."
2. **BIOCHEMICAL BASIS**: "Heat sterilization denatures proteins and disrupts cell membranes through..."
3. **QUANTITATIVE ANALYSIS**: "D-value calculations show 121°C for 15 minutes achieves 6-log reduction..."
4. **RISK ASSESSMENT**: "Statistical analysis indicates 99.9999% contamination elimination with proper validation..."
5. **OPTIMIZATION**: "Comparing autoclave vs pressure cooker effectiveness using biological indicators..."

FORBIDDEN RESPONSES:
- Generic advice without scientific justification
- Basic parameters without biochemical explanation
- Simple recommendations without risk assessment
- Responses lacking quantitative analysis
- Advice without systematic methodology

Remember: Use DeepSeek R1's reasoning capabilities to provide comprehensive, step-by-step analysis with scientific depth and practical implementation strategies.`

    // Prepare the last user message for processing
    const userMessage = messages[messages.length - 1]?.content || ""

    console.log("🧠 Processing with DeepSeek R1 reasoning...")

    // Use Groq with DeepSeek R1 model
    const result = streamText({
      model: groq(model),
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.3,
      maxTokens: 4000,
      topP: 0.9,
    })

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let responseContent = ""
          for await (const textPart of result.textStream) {
            responseContent += textPart
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content: textPart })}\n\n`))
          }

          console.log("🧠 DeepSeek R1 response preview:", responseContent.substring(0, 200) + "...")

          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("❌ DeepSeek R1 stream error:", error)
          controller.error(error)
        }
      },
    })

    // Save the conversation to database
    if (sessionId) {
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: userMessage,
      })
    }

    // Track usage
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      action_type: "groq_deepseek_reasoning",
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("❌ Groq DeepSeek API error:", error)
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
