# VectorShift Pipeline Builder

The app lets users drag workflow nodes onto a React Flow canvas, connect them, add dynamic variables in text nodes, and submit the pipeline to a FastAPI backend for DAG analysis.

## Features

- Reusable node abstraction with shared styling, handles, and delete behavior
- Ten node types: Input, Output, Text, LLM, API Call, Condition, Transform, Note, Merge, and Math
- Dynamic Text node sizing as content grows
- `{{ variable }}` parsing with automatic left-side handles on Text nodes
- Backend pipeline parser that returns node count, edge count, and DAG validity
- Vercel-ready deployment with the React frontend and FastAPI endpoint served from one project

## Tech Stack

- Frontend: React, React Flow, Zustand, Ant Design
- Backend: Python, FastAPI, Pydantic
- Deployment: Vercel

## Project Structure

```txt
.
├── api/
│   └── index.py              # Vercel serverless FastAPI entrypoint
├── backend/
│   └── main.py               # FastAPI app and DAG parser
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── nodes/
│   │   ├── store/
│   │   └── submit.js         # Frontend submit integration
│   └── package.json
├── requirements.txt
└── vercel.json
```

## Local Development

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm start
```

In another terminal, start the backend from the repo root:

```bash
cd backend
uvicorn main:app --reload
```

The frontend runs on `http://localhost:3000` and the backend runs on `http://localhost:8000`.

## Backend API

`POST /pipelines/parse`

Request body:

```json
{
  "nodes": [],
  "edges": []
}
```

Response:

```json
{
  "num_nodes": 0,
  "num_edges": 0,
  "is_dag": true
}
```

## Deployment

This repository includes `vercel.json`, `requirements.txt`, and `api/index.py` so Vercel can build the React app and serve the FastAPI parser at `/pipelines/parse`.

The frontend uses `http://localhost:8000` during local development and same-origin API calls in production. To point the frontend at a custom API URL, set:

```bash
REACT_APP_API_BASE_URL=https://your-api.example.com
```

## Validation

Run the production frontend build:

```bash
cd frontend
npm run build
```
