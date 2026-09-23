import { scrapeCompanyContext } from '../services/scraperService.js';
import { extractRequirements } from './extractor.js';
import { generateQuestions } from './generator.js';
import { checkCoverage } from './coverage.js';

export const runPipeline = async (jobDescription, maxPasses = 2) => {
  console.log('--- Step 1: Extracting Requirements ---');
  const requirements = await extractRequirements(jobDescription);
  console.log(`Extracted ${requirements.length} requirements.`);
  
  let allQuestions = [];
  let currentPass = 1;
  let uncoveredIds = [];

  // Pass 1
  console.log('\n--- Step 2: Pass 1 Generation ---');
  const pass1Questions = await generateQuestions(requirements, allQuestions.length);
  allQuestions = [...allQuestions, ...pass1Questions];

  // Coverage Loop
  while (currentPass <= maxPasses) {
    uncoveredIds = checkCoverage(requirements, allQuestions);
    console.log(`\n--- Coverage Check (Pass ${currentPass}) ---`);
    console.log(`Missing coverage for requirements: ${uncoveredIds.length > 0 ? uncoveredIds.join(', ') : 'None!'}`);

    if (uncoveredIds.length === 0) {
      break; // Fully covered!
    }

    if (currentPass === maxPasses) {
      console.log('Max passes reached, stopping coverage loop.');
      break;
    }

    // Pass 2+ (Targeted Generation)
    currentPass++;
    console.log(`\n--- Step 3: Pass ${currentPass} Targeted Generation ---`);
    const missingRequirements = requirements.filter(r => uncoveredIds.includes(r.id));
    const pass2Questions = await generateQuestions(missingRequirements, allQuestions.length);
    allQuestions = [...allQuestions, ...pass2Questions];
  }

  return {
    requirements,
    questions: allQuestions,
    coverage: {
      uncovered_requirement_ids: uncoveredIds,
      passes: currentPass
    }
  };
};
