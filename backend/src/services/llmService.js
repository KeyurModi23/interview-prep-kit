import { GoogleGenAI, Type } from '@google/genai';
import { config } from '../config/env.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-3.6-flash';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Helper to call Gemini with a structured JSON schema, with exponential backoff
 */
export const generateStructuredJSON = async (systemInstruction, prompt, schema, retries = 4) => {
  let attempt = 0;
  
  while (attempt < retries) {
    try {
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
      console.error(`[LLM Error] Attempt ${attempt}/${retries}:`, error.message);
      
      if (attempt >= retries) {
        throw new Error(`LLM Failed after ${retries} attempts. Last error: ${error.message}`);
      }
      
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`Rate limited or high demand. Waiting ${waitTime/1000}s before retrying...`);
      await delay(waitTime);
    }
  }
};
