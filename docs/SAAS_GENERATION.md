# SaaS Generation Feature

This feature allows users to generate SaaS landing pages in real-time by describing their idea in natural language.

## Architecture

The system consists of several components working together:

1. **Frontend Dashboard** - Interface for users to input their SaaS idea
2. **Backend Orchestration Service** - Coordinates the generation process
3. **LLM Service** - Analyzes prompts and extracts SaaS structure
4. **Template Engine** - Generates HTML from templates and data
5. **Real-time Events** - Streams generation progress to the frontend

## Components

### Frontend Components

- `SaaSPromptInput` - Text input for describing SaaS ideas
- `AgentActivityFeed` - Real-time display of agent activities
- `LandingPreview` - Live preview of generated landing pages
- `useEventSource` - Hook for consuming Server-Sent Events

### Backend Services

- `orchestrator.service.js` - Main coordination service
- `llm.service.js` - Language model integration (currently mocked)
- `generate.routes.js` - API endpoints for generation
- `landing-template.html` - HTML template for landing pages

## API Endpoints

- `POST /api/generate/analyze` - Analyze prompt and extract SaaS structure
- `POST /api/generate/landing` - Generate HTML landing page
- `GET /api/generate/status/:jobId` - Get job status
- `GET /api/generate/stream/:jobId` - Stream generation events (SSE)

## Usage

1. Navigate to the Dashboard
2. Enter your SaaS idea in the prompt input
3. Click "Generate SaaS"
4. Watch the agent activity feed for progress updates
5. View the live preview of your generated landing page
6. Download or further customize the HTML as needed

## Development

To test the API endpoints:

```bash
node backend/test-generate-api.js
```

To run the full test suite:

```bash
node backend/test-suite.js
```