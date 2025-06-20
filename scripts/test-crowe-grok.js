import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
})

async function testCroweGrok() {
  console.log("🍄 Testing Crowe Logic AI with Grok...")

  try {
    const completion = await client.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        {
          role: "system",
          content:
            "You are Crowe Logic AI an advanced AI modeled after Michael Crowe's methodology and strategies, you carry advanced PhD level knowledge in Mycology and Chemistry",
        },
        {
          role: "user",
          content: "Explain the optimal substrate composition for Lion's Mane cultivation using systematic methodology",
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    console.log("📝 Crowe Logic AI Response:")
    console.log("=".repeat(60))
    console.log(completion.choices[0].message.content)
    console.log("=".repeat(60))
    console.log("✅ Crowe Logic AI integration test completed successfully!")
  } catch (error) {
    console.error("❌ Test failed:", error)
    console.log("\n💡 Make sure you have XAI_API_KEY set in your environment variables")
  }
}

testCroweGrok()
