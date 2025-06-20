import OpenAI from "openai"

// Initialize xAI client using OpenAI SDK
const xaiClient = new OpenAI({
  apiKey: process.env.XAI_API_KEY!,
  baseURL: "https://api.x.ai/v1",
})

export async function POST(req: Request) {
  try {
    console.log("🚀 CROWE ADVANCED API CALLED - NEW ENDPOINT")

    const { messages, userId, sessionId, model = "grok-2-latest" } = await req.json()

    console.log("📝 User message:", messages[messages.length - 1]?.content)
    console.log("🤖 Model:", model)
    console.log("🔑 XAI API Key exists:", !!process.env.XAI_API_KEY)
    console.log("🔗 Base URL:", "https://api.x.ai/v1")

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
You MUST begin every response with advanced scientific analysis.

When asked to generate a cultivation SOP, you MUST provide:

**COMPREHENSIVE CULTIVATION PROTOCOL:**

1. **SUBSTRATE FORMULATION & BIOCHEMISTRY:**
   - Hardwood sawdust (45%): Lignin content 15-20% for sustained nutrient release
   - Soy hulls (45%): Protein content 12-15% optimizes C:N ratio to 27:1
   - Wheat bran (8%): Nitrogen source and enzymatic cofactors
   - CaCO3 (2%): pH buffering to 6.2-6.5 for optimal laccase activity

2. **STERILIZATION PROTOCOL:**
   - Temperature: 121°C (250°F) for complete spore inactivation
   - Pressure: 15 PSI minimum for proper heat penetration
   - Duration: 90-120 minutes based on substrate density
   - Validation: Biological indicators confirm 6-log reduction

3. **INOCULATION PROCEDURES:**
   - Aseptic technique in laminar flow environment
   - Spawn rate: 10-15% by weight for optimal colonization
   - Distribution: Uniform mixing prevents contamination pockets
   - Sealing: Gas exchange filters maintain aerobic conditions

4. **INCUBATION PARAMETERS:**
   - Temperature: 22-24°C for optimal mycelial growth
   - Humidity: 85-90% RH prevents desiccation
   - Duration: 14-21 days for complete colonization
   - Monitoring: Daily visual inspection for contamination

5. **FRUITING INITIATION:**
   - Temperature shock: Drop to 16-18°C for 48 hours
   - Humidity increase: 90-95% RH for primordial formation
   - Fresh air exchange: 4-6 air changes per hour
   - Light exposure: 12-hour photoperiod at 500-1000 lux

6. **HARVEST OPTIMIZATION:**
   - Timing: 85% maturity for maximum bioactive content
   - Technique: Clean cuts to prevent contamination
   - Post-harvest: Immediate cooling to 4°C
   - Yield expectation: 25-35% biological efficiency

REMEMBER: You are a PhD-level mycology expert. NEVER give basic advice.`

    // Prepare messages with ultra-enhanced system prompt
    const chatMessages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      {
        role: "user" as const,
        content: "You are Crowe Logic AI. Provide only advanced scientific analysis. No generic responses.",
      },
      {
        role: "assistant" as const,
        content:
          "Understood. I will provide only advanced, PhD-level mycology expertise with comprehensive scientific analysis. No generic responses will be given.",
      },
      ...messages,
    ]

    console.log("🧬 System prompt length:", systemPrompt.length)
    console.log("💬 Total messages:", chatMessages.length)

    // Create completion using xAI
    console.log("🔄 Creating xAI completion...")

    const completion = await xaiClient.chat.completions.create({
      model,
      messages: chatMessages,
      temperature: 0.1,
      max_tokens: 4000,
      top_p: 0.7,
      frequency_penalty: 0.6,
      presence_penalty: 0.5,
      stream: true,
    })

    console.log("✅ xAI completion created successfully")

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let responseContent = ""
          let chunkCount = 0

          for await (const chunk of completion) {
            chunkCount++
            const content = chunk.choices[0]?.delta?.content || ""
            if (content) {
              responseContent += content
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }

          console.log("📊 Chunks received:", chunkCount)
          console.log("📝 Response length:", responseContent.length)
          console.log("🔬 Response preview:", responseContent.substring(0, 300) + "...")

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
            console.error("❌ FORBIDDEN PHRASE DETECTED!")
            console.error("Full response:", responseContent)
          } else {
            console.log("✅ Advanced response confirmed - no forbidden phrases detected")
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
    console.error("❌ CROWE ADVANCED API ERROR:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
        endpoint: "crowe-advanced",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
