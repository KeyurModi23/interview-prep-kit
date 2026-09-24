import { extractMetadata } from './extractor.js';
import { generateQuestions } from './generator.js';
import { checkCoverage } from './coverage.js';
import { scrapeCompanyContext } from '../services/scraperService.js';

export const runPipeline = async (jobDescription, companyUrl, days = 4) => {
  const companyContext = await scrapeCompanyContext(companyUrl);
  const metadata = await extractMetadata(jobDescription, companyContext);
  
  const requirements = metadata?.role?.requirements || [];
  let allQuestions = [];
  let currentPass = 1;
  const maxPasses = 2;
  let uncoveredIds = [];

  if (requirements.length > 0) {
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
  }

  const flashcards = allQuestions.map((q, i) => ({
    id: `f${i + 1}`,
    front: q.prompt,
    back: q.answer_outline,
    requirement_ids: q.requirement_ids || [],
    confidence: 0
  }));

  const scheduleDays = [];
  const qPerDay = Math.ceil(allQuestions.length / days) || 0;
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
      company: metadata?.source?.company || 'Unknown',
      company_url: companyUrl || '',
      role: metadata?.source?.role || 'Unknown',
      location: metadata?.source?.location || 'Unknown',
      jd_chars: jobDescription?.length || 0,
      researched_at: new Date().toISOString(),
      pages_used: [companyUrl || '']
    },
    company_brief: {
      summary: metadata?.company_brief?.summary || 'No summary available',
      what_they_do: metadata?.company_brief?.what_they_do || 'Unknown',
      sources: [companyUrl || '']
    },
    role: {
      title: metadata?.role?.title || 'Unknown',
      seniority: metadata?.role?.seniority || 'Unknown',
      responsibilities: metadata?.role?.responsibilities || [],
      requirements: requirements
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
