import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, voice_id } = await request.json()

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    const elevenlabsApiKey = process.env.ELEVEN_LABS_API_KEY
    const croweVoiceId = voice_id || process.env.CROWE_VOICE_ID || 'BsxQGfHOT8xeJhwW3B2u'

    if (!elevenlabsApiKey) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      )
    }

    console.log('🎙️ Synthesizing voice for Crowe Logic AI...')
    console.log('Voice ID:', croweVoiceId)
    console.log('Text length:', text.length)

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${croweVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenlabsApiKey,
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', response.status, errorText)
      return NextResponse.json(
        { error: `ElevenLabs API error: ${response.status}` },
        { status: response.status }
      )
    }

    const audioBuffer = await response.arrayBuffer()
    
    console.log('✅ Voice synthesis successful, audio size:', audioBuffer.byteLength)

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })

  } catch (error) {
    console.error('Voice synthesis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
