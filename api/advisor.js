import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
    // Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Inisialisasi Gemini Client menggunakan API Key dari Environment Variable Vercel
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const systemInstruction = `Kamu adalah AI Assistant resmi untuk MattzStore, sebuah toko digital premium. 
        Tugasmu merekomendasikan aplikasi yang tepat berdasarkan kebutuhan user.
        Produk yang dijual MattzStore: Alight Motion, Canva Pro, CapCut Pro, dan Spotify Premium.
        Gunakan bahasa yang ramah, persuasif, dan gaul (bisa gunakan emoji). Jawab dengan singkat, padat, dan jelas. Format jawabanmu menggunakan plain text atau markdown sederhana.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.error('AI Advisor Error:', error);
        res.status(500).json({ error: 'Gagal menghubungi AI. Coba lagi nanti.' });
    }
}