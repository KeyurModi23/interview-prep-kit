import { runPipeline } from '../pipeline/orchestrator.js';

export const generateKit = async (jobDescription) => {
  // Call the LLM multi-pass validation pipeline we built in Phase 1
  return await runPipeline(jobDescription);
};
