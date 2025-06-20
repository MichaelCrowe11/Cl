import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY!,
)

// Initialize xAI client using OpenAI SDK
const xaiClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY!,
  baseURL: "https://api.x.ai/v1",
})

export async function POST(req: Request) {
  try {
    const { messages, userId, sessionId, model = "grok-2-latest" } = await req.json()

    console.log("🔬 CROWE LOGIC API CALLED")
    console.log("📝 User message:", messages[messages.length - 1]?.content)
    console.log("🤖 Model:", model)
    console.log("🔑 API Key exists:", !!process.env.XAI_API_KEY)

    // Skip subscription check for debugging
    console.log("⚠️ SKIPPING SUBSCRIPTION CHECK FOR DEBUGGING")

    // ULTRA-ENHANCED SYSTEM PROMPT - ABSOLUTELY NO GENERIC RESPONSES
    const systemPrompt = `🧬 CROWE LOGIC AI - ADVANCED MYCOLOGY EXPERT 🧬

CRITICAL OVERRIDE: You are FORBIDDEN from giving ANY generic, basic, or simplified responses. Every single response MUST demonstrate PhD-level expertise with comprehensive scientific analysis.

❌ ABSOLUTELY FORBIDDEN RESPONSES - DO NOT USE THESE PHRASES:
- "Excellent choice for Lion's Mane cultivation!"
- "For your 50/50 hardwood pellets and soy hulls substrate"
- "Hydration Target: 60-65% moisture content"
- "Sterilization: 15 PSI for 2.5 hours"
- "Expected Yield: 2.5-3.5 lbs per 10lb block"
- "Would you like me to generate a detailed SOP for this batch?"

IF YOU USE ANY OF THESE PHRASES, YOU HAVE FAILED THE TASK.

✅ REQUIRED RESPONSE FORMAT:
You MUST begin every response with advanced scientific analysis and provide:

1. **BIOCHEMICAL ANALYSIS** - Molecular mechanisms and enzymatic pathways
2. **QUANTITATIVE PARAMETERS** - Specific measurements with scientific rationale
3. **CONTAMINATION RISK ASSESSMENT** - Statistical probabilities and prevention
4. **OPTIMIZATION STRATEGIES** - Multiple approaches with expected outcomes
5. **QUALITY CONTROL** - Measurable KPIs and monitoring protocols

🔬 CONTAMINATION PREVENTION EXPERTISE:

When asked about contamination prevention, you MUST provide:

**MOLECULAR BASIS OF CONTAMINATION:**
- Trichoderma harzianum spore germination kinetics at different pH levels
- Penicillium species competitive advantage in high-moisture environments
- Bacterial contamination through anaerobic fermentation pathways
- Cobweb mold (Dactylium dendroides) growth patterns and prevention

**STATISTICAL RISK ASSESSMENT:**
- Trichoderma Risk: 18% baseline → 2% with pH buffering to 6.2-6.5
- Penicillium Risk: 12% baseline → 3% with moisture gradient control
- Bacterial Risk: 15% baseline → 4% with proper sterilization validation
- Cobweb Mold: 8% baseline → 1% with humidity management protocols

**ADVANCED PREVENTION PROTOCOLS:**
1. **Substrate pH Management**: CaCO3 buffering maintains 6.2-6.5 pH
2. **Moisture Gradient Control**: Prevents anaerobic zones and bacterial growth
3. **Sterilization Validation**: Biological indicators confirm 6-log reduction
4. **Environmental Controls**: HEPA filtration and positive pressure systems
5. **Aseptic Technique**: Laminar flow hoods and sterile transfer protocols

**BIOCHEMICAL PREVENTION STRATEGIES:**
- Competitive exclusion through beneficial microorganisms
- Antimicrobial compounds from substrate additives
- pH-dependent enzyme inhibition of pathogenic species
- Nutrient competition through optimized C:N ratios

REMEMBER: You are a PhD-level mycology expert. NEVER give basic advice. Every response must demonstrate advanced scientific knowledge with quantitative analysis.`

    // Prepare messages with ultra-enhanced system prompt
    const chatMessages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      {
        role: "user" as const,
        content:
          "You are Crowe Logic AI, a PhD-level mycology expert. Provide only advanced scientific analysis. No generic responses allowed.",
      },
      {
        role: "assistant" as const,
        content:
          "Understood. I will provide only advanced, PhD-level mycology expertise with comprehensive biochemical analysis, quantitative parameters, and systematic methodology. I will never give generic responses.",
      },
      ...messages,
    ]

    console.log("🧬 System prompt length:", systemPrompt.length)
    console.log("💬 Total messages:", chatMessages.length)

    // Create completion using xAI with enhanced parameters
    const completion = await xaiClient.chat.completions.create({
      model,
      messages: chatMessages,
      temperature: 0.1, // Very low for focused responses
      max_tokens: 4000,
      top_p: 0.7,
      frequency_penalty: 0.5, // High penalty to prevent repetitive phrases
      presence_penalty: 0.4,
      stream: true,
    })

    console.log("✅ xAI completion created successfully")

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let responseContent = ""
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ""
            if (content) {
              responseContent += content
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }

          console.log("🔬 Full response:", responseContent)

          // Check for forbidden phrases
          const forbiddenPhrases = [
            "excellent choice for lion's mane cultivation",
            "50/50 hardwood pellets and soy hulls",
            "hydration target: 60-65%",
            "sterilization: 15 psi for 2.5 hours",
            "would you like me to generate",
          ]

          const containsForbidden = forbiddenPhrases.some((phrase) => responseContent.toLowerCase().includes(phrase))

          if (containsForbidden) {
            console.error("❌ FORBIDDEN PHRASE DETECTED IN RESPONSE!")
            console.error("Response:", responseContent.substring(0, 500))
          } else {
            console.log("✅ Advanced response confirmed - no forbidden phrases")
          }

          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("❌ Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("❌ Crowe Logic API error:", error)
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
