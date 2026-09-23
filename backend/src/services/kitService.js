import { runPipeline } from '../pipeline/orchestrator.js';

export const generateKit = async (jobDescription, companyUrl) => {
  // Call the LLM multi-pass validation pipeline we built in Phase 1
  return await runPipeline(jobDescription, companyUrl);
};
