import fs from 'fs/promises';
import path from 'path';
import { runPipeline } from '../src/pipeline/orchestrator.js';

async function evaluate() {
  const args = process.argv.slice(2);
  let inputFile = '';
  let outputFile = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input') {
      inputFile = args[i + 1];
    } else if (args[i] === '--output') {
      outputFile = args[i + 1];
    }
  }

  if (!inputFile || !outputFile) {
    console.error('Usage: npm run evaluate -- --input <cases.json> --output <kits.json>');
    process.exit(1);
  }

  try {
    const rawData = await fs.readFile(path.resolve(inputFile), 'utf-8');
    const cases = JSON.parse(rawData);
    
    if (!Array.isArray(cases)) {
      throw new Error('Input JSON must be an array of cases.');
    }

    const kits = [];
    
    for (const [index, c] of cases.entries()) {
      console.log(`Processing case ${index + 1}/${cases.length}...`);
      const { jobDescription, companyUrl, days } = c;
      
      // We pass the jobDescription to the existing pipeline
      const kit = await runPipeline(jobDescription);
      kits.push({ caseId: c.id || index, ...kit });
    }

    await fs.writeFile(path.resolve(outputFile), JSON.stringify(kits, null, 2));
    console.log(`\nEvaluation complete! Successfully wrote ${kits.length} kits to ${outputFile}`);
    
  } catch (err) {
    console.error('Evaluation failed:', err);
    process.exit(1);
  }
}

evaluate();
