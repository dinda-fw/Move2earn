import { NextRequest, NextResponse } from 'next/server';
import { buildCoachSystemInstruction, generateLocalFallbackReply } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, history = [], context = {} } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get API Key from server environment (stripping accidental quotes or whitespace)
    const apiKey = (process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')
      .replace(/^["']|["']$/g, '')
      .trim();

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

    // Priority models list (Gemini 3.8 Flash is current active generation in v1beta)
    const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

    let candidateText = '';
    let modelUsed = candidateModels[0];

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(geminiUrl, {
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

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            candidateText = text;
            modelUsed = model;
            break;
          }
        } else {
          const errText = await response.text();
          console.warn(`Model ${model} returned status ${response.status}:`, errText);
        }
      } catch (err) {
        console.warn(`Request failed for model ${model}:`, err);
      }
    }

    if (!candidateText) {
      return NextResponse.json({
        success: true,
        reply: generateLocalFallbackReply(prompt, context),
        isLiveAi: false,
        apiKeyConfigured: true,
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
