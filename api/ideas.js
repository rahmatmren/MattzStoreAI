import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const systemInstruction = `Kamu adalah spesialis ide konten viral untuk MattzStore. 
        User akan memberikan hobi atau pekerjaan mereka. Berikan 3 ide konten TikTok/Reels yang menarik dan berpotensi viral.
        Di setiap ide, rekomendasikan juga aplikasi dari MattzStore (Alight Motion, Canva Pro, CapCut Pro, atau Spotify Premium) yang cocok untuk membuatnya.
        Gunakan gaya bahasa yang asik, kekinian, dan mudah dibaca. Gunakan format markdown bullet points.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
            }
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.error('AI Ideas Error:', error);
        res.status(500).json({ error: 'Gagal membuat ide konten. Coba lagi nanti.' });
    }
}