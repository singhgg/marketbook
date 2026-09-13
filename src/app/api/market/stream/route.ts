import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial heartbeat
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() })}\n\n`));

      // Periodic tick interval for macro updates
      const interval = setInterval(() => {
        try {
          const sampleUpdate = {
            type: 'TICK',
            tick: {
              symbol: 'SPY',
              price: 562.4 + (Math.random() - 0.5) * 0.2,
              change24h: 0.42,
              timestamp: Date.now(),
            },
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(sampleUpdate)}\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 5000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
