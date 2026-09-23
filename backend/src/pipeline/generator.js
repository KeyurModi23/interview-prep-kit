import { generateStructuredJSON } from '../services/llmService.js';
import { Type } from '@google/genai';

const questionsSchema = {
  type: Type.ARRAY,
  description: 'List of generated interview questions',
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: 'Stable unique ID like q1, q2, q3' },
      requirement_ids: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'Array of requirement IDs (e.g. r1, r2) that this question covers'
      },
      category: { type: Type.STRING, enum: ['technical', 'behavioural', 'system-design', 'company-fit'] },
      prompt: { type: Type.STRING, description: 'The interview question to ask the candidate' },
      answer_outline: { type: Type.STRING, description: 'A brief outline of what a good answer looks like' },
      difficulty: { type: Type.INTEGER, description: 'Difficulty level from 1 to 3' }
    },
    required: ['id', 'requirement_ids', 'category', 'prompt', 'answer_outline', 'difficulty']
  }
};

export const generateQuestions = async (requirements, existingQuestionsCount = 0) => {
  const sysPrompt = "You are an expert technical interviewer. Generate a set of high-quality interview questions that directly evaluate the provided requirements. Each question MUST cite the requirement IDs it covers. Ensure a mix of difficulties (1-3).";
  
  const prompt = `Requirements to cover:\n${JSON.stringify(requirements, null, 2)}\n\nStart generating Question IDs from q${existingQuestionsCount + 1}.`;
  
  return await generateStructuredJSON(sysPrompt, prompt, questionsSchema);
};
