export const runtime = 'edge';

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'FishRouter TTS Bridge for Verity Mod',
      configured: Boolean(process.env.FISH_API_KEY && process.env.FISH_VOICE_ID),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.FISH_API_KEY;
    const voiceId = process.env.FISH_VOICE_ID;

    if (!apiKey) {
      return new Response('FISH_API_KEY environment variable is not configured.', {
        status: 500,
      });
    }

    if (!voiceId) {
      return new Response('FISH_VOICE_ID environment variable is not configured.', {
        status: 500,
      });
    }

    const body = await req.json().catch(() => ({}));
    // Verity manda el texto en "input" o "text" según el esquema OpenAI/Kokoro
    const inputText = body.input || body.text || body.prompt || '';

    if (!inputText || typeof inputText !== 'string' || !inputText.trim()) {
      return new Response('No input text provided', { status: 400 });
    }

    // Si viene un reference_id explícito en el body se puede priorizar, de lo contrario se usa FISH_VOICE_ID
    const targetVoiceId =
      body.reference_id && typeof body.reference_id === 'string'
        ? body.reference_id
        : voiceId;

    const fishRes = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText,
        reference_id: targetVoiceId,
        format: 'wav',
      }),
    });

    if (!fishRes.ok) {
      const err = await fishRes.text();
      console.error('[FishRouter TTS Error]', fishRes.status, err);
      return new Response(err, { status: fishRes.status });
    }

    // Devuelve el flujo de audio directamente a Minecraft
    return new Response(fishRes.body, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (err: any) {
    console.error('[FishRouter Exception]', err);
    return new Response(err?.message || 'Internal Server Error', { status: 500 });
  }
}
