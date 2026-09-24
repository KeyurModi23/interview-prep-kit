import { generateStructuredJSON } from '../services/llmService.js';
import { Type } from '@google/genai';

const extractionSchema = {
  type: Type.OBJECT,
  properties: {
    source: {
      type: Type.OBJECT,
      properties: {
        company: { type: Type.STRING },
        role: { type: Type.STRING },
        location: { type: Type.STRING }
      }
    },
    company_brief: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        what_they_do: { type: Type.STRING }
      }
    },
    role: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        seniority: { type: Type.STRING },
        responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
        requirements: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              kind: { type: Type.STRING },
              priority: { type: Type.STRING }
            }
          }
        }
      }
    }
  }
};

export const extractMetadata = async (jobDescription, companyContext) => {
  const sysPrompt = "You are an expert technical recruiter and researcher. Extract the job requirements, responsibilities, and metadata from the job description. If company context is provided, summarize what the company does. Assign each requirement a unique ID (r1, r2). Categorize them (technical, behavioural, domain) and set priority (must, nice).";
  const prompt = `Company Context:\n${companyContext}\n\nJob Description:\n${jobDescription}`;
  
  return await generateStructuredJSON(sysPrompt, prompt, extractionSchema);
};
