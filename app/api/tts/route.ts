export const runtime = 'edge';

// Cabeceras CORS universales
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-voice-id, model',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const apiKey = url.searchParams.get('apiKey') || url.searchParams.get('key') || process.env.FISH_API_KEY;
  const voiceId = url.searchParams.get('voiceId') || url.searchParams.get('voice') || process.env.FISH_VOICE_ID;

  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'FishRouter - Fish Audio to OpenAI/Verity TTS Bridge',
      version: '2.0.0',
      description: 'Convierte peticiones OpenAI TTS (/v1/audio/speech) a la API de Fish Audio.',
      hasDefaultCredentials: Boolean(process.env.FISH_API_KEY && process.env.FISH_VOICE_ID),
      customConfigDetected: Boolean(apiKey && voiceId),
      endpoints: [
        '/api/tts',
        '/api/tts/audio/speech',
        '/audio/speech',
        '/v1/audio/speech'
      ]
    }, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);

    // 1. Extraer API Key: Prioridad Header > Query Param > Env Var
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    let apiKey: string | null = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7).trim();
    }
    if (!apiKey) {
      apiKey = url.searchParams.get('apiKey') || url.searchParams.get('api_key') || url.searchParams.get('key');
    }
    if (!apiKey) {
      apiKey = process.env.FISH_API_KEY || null;
    }

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'No Fish Audio API Key provided.',
          solution: 'Pasa tu API key en el header Authorization: Bearer <key>, en el query ?apiKey=<key>, o configúrala en ttsApiKey.'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // 2. Extraer Body
    const body = await req.json().catch(() => ({}));

    // 3. Extraer Voice ID (Reference ID): Prioridad Body voice/reference_id > Header > Query Param > Env Var
    let targetVoiceId =
      body.reference_id ||
      body.voice ||
      req.headers.get('x-voice-id') ||
      url.searchParams.get('voiceId') ||
      url.searchParams.get('voice_id') ||
      url.searchParams.get('voice') ||
      process.env.FISH_VOICE_ID ||
      null;

    if (!targetVoiceId) {
      return new Response(
        JSON.stringify({
          error: 'No Voice Reference ID provided.',
          solution: 'Pasa tu ID de voz en el body "voice", en el query ?voiceId=<id>, o en x-voice-id header.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // 4. Extraer Texto a sintetizar (soporta formatos OpenAI / Kokoro / Custom)
    const inputText = body.input || body.text || body.prompt || '';
    if (!inputText || typeof inputText !== 'string' || !inputText.trim()) {
      return new Response(
        JSON.stringify({ error: 'No input text provided.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // 5. Modelo a usar (por defecto s2.1-pro-free)
    const requestedModel =
      url.searchParams.get('model') ||
      body.model ||
      process.env.FISH_MODEL ||
      's2.1-pro-free';

    // 6. Llamada hacia Fish Audio API
    const fishRes = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        model: requestedModel,
      },
      body: JSON.stringify({
        text: inputText,
        reference_id: targetVoiceId,
        format: 'wav',
        model: requestedModel,
      }),
    });

    if (!fishRes.ok) {
      const err = await fishRes.text();
      console.error('[FishRouter TTS Error]', fishRes.status, err);
      return new Response(err, {
        status: fishRes.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // 7. Retornar el flujo de audio con cabeceras de streaming
    return new Response(fishRes.body, {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-cache',
        ...corsHeaders,
      },
    });
  } catch (err: any) {
    console.error('[FishRouter Exception]', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}
