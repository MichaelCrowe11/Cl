import { NextRequest, NextResponse } from 'next/server';

// This function handles POST requests to the /api/chat endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Determine backend URL: use env var or fallback to the request origin
    const origin = process.env.NEXT_PUBLIC_BACKEND_URL || new URL(req.url).origin;

    // Forward the request to the Python backend
    const backendResponse = await fetch(
      `${origin}/ai/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      }
    );

    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return NextResponse.json({ error: data.error || 'Backend error' }, { status: backendResponse.status });
    }

    return NextResponse.json({ response: data.response });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
