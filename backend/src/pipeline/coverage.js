export const checkCoverage = (requirements, questions) => {
  // We only care about covering 'must' requirements
  const mustHaveReqs = requirements.filter(r => r.priority === 'must').map(r => r.id);
  
  // Collect all requirement IDs covered by the questions
  const coveredReqs = new Set();
  questions.forEach(q => {
    q.requirement_ids.forEach(id => coveredReqs.add(id));
  });

  // Find the gaps
  const uncoveredIds = mustHaveReqs.filter(id => !coveredReqs.has(id));
  
  return uncoveredIds;
};
