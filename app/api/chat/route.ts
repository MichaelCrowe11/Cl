import { NextRequest, NextResponse } from 'next/server';

// This function handles POST requests to the /api/chat endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Forward the request to the Python backend
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json({ error: errorData.error || 'Backend error' }, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json({ response: data.response });

  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
