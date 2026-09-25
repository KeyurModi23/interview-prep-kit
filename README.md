# Interview Preparation Kit Generator

## Project Overview
This application turns a job description and a company URL into a highly personalized, interactive interview preparation kit. It leverages AI to research the company, extract core job requirements, and generate a comprehensive study plan, including flashcards, a structured day-by-day study schedule, and targeted interview questions.

### Chosen Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS v4. (Chosen for seamless server-side rendering, fast development, and responsive utility-first styling).
- **Backend**: Node.js, Express.js. (Chosen for lightweight, fast API routing).
- **Database**: MongoDB (via Mongoose). (Chosen for flexible, document-based storage of complex, nested kit JSON structures).
- **LLM**: Google Gemini API (`gemini-2.5-flash`). (Chosen for its generous free tier, fast inference times, and robust structured JSON output capabilities).
- **Web Scraping**: Cheerio. (Chosen for lightweight, fast HTML parsing without the overhead of a headless browser).

## Setup Instructions

### Local Setup
1. Clone the repository: `git clone https://github.com/KeyurModi23/interview-prep-kit.git`
2. Navigate into the backend and install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create a `.env` file in the `backend` directory (reference `.env.example`):
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/alphabin
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```
4. Start the backend: `npm run dev`
5. In a new terminal, navigate to the frontend:
   ```bash
   cd frontend
   npm install
   ```
6. Start the frontend: `npm run dev`
7. The application will be running at `http://localhost:3000`.

### Deployed Environment
- The application is configured to be deployed on Vercel (Frontend) and Render (Backend).
- Set `NEXT_PUBLIC_API_URL` on Vercel to point to your live Render backend URL.
- Ensure `SameSite=None; Secure` cookies are enabled in the backend for cross-origin authentication.

### Batch Entry Point (Evaluate Script)
To run the automated pipeline over a set of job descriptions without the UI:
```bash
cd backend
npm install
npm run evaluate -- --input <path-to-cases.json> --output <path-to-kits.json>
```
*Note: Ensure your `.env` is configured with `GEMINI_API_KEY` before running.*

## High-Level Architecture
The architecture is decoupled into a clear client-server model.
- **Client**: Next.js handles UI rendering, state management (optimistic UI updates), and user interactions.
- **Server**: Express handles JWT authentication, API routing, and validation.
- **LLM Service**: A dedicated service layer (`llmService.js`) orchestrates prompt chaining, schema validation, and fallback logic when the Gemini API is rate-limited.
- **Scraper**: A lightweight crawler module fetches the company URL, extracts `<p>`, `<h1>`, and `<h2>` tags, and trims whitespace to feed context to the LLM.

## Retrieval Approach & Sources
- **Strategy**: The application uses an Axios + Cheerio scraper to fetch the provided Company URL. It specifically looks for textual content that describes the company's mission, values, and engineering culture.
- **Sources**: Currently, it relies on the direct URL provided by the user (usually the careers page, about page, or homepage) and extracts the raw DOM text.
- **Handling Failures**: If the URL times out, returns a 404, or is blocked by CORS/Bot-protection, the scraper gracefully catches the error and falls back to generating the kit based *only* on the Job Description, ensuring the pipeline never fatally crashes.

## Sequencing Research & Generation
Instead of a single "mega-prompt", the generation is broken into a strict sequence:
1. **Extraction**: The LLM isolates the `must` and `nice` requirements from the raw JD.
2. **Retrieval**: The scraper fetches the company URL context.
3. **Generation**: The LLM uses the Requirements + Company Context to generate a Company Brief, Role Breakdown, Question Bank (categorized), and Flashcards.
4. **Validation**: The backend verifies the output against the expected JSON schema.
5. **Coverage Pass (The Second Pass)**: The backend compares the generated `question_ids` against the extracted `requirement_ids`. If any "must-have" requirement lacks a question, the LLM is prompted again specifically to generate questions for those missing IDs.
6. **Arithmetic Scheduling**: The Node.js server (not the LLM) divides the total generated questions by the user's requested `days`, allocating them evenly into daily arrays.

## State Management (Generated vs. Edited)
- **Frontend State**: The `KitManager` component holds the master state. When a user edits a flashcard or adds a question, the state is mutated locally for an instant UI response (optimistic update), and a debounced `PUT /api/v1/kits/:id` request silently syncs the data to MongoDB.
- **Regeneration**: If a user regenerates a specific section, only that slice of the JSON is overwritten by the API response. User-added items retain stable unique IDs (generated via `Date.now()`), ensuring they are not accidentally wiped during partial regenerations.

## Schedule Allocation
The schedule is strictly arithmetic and executed via JavaScript logic:
1. The total pool of generated question IDs is shuffled.
2. The total is divided by `days_available` to determine questions per day.
3. A loop maps over the days, shifting IDs from the pool and assigning an estimated integer duration (e.g., 15 minutes per question). Must-have requirements are guaranteed to be in the pool.

## Key Design Decisions & Trade-offs
- **LLM Choice**: Gemini 2.5 Flash was chosen specifically for its speed and its native `response_mime_type: "application/json"` capability, drastically reducing JSON parsing errors compared to older models.
- **Cheerio over Puppeteer**: To ensure the backend remains lightweight and deploys easily on free-tier platforms like Render, I opted for Cheerio. *Trade-off:* It cannot execute JavaScript, so SPAs may return empty content, but it prevents severe memory timeouts during the batch evaluation.
- **Optimistic Auto-Save**: To meet the requirement of making the interface feel "immediate", edits do not show a loading spinner. They instantly update the UI while syncing in the background.

## Known Limitations
- The crawler is naive and respects basic `fetch`, meaning advanced bot-protection (e.g., Cloudflare) will block it.
- Rate limits on the Gemini Free Tier (15 RPM) can cause the Batch Evaluator to throttle. A basic retry/backoff mechanism handles minor limits, but a massive batch file may require an API key upgrade.
