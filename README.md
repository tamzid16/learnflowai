# LearnFlow AI

> A study workspace that turns lecture notes and PDFs into summaries, flashcards, quizzes, short questions, study plans, and exam-preparation tasks.

![LearnFlow AI dashboard](./screenshots/dashboard-preview.svg)

## About the project

LearnFlow AI started from a simple idea: students usually have plenty of study material, but turning that material into something useful for revision takes time.

The app lets you upload a PDF, TXT, or Markdown file, or paste notes directly. It then converts the material into a structured study pack so you can revise from one workspace instead of jumping between different tools.

The current version is designed to be easy to run and demo. It includes a local study-generation engine, so no API key or paid AI service is required.

## Features

- Study material upload for PDF, TXT, and Markdown files
- Paste notes directly into the workspace
- Concise study summaries
- Important-topic extraction
- Interactive flashcards
- Multiple-choice quizzes with scoring and explanations
- Short-answer practice questions
- Personalized study plans
- Exam-preparation mode
- Progress dashboard
- Dark and light themes
- Responsive layout for desktop and mobile
- Animated interface with Framer Motion
- Browser persistence for the latest study session

## Tech stack

| Technology | Purpose |
| --- | --- |
| Next.js | App framework and API routes |
| React | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive layout |
| Framer Motion | UI animations |
| Lucide React | Icons |
| pdf-parse | Server-side PDF text extraction |
| localStorage | Local study-session persistence |

## How it works

1. Upload a PDF, TXT, or Markdown file, or paste your notes.
2. The server extracts and cleans the text.
3. The study engine identifies useful sentences and recurring concepts.
4. A structured study pack is generated from the material.
5. The dashboard presents the result as summaries, topics, flashcards, quizzes, questions, study plans, and exam tasks.
6. Your progress is tracked while you work through the material.

## Run locally

### Requirements

Install a recent LTS version of Node.js before running the project.

### Setup

```bash
git clone https://github.com/YOUR-USERNAME/learnflow-ai.git
cd learnflow-ai
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

If PowerShell blocks `npm`, you can use:

```powershell
npm.cmd install
npm.cmd run dev
```

## Project structure

```text
learnflow-ai/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── learnflow-app.tsx
│   ├── logo.tsx
│   ├── section-title.tsx
│   ├── sidebar.tsx
│   ├── stat-card.tsx
│   ├── study-views.tsx
│   ├── theme-toggle.tsx
│   ├── topbar.tsx
│   └── upload-panel.tsx
├── lib/
│   ├── demo-content.ts
│   ├── study-engine.ts
│   ├── types.ts
│   └── utils.ts
├── public/
├── screenshots/
├── LICENSE
├── package.json
└── README.md
```

## Study engine

The repository works without an external AI provider. The current study engine runs locally on the server and uses deterministic text processing to identify recurring concepts, rank useful sentences, and generate the study pack.

This keeps the demo free, private, and easy to run.

For a production version, `lib/study-engine.ts` can be replaced with an LLM-backed implementation while keeping the same `StudyPack` data structure and frontend.

## Future improvements

- Connect an LLM for richer summaries and question generation
- User authentication
- Multiple courses and saved study packs
- Database persistence
- Spaced-repetition flashcards
- Quiz difficulty levels
- OCR support for scanned PDFs
- Downloadable revision sheets
- Study streaks and weekly analytics
- Course folders and organization

## Repository description

```text
AI-powered learning workspace that transforms study materials into summaries, quizzes, flashcards and personalized study plans.
```

## Suggested GitHub topics

```text
nextjs typescript react edtech ai-study-tool flashcards quiz study-planner tailwindcss portfolio-project
```

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
