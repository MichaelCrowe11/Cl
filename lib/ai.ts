import { ApiMessage } from "./chat-types";

export interface ChatCompletionRequest<M extends string = string> {
  messages: ApiMessage[];
  model: M;
  temperature?: number;
  maxTokens?: number;
}

export async function streamCompletion<M extends string = string>(
  body: ChatCompletionRequest<M>,
  onToken: (token: string) => void,
  signal?: AbortSignal
) {
  const controller = new AbortController();
  if (signal) signal.addEventListener('abort', () => controller.abort());

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: controller.signal,
  });
  
  if (!res.ok || !res.body) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }

  // Content-Type sanity check
  const contentType = res.headers.get('Content-Type');
  if (contentType && !contentType.includes('text/') && !contentType.includes('application/')) {
    console.warn(`Unexpected Content-Type: ${contentType}`);
  }

  const decoder = new TextDecoder();
  const reader = res.body.getReader();

  try {
    // Timeout fallback for stalled responses
    const timeoutId = setTimeout(() => {
      console.warn('Stream timeout - aborting');
      controller.abort();
    }, 30000); // 30 second timeout

    for (;;) {
      const { value, done } = await reader.read();
      
      if (done) {
        clearTimeout(timeoutId);
        break;
      }

      try {
        // Decode with stream: true for multi-byte character safety
        const chunk = decoder.decode(value, { stream: true });
        onToken(chunk);
      } catch (decodeError) {
        console.warn('Decode error, attempting fallback:', decodeError);
        // Fallback for malformed UTF-8
        onToken(new TextDecoder('utf-8', { fatal: false }).decode(value));
      }
    }
    
    // Flush final bytes from decoder buffer
    const finalChunk = decoder.decode();
    if (finalChunk) {
      onToken(finalChunk);
    }

  } finally {
    // Always release the reader to avoid locking the stream
    reader.releaseLock();
  }

  return { 
    cancel: () => controller.abort(),
    controller 
  };
}
