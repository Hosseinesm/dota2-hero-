import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiHeroData } from '../types';

// Initialize Gemini
// NOTE: process.env.API_KEY is assumed to be available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const heroSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    lore: {
      type: Type.STRING,
      description: "A short, engaging biography or lore of the hero in Persian.",
    },
    playstyle: {
      type: Type.STRING,
      description: "A description of how to play this hero (Carry, Support, etc.) in Persian.",
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Three pro tips for playing this hero effectively in Persian.",
    },
    counters: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 hero names or item names that counter this hero in Persian/English mix if needed.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 main strengths of this hero in Persian.",
    }
  },
  required: ["lore", "playstyle", "tips", "counters", "strengths"],
};

export const generateHeroStrategy = async (heroName: string): Promise<GeminiHeroData | null> => {
  try {
    const prompt = `
      I need a detailed guide for the Dota 2 hero "${heroName}" in Persian (Farsi).
      Focus on valid, high-level gameplay advice and interesting lore.
      Ensure the tone is exciting and suitable for gamers.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: heroSchema,
        systemInstruction: "You are a professional Dota 2 analyst and lore master speaking fluent Persian.",
      },
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as GeminiHeroData;
  } catch (error) {
    console.error("Error generating hero strategy:", error);
    return null;
  }
};