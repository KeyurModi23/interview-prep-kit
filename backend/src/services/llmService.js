import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Array of fallback models. If one hits a hard quota, we seamlessly switch to the next.
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash'];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const generateStructuredJSON = async (systemInstruction, prompt, schema, retries = 5) => {
  let attempt = 0;
  let currentModelIndex = 0;

  while (attempt < retries) {
    const model = FALLBACK_MODELS[currentModelIndex];
    try {
      console.log(`[LLM] Attempting with model: ${model}`);
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.2
        }
      });

      const text = response.text;
      return JSON.parse(text);
    } catch (error) {
      attempt++;
      console.error(`[LLM Error] Attempt ${attempt}/${retries} (${model}):`, error.message);

      // If it's a 429 Quota/Rate Limit error, try to fallback to the next model immediately
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('404') || error.message.includes('NOT_FOUND') || error.message.includes('503') || error.message.includes('UNAVAILABLE')) {
        if (currentModelIndex < FALLBACK_MODELS.length - 1) {
          console.log(`[LLM] Quota exceeded. Switching to fallback model: ${FALLBACK_MODELS[currentModelIndex + 1]}`);
          currentModelIndex++;
          continue; // Try immediately with new model, don't wait
        } else {
          console.log('[LLM] All fallback models exhausted their quota.');
        }
      }

      if (attempt >= retries) {
        throw new Error(`LLM Failed after ${retries} attempts. Last error: ${error.message}`);
      }

      const waitTime = Math.pow(2, attempt) * 3000;
      console.log(`Rate limited or high demand. Waiting ${waitTime / 1000}s before retrying...`);
      await delay(waitTime);
    }
  }
};
