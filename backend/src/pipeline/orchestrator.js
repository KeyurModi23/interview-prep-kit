import { extractRequirements } from './extractor.js';
import { generateQuestions } from './generator.js';
import { checkCoverage } from './coverage.js';

export const runPipeline = async (jobDescription, companyUrl, days = 4) => {
  const requirements = await extractRequirements(jobDescription);
  let allQuestions = [];
  let currentPass = 1;
  const maxPasses = 2;
  let uncoveredIds = [];

  const pass1Questions = await generateQuestions(requirements, allQuestions.length);
  allQuestions = [...allQuestions, ...pass1Questions];

  while (currentPass <= maxPasses) {
    uncoveredIds = checkCoverage(requirements, allQuestions);
    if (uncoveredIds.length === 0) break;
    if (currentPass === maxPasses) break;
    currentPass++;
    const missingRequirements = requirements.filter(r => uncoveredIds.includes(r.id));
    const pass2Questions = await generateQuestions(missingRequirements, allQuestions.length);
    allQuestions = [...allQuestions, ...pass2Questions];
  }

  const flashcards = allQuestions.map((q, i) => ({
    id: `f${i + 1}`,
    front: q.prompt,
    back: q.answer_outline,
    requirement_ids: q.requirement_ids || [],
    confidence: 0
  }));

  const scheduleDays = [];
  const qPerDay = Math.ceil(allQuestions.length / days);
  for (let i = 0; i < days; i++) {
    const qForDay = allQuestions.slice(i * qPerDay, (i + 1) * qPerDay);
    scheduleDays.push({
      day: i + 1,
      focus: 'General Prep',
      question_ids: qForDay.map(q => q.id),
      minutes: qForDay.length * 15
    });
  }

  return {
    source: {
      company: 'Acme Corp',
      company_url: companyUrl || 'https://example.com',
      role: 'Software Engineer',
      location: 'Remote',
      jd_chars: jobDescription?.length || 0,
      researched_at: new Date().toISOString(),
      pages_used: [companyUrl || 'https://example.com']
    },
    company_brief: {
      summary: 'A fast-paced tech company.',
      what_they_do: 'Build software solutions.',
      sources: [companyUrl || 'https://example.com']
    },
    role: {
      title: 'Software Engineer',
      seniority: 'Mid/Senior',
      responsibilities: ['Write code', 'System design'],
      requirements: requirements || []
    },
    questions: allQuestions,
    flashcards: flashcards,
    schedule: {
      days_available: days,
      days: scheduleDays
    },
    coverage: {
      uncovered_requirement_ids: uncoveredIds,
      passes: currentPass
    }
  };
};
