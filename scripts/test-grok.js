const { streamText } = require("ai")
const { xai } = require("@ai-sdk/xai")

async function testGrok() {
  console.log("🧠 Testing Grok Integration...")

  try {
    const result = await streamText({
      model: xai("grok-2-1212"),
      prompt:
        "Explain the optimal substrate composition for Lion's Mane mushroom cultivation, including the scientific reasoning behind each component.",
      maxTokens: 500,
    })

    console.log("📝 Grok Response:")
    console.log("=".repeat(50))

    for await (const textPart of result.textStream) {
      process.stdout.write(textPart)
    }

    console.log("\n" + "=".repeat(50))
    console.log("✅ Grok integration test completed successfully!")
  } catch (error) {
    console.error("❌ Grok test failed:", error)
    console.log("\n💡 Make sure you have XAI_API_KEY set in your environment variables")
  }
}

testGrok()
