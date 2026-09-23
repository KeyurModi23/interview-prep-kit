import dotenv from 'dotenv';
dotenv.config();

import { runPipeline } from '../src/pipeline/orchestrator.js';

const dummyJD = `
Senior Backend Engineer
We are looking for a Senior Backend Engineer to join our team.

Responsibilities:
- Build and maintain scalable APIs using Node.js and Express.
- Design database schemas using MongoDB.
- Mentor junior engineers.

Requirements:
- 5+ years of experience with Node.js (Must have)
- Deep knowledge of MongoDB and Mongoose (Must have)
- Experience with AWS or GCP (Nice to have)
- Strong communication and mentoring skills (Must have)
`;

const test = async () => {
  try {
    const result = await runPipeline(dummyJD);
    console.log('\n=== FINAL PIPELINE OUTPUT ===');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
};

test();
