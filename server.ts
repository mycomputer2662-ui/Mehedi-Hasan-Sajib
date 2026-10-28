import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper for Gemini AI client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API endpoint to generate high-CTR thumbnail headlines
app.post('/api/gemini/headlines', async (req, res) => {
  try {
    const { topic, language = 'bangla', tone = 'breaking' } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY not configured on server',
        fallback: true,
      });
    }

    const prompt = `Generate 4 high-contrast, ultra eye-catching YouTube thumbnail headline sets in ${
      language === 'bangla' ? 'Bengali (বাংলা)' : 'English'
    } inspired by viral breaking news, government welfare announcements, and urgent YouTube thumbnail formats.
The topic is: "${topic}".
Tone/Style: ${tone}.

Each thumbnail headline set must have:
1. "topText": A punchy, urgent main headline (e.g. "গর্ভবতী ভাতা নিয়ে বড় আপডেট" or "জরুরি সুখবর সকলের জন্য")
2. "subPrefix": Short prefix for the 2nd line (e.g. "৩১ অক্টোবর বাকী" or "আজ রাত ১২টায়")
3. "highlightText": The glowing high-impact number, amount, or key word (e.g. "২৫৫০ টাকা" or "১০,০০০ টাকা" or "বড় সিদ্ধান্ত")
4. "subSuffix": Suffix after highlight (e.g. "দিবে" or "কার্যকর" or "ঘোষণা")
5. "bottomText": Comma-separated categories or urgent summary (e.g. "বয়স্ক, গর্ভবতী, প্রতিবন্ধী, বিধবা ভাতা" or "সকল নাগরিকের জানা জরুরি")
6. "badge": A short stamp label (e.g. "ব্রেকিং নিউজ", "জরুরি বিজ্ঞপ্তি", "১০০% নিশ্চিত", "অফিসিয়াল")

Return only valid JSON array of 4 objects.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topText: { type: Type.STRING },
              subPrefix: { type: Type.STRING },
              highlightText: { type: Type.STRING },
              subSuffix: { type: Type.STRING },
              bottomText: { type: Type.STRING },
              badge: { type: Type.STRING },
            },
            required: ['topText', 'subPrefix', 'highlightText', 'subSuffix', 'bottomText', 'badge'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ headlines: parsed });
  } catch (error: any) {
    console.error('Error generating headlines:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate headlines' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
