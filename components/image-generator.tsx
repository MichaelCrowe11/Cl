"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Download, Wand2, ImageIcon } from "lucide-react"

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [imageData, setImageData] = useState<any>(null)

  const mycologyPrompts = [
    "Oyster mushrooms growing on coffee grounds substrate in a sterile laboratory setting",
    "Lion's mane mushroom in various growth stages, detailed scientific illustration",
    "Contaminated petri dish showing green mold vs healthy mycelium growth",
    "Professional mushroom cultivation setup with grow bags and humidity control",
    "Shiitake mushrooms on hardwood logs in a controlled environment",
    "Microscopic view of mushroom spores and mycelium network",
  ]

  async function generateImage() {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    toast.loading("Generating image...")

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: "fal-ai/flux-lora",
          size: "1024x1024",
        }),
      })

      const cType = res.headers.get("content-type") ?? ""

      const data = cType.includes("application/json")
        ? await res.json()
        : { success: false, error: await res.text().then((t) => t.slice(0, 120)) }

      if (data.success) {
        setGeneratedImage(data.imageUrl)
        setImageData(data)
        toast.success("Image generated!")
      } else {
        toast.error(data.error || "Generation failed")
      }
    } catch (err) {
      console.error("Generation error:", err)
      toast.error("Network or server error")
    } finally {
      setIsGenerating(false)
    }
  }

  /* ---------- download & helpers unchanged ---------- */
  async function downloadImage() {
    if (!generatedImage) return
    try {
      const res = await fetch(generatedImage)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `crowe-ai-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Image downloaded!")
    } catch {
      toast.error("Download failed")
    }
  }

  async function copyPrompt(p: string) {
    setPrompt(p)
    try {
      await navigator.clipboard.writeText(p)
      toast.success("Prompt copied!")
    } catch {
      toast.success("Prompt set!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">AI Image Generator</h2>
        <p className="text-muted-foreground">Generate mycology-focused images for documentation and research</p>
      </div>

      {/* Prompt input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Describe the image you want to generate</label>
            <Textarea
              placeholder="e.g. Oyster mushrooms growing on coffee-grounds substrate…"
              className="min-h-[100px]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <Button onClick={generateImage} disabled={isGenerating || !prompt.trim()} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Quick prompts */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Quick Mycology Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mycologyPrompts.map((p, i) => (
            <Button
              key={i}
              variant="outline"
              className="h-auto p-3 text-left justify-start"
              onClick={() => copyPrompt(p)}
              disabled={isGenerating}
            >
              <div className="truncate text-sm">{p}</div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Generated result */}
      {generatedImage && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Generated Image</h3>
              <Button size="sm" variant="outline" onClick={downloadImage}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>

            <img
              src={generatedImage || "/placeholder.svg"}
              alt="Generated mycology"
              className="w-full rounded-lg shadow-lg"
            />

            {imageData && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  {imageData.size}
                </Badge>
                <Badge variant="secondary">Model: {imageData.model}</Badge>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              <strong>Prompt:</strong> {imageData?.prompt}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
