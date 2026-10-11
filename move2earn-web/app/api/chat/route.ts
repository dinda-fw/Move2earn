import { NextRequest, NextResponse } from 'next/server';
import { buildCoachSystemInstruction, generateLocalFallbackReply } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, history = [], context = {} } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get API Key from server environment
    const apiKey = (process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '').trim();

    // If API key is not configured or still placeholder
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({
        success: true,
        reply: generateLocalFallbackReply(prompt, context),
        isLiveAi: false,
        apiKeyConfigured: false,
        modelUsed: 'local-coach-rulebase',
      });
    }

    // Build system instruction and conversation contents
    const systemPrompt = buildCoachSystemInstruction(context);

    const contents = [
      ...history.slice(-6).map((item: any) => ({
        role: item.role === 'model' || item.role === 'coach' ? 'model' : 'user',
        parts: [{ text: item.text }],
      })),
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    // Try Gemini 2.0 Flash first, fallback to Gemini 1.5 Flash
    const primaryModel = 'gemini-2.0-flash';
    const fallbackModel = 'gemini-1.5-flash';

    let geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${primaryModel}:generateContent?key=${apiKey}`;

    let response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      }),
    });

    let modelUsed = primaryModel;

    // If 2.0 fails or is unavailable, attempt 1.5 Flash
    if (!response.ok && response.status === 404) {
      geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${apiKey}`;
      response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
        }),
      });
      modelUsed = fallbackModel;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Gemini API error [${response.status}]:`, errorText);
      
      // Fallback gracefully on API key invalid or rate limit
      return NextResponse.json({
        success: true,
        reply: generateLocalFallbackReply(prompt, context),
        isLiveAi: false,
        apiKeyConfigured: true,
        error: `Gemini API response: ${response.statusText}`,
        modelUsed: 'local-coach-fallback',
      });
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({
        success: true,
        reply: generateLocalFallbackReply(prompt, context),
        isLiveAi: false,
        modelUsed: 'local-coach-fallback',
      });
    }

    return NextResponse.json({
      success: true,
      reply: candidateText,
      isLiveAi: true,
      apiKeyConfigured: true,
      modelUsed,
    });
  } catch (error: any) {
    console.error('Chat API unexpected error:', error);
    return NextResponse.json({
      success: true,
      reply: 'Maaf, terjadi gangguan koneksi ke AI Coach. Coba beberapa saat lagi atau tanyakan seputar tips olahraga dasar!',
      isLiveAi: false,
      error: error?.message || 'Internal error',
    });
  }
}
