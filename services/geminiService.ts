
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const analyzeAudio = async (audioBase64: string): Promise<AnalysisResult> => {
  // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/wav",
              data: audioBase64,
            },
          },
          {
            text: SYSTEM_PROMPT,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: { type: Type.STRING },
            fluencyScore: { type: Type.NUMBER },
            vocabScore: { type: Type.NUMBER },
            grammarErrors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
              },
            },
            generalSuggestions: { type: Type.STRING },
          },
          required: ["transcript", "fluencyScore", "vocabScore", "grammarErrors", "generalSuggestions"],
        },
      },
    });

    const text = response.text || "";
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("Failed to analyze audio. Please try again.");
  }
};
