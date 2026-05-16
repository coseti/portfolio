import {OpenAI} from 'openai';
import {miguelContext} from '@/data/miguel-context';

export const runtime = 'nodejs';
export const maxDuration = 30;

type Msg = {role: 'user' | 'assistant'; content: string};

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({error: 'Chat not configured'}),
      {status: 503, headers: {'Content-Type': 'application/json'}}
    );
  }

  let body: {messages?: Msg[]; locale?: string};
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', {status: 400});
  }

  const messages = body.messages;
  const locale = body.locale === 'es' ? 'es' : 'en';

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
    return new Response('Invalid messages array', {status: 400});
  }

  for (const m of messages) {
    if (
      !m ||
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.content !== 'string' ||
      m.content.length === 0 ||
      m.content.length > 1000
    ) {
      return new Response('Invalid message format', {status: 400});
    }
  }

  const langHint =
    locale === 'es'
      ? 'Default to Spanish unless the user clearly writes in English.'
      : 'Default to English unless the user clearly writes in Spanish.';

  const systemPrompt = `${miguelContext}\n\n${langHint}`;

  const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {role: 'system', content: systemPrompt},
        ...messages
      ],
      stream: true,
      max_tokens: 400,
      temperature: 0.5
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          console.error('Chat stream error:', err);
          controller.error(err);
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no'
      }
    });
  } catch (e) {
    console.error('Chat API error:', e);
    return new Response('Upstream error', {status: 500});
  }
}
