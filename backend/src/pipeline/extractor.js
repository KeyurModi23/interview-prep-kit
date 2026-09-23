import { generateStructuredJSON } from '../services/llmService.js';
import { Type } from '@google/genai';

const requirementSchema = {
  type: Type.ARRAY,
  description: 'List of requirements extracted from the job description',
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: 'Stable unique ID like r1, r2, r3' },
      text: { type: Type.STRING, description: 'The exact requirement text' },
      kind: { type: Type.STRING, enum: ['technical', 'behavioural', 'domain'] },
      priority: { type: Type.STRING, enum: ['must', 'nice'] }
    },
    required: ['id', 'text', 'kind', 'priority']
  }
};

export const extractRequirements = async (jobDescription) => {
  const sysPrompt = "You are an expert technical recruiter. Extract the requirements from the provided job description. Assign each a unique ID (r1, r2, etc). Carefully distinguish between 'must' (required) and 'nice' (nice to have / bonus). Categorize them as technical, behavioural, or domain.";
  
  const prompt = `Job Description:\n${jobDescription}`;
  
  return await generateStructuredJSON(sysPrompt, prompt, requirementSchema);
};
