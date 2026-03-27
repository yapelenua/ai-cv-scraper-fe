# CV-to-Job Analyzer — Frontend

Frontend part of the CV-to-Job Analyzer web application.
Allows users to upload a CV, provide a job description, and receive an AI-powered compatibility analysis.

---

## Stack

- Vue 3 + TypeScript
- Element Plus
- Axios
- Vite
- Docker
- GCP Cloud Run

---

## Local Setup

**1. Clone the repository**
```bash
git clone <repository_url>
cd ai-cv-scraper-fe
```

**2. Create `.env` file**
```env
VITE_BASE_URL=your_backend_url
```

**3. Install dependencies**
```bash
npm install
```

**4. Run**
```bash
npm run dev
```

App will be available at `http://localhost:5173`

---

## Project Structure
```
src/
  agents/        # API service calls
  components/    # Vue components
  helpers/       # Utility functions
  types/         # TypeScript types
  main.ts        # Entry point
  App.vue        # Root component
public/          # Static assets
Dockerfile       # Docker configuration
.env             # Environment variables (not committed)
```

---

## Deployment

Deployed to **GCP Cloud Run** via GitHub Actions on push to `main`.

Required GitHub secrets and variables:

| Name             | Type     | Description              |
|------------------|----------|--------------------------|
| `GCP_SA_KEY`     | Secret   | GCP Service Account JSON |
| `GCP_PROJECT_ID` | Variable | GCP project ID           |
| `ARTIFACT_REPO`  | Variable | Artifact Registry repo   |
| `REGION`         | Variable | GCP region               |
| `VITE_BASE_URL`  | Variable | Backend URL              |