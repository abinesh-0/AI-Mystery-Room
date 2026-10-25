# AI Mystery Room

A full-stack, evidence-driven detective game. The React client talks to an Express API that stores cases in MongoDB and uses Google Gemini to create structured investigations. The canonical culprit and solution stay server-side until the player submits an accusation.

## Requirements

- Node.js 20 or later and npm
- MongoDB (local or hosted)
- Google Gemini API key

## Start locally

1. Copy `.env.example` to `.env` in the project root and fill in `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.
2. Install dependencies from the project root: `npm install`.
3. Start the API and Vite client together: `npm run dev`.
4. Open `http://localhost:5173`. The API health check is at `http://localhost:4000/api/v1/health`.

For production, run `npm run build` then `npm start`. Configure `CLIENT_URL` and the environment variables for your deployment. The API serves only JSON; serve the generated `client/dist` through your hosting provider or a reverse proxy.

## Architecture

- `client/`: React, Vite, React Router, responsive investigation interface.
- `server/`: Express API, Mongoose models, JWT auth, Gemini generation, ownership checks.
- The generation service asks Gemini for schema-constrained JSON and validates relationships before persisting a case. Generation failures mark the case failed; retry is explicit and never falls back to fabricated case results.
- Case list/detail responses omit the private solution. Only completed cases include the solution reveal.

See `spec.md` for the product specification and acceptance criteria.
