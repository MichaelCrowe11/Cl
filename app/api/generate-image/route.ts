import { NextResponse } from "next/server"
import { fal } from "@fal-ai/serverless" // API-key auth

export const dynamic = "force-dynamic"

/**
 * POST /api/generate-image
 * Body: { prompt: string; model: string; size: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const prompt = (body?.prompt as string | undefined)?.trim()
    const model = (body?.model as string | undefined) ?? "fal-ai/flux-lora"
    const size = (body?.size as string | undefined) ?? "1024x1024"

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Missing `prompt`" }, { status: 400 })
    }

    const apiKey = process.env.FAL_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "FAL_KEY env var not set" }, { status: 500 })
    }

    const client = fal(apiKey)

    try {
      const res = await client.invoke(model, {
        input: {
          prompt,
          image_size: size,
          guidance_scale: 3.5,
          num_inference_steps: 28,
          num_images: 1,
          enable_safety_checker: true,
        },
      })

      const imageUrl = res?.images?.[0]?.url
      if (!imageUrl) throw new Error("Fal API returned no image URL")

      return NextResponse.json({
        success: true,
        prompt,
        model,
        size,
        imageUrl,
      })
    } catch (falErr: any) {
      console.error("❌  Fal generation error:", falErr)
      return NextResponse.json(
        {
          success: false,
          error: "Fal generation failed",
          details: falErr?.message ?? String(falErr),
        },
        { status: 502 },
      )
    }
  } catch (e: any) {
    console.error("❌  Unexpected error in /generate-image:", e)
    return NextResponse.json(
      { success: false, error: "Unexpected server error", details: e?.message ?? String(e) },
      { status: 500 },
    )
  }
}
