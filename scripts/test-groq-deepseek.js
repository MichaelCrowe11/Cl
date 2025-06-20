import { groq } from "@ai-sdk/groq"
import { streamText } from "ai"

// Test the Groq DeepSeek R1 integration
async function testGroqDeepSeek() {
  console.log("🧠 Testing Groq DeepSeek R1 Integration...")

  try {
    const result = streamText({
      model: groq("deepseek-r1-distill-llama-70b"),
      prompt:
        "Analyze the multi-step reasoning process for optimizing Lion's Mane substrate composition using systematic problem decomposition.",
      temperature: 0.3,
      maxTokens: 2000,
    })

    console.log("✅ Response received:")
    console.log("=" * 80)

    for await (const textPart of result.textStream) {
      process.stdout.write(textPart)
    }

    console.log("\n" + "=" * 80)
    console.log("✅ DeepSeek R1 reasoning test completed successfully!")
  } catch (error) {
    console.error("❌ Test failed:", error)
  }
}

testGroqDeepSeek()
