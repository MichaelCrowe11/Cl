"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Volume2, Loader2, Play, Square, Mic } from "lucide-react"

export default function VoiceTestInterface() {
  const [text, setText] = useState("Welcome to Crowe Logic AI. This is a voice synthesis test using ElevenLabs technology.")
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { toast } = useToast()

  const generateVoice = async () => {
    if (!text.trim()) return

    setIsGenerating(true)
    setAudioUrl(null)

    try {
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice_id: process.env.NEXT_PUBLIC_CROWE_VOICE_ID || 'BsxQGfHOT8xeJhwW3B2u'
        }),
      })

      if (!response.ok) {
        throw new Error('Voice synthesis failed')
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)

      toast({
        title: "Success!",
        description: "Voice synthesis completed successfully",
      })

    } catch (error) {
      console.error('Voice synthesis error:', error)
      toast({
        title: "Error",
        description: "Failed to generate voice. Check your ElevenLabs API key.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const playAudio = () => {
    if (!audioUrl) return

    const audio = new Audio(audioUrl)
    setIsPlaying(true)
    
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => {
      setIsPlaying(false)
      toast({
        title: "Error",
        description: "Failed to play audio",
        variant: "destructive"
      })
    }
    
    audio.play()
  }

  const stopAudio = () => {
    setIsPlaying(false)
    // Note: We'd need to store the audio instance to actually stop it
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🎙️ Crowe Logic Voice Test</h1>
        <p className="text-muted-foreground">Test the ElevenLabs voice synthesis integration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Synthesis Test
          </CardTitle>
          <CardDescription>
            Enter text below to test the Crowe Logic AI voice using ElevenLabs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text to Synthesize</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text for voice synthesis..."
              className="min-h-[100px]"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {text.length}/500 characters
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={generateVoice} 
              disabled={!text.trim() || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating Voice...
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Generate Crowe Logic Voice
                </>
              )}
            </Button>

            {audioUrl && (
              <Button 
                onClick={isPlaying ? stopAudio : playAudio}
                variant="outline"
                disabled={isGenerating}
              >
                {isPlaying ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </>
                )}
              </Button>
            )}
          </div>

          {audioUrl && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Volume2 className="h-4 w-4" />
                <span className="font-medium">Voice generated successfully!</span>
              </div>
              <audio controls className="w-full mt-2">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Environment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">ElevenLabs API</Badge>
                <Badge variant={process.env.ELEVEN_LABS_API_KEY ? "default" : "destructive"}>
                  {process.env.ELEVEN_LABS_API_KEY ? "Configured" : "Missing"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Crowe Voice ID</Badge>
                <Badge variant={process.env.CROWE_VOICE_ID ? "default" : "destructive"}>
                  {process.env.CROWE_VOICE_ID ? "Configured" : "Missing"}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Voice ID: {process.env.NEXT_PUBLIC_CROWE_VOICE_ID || 'BsxQGfHOT8xeJhwW3B2u'}
              </div>
              <div className="text-sm text-muted-foreground">
                API Status: {process.env.ELEVEN_LABS_API_KEY ? '✅ Ready' : '❌ Not configured'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
