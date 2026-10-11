/**
 * =============================================================================
 * Move2Earn — Gemini AI Service (MoveIt Pro AI Coach Chatbot)
 * Handles communication with Google Gemini Generative AI (gemini-2.0-flash / gemini-1.5-flash)
 * =============================================================================
 */

export interface CoachMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  time: string;
  isLiveAi?: boolean;
}

export interface CoachUserContext {
  userName?: string;
  fitnessLevel?: string;
  dailyGoalTarget?: number;
  activeMin?: number;
  burnedCalories?: number;
  dayStreak?: number;
  walletBalance?: number;
  savedScreenTime?: string;
  monitoredApps?: Array<{ name: string; usedMin: number; thresholdMin: number }>;
}

export interface GeminiChatResponse {
  reply: string;
  isLiveAi: boolean;
  modelUsed: string;
  error?: string;
}

/**
 * System prompt instructing Gemini to act as Coach Max
 */
export function buildCoachSystemInstruction(context: CoachUserContext): string {
  const name = context.userName || 'Fajar';
  const streak = context.dayStreak ?? 7;
  const activeMin = context.activeMin ?? 24;
  const targetMin = context.dailyGoalTarget ?? 35;
  const calories = context.burnedCalories ?? 185;
  const coins = context.walletBalance ?? 75;
  const fitnessLevel = context.fitnessLevel || 'Beginner';

  return `Kamu adalah "Coach Max", AI Coach Kebugaran & Anti-Sedentary pribadi untuk aplikasi Move2Earn (Fitur Premium MoveIt Pro).
Kepribadianmu: Ramah, energik, empatik, berbasis bukti ilmiah olahraga, dan sangat memotivasi. 
Tujuan utamamu: Membantu pengguna mengubah kebiasaan screen time (scroll sosmed berlebih) menjadi kebiasaan bergerak sehat & produktif.

DATA PROFIL PENGGUNA SAAT INI:
- Nama Pengguna: ${name}
- Tingkat Kebugaran: ${fitnessLevel}
- Target Gerak Harian: ${targetMin} menit
- Gerak Tercapai Hari Ini: ${activeMin} menit (${Math.round((activeMin / targetMin) * 100)}% dari target)
- Kalori Terbakar: ${calories} kcal
- Day Streak Konsistensi: ${streak} hari berturut-turut
- Saldo Move Coins: ${coins} koin
${context.monitoredApps ? `- Aplikasi yang Dipantau: ${context.monitoredApps.map(a => `${a.name} (${a.usedMin}m/${a.thresholdMin}m)`).join(', ')}` : ''}

PANDUAN MENJAWAB:
1. Panggil pengguna dengan namanya (${name}) secara hangat.
2. Gunakan Bahasa Indonesia yang luwes, santai tapi profesional dan menyemangati.
3. Hubungkan saranmu dengan data metrik nyata pengguna di atas (screen time, kalori, streak, atau move coins).
4. Jika pengguna bertanya tentang pegal leher, mata lelah, atau postur akibat HP, berikan rekomendasi peregangan praktis (misal: Chin Tucks, Chest Opener, Cat-Cow, Neck Stretches) yang bisa dilakukan dalam 1-3 menit.
5. Berikan jawaban ringkas, padat, dan actionable (maksimal 2-3 paragraf singkat) agar mudah dibaca di layar smartphone.
6. Berikan sentuhan emoji yang relevan (💪, 🏃‍♂️, 📱, ✨, ☕).`;
}

/**
 * Generates an intelligent fallback reply if Gemini API Key is missing or unavailable
 */
export function generateLocalFallbackReply(prompt: string, context: CoachUserContext): string {
  const lower = prompt.toLowerCase();
  const name = context.userName || 'Fajar';
  const activeMin = context.activeMin ?? 24;
  const targetMin = context.dailyGoalTarget ?? 35;
  const remainingMin = Math.max(0, targetMin - activeMin);

  let reply = '';

  if (lower.includes('korelasi') || lower.includes('analisis') || lower.includes('performa') || lower.includes('data')) {
    reply = `Berdasarkan data minggu ini, ${name}: Ketika screen time sosmed kamu turun 42%, pembakaran kalori kamu melonjak +28%! Waktu terlama kamu scroll sosmed adalah antara jam 12:00–15:00. Saran saya: jadwalkan 3 menit Jumping Jacks atau Deep Squats sebelum makan siang untuk menjaga metabolisme tubuh tetap aktif! 💪`;
  } else if (lower.includes('leher') || lower.includes('pegal') || lower.includes('postur') || lower.includes('bahu')) {
    reply = `Posisi menunduk saat scrolling smartphone memberi tekanan hingga 27 kg pada tulang leher, ${name}! Saya sarankan lakukan peregangan 3 menit: 10x Chin Tucks, 15 detik Upper Chest Opener, dan Shoulder Rolls. Kamu bisa langsung memvalidasi gerakan ini di menu MoveIt Challenge! 🧘‍♂️`;
  } else if (lower.includes('malam') || lower.includes('tidur') || lower.includes('stop scroll') || lower.includes('begadang')) {
    reply = `Blue light dan doom-scrolling di atas jam 22:00 menurunkan produksi hormon melatonin hingga 50%! Aktifkan fitur 'Quiet Hours' di menu Focus & Notifications. Jika kamu tetap tergoda membuka sosmed, MoveIt akan mengunci layar dengan tantangan pernapasan 5 menit agar kamu tidur lebih nyenyak. 🌙`;
  } else {
    reply = `Semangat luar biasa, ${name}! Dengan streak ${context.dayStreak ?? 7} hari dan ${context.walletBalance ?? 75} Move Coins, kamu berada di jalur yang tepat. Hari ini kamu sudah bergerak ${activeMin} menit—hanya butuh ${remainingMin} menit lagi untuk menuntaskan 100% target harianmu! Ada gerakan spesifik yang ingin kamu tanyakan? ✨`;
  }

  const hasKey = Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
  if (!hasKey) {
    reply += `\n\n💡 (Mode Demo • Masukkan GEMINI_API_KEY di file .env.local untuk mengaktifkan respon live dari Google Gemini AI)`;
  }

  return reply;
}

/**
 * Primary function to send message to Gemini AI Coach
 */
export async function sendCoachChatMessage(
  prompt: string,
  history: CoachMessage[] = [],
  context: CoachUserContext = {}
): Promise<GeminiChatResponse> {
  // 1. Try calling our Next.js API route first (which has access to server-side GEMINI_API_KEY)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        history: history.slice(-6).map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          text: msg.text,
        })),
        context,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          reply: data.reply,
          isLiveAi: Boolean(data.isLiveAi),
          modelUsed: data.modelUsed || 'gemini-2.0-flash',
        };
      }
    }
  } catch (err) {
    console.warn('API /api/chat error, attempting direct client fallback:', err);
  }

  // 2. Client-side direct call if NEXT_PUBLIC_GEMINI_API_KEY is available
  const clientApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (clientApiKey && clientApiKey.trim() !== '' && clientApiKey !== 'your_gemini_api_key_here') {
    try {
      const systemPrompt = buildCoachSystemInstruction(context);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${clientApiKey.trim()}`;

      const contents = [
        ...history.slice(-4).map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            reply: text,
            isLiveAi: true,
            modelUsed: 'gemini-2.0-flash',
          };
        }
      }
    } catch (err) {
      console.warn('Direct client Gemini API error:', err);
    }
  }

  // 3. Fallback to smart local response if no key is present or on API failure
  return {
    reply: generateLocalFallbackReply(prompt, context),
    isLiveAi: false,
    modelUsed: 'local-coach-rulebase',
  };
}
