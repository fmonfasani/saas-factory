# SaaS Factory Frontend

Modern Next.js 14 frontend for the SaaS Factory project.

## Features

- ⚡ Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 📘 TypeScript for type safety
- 🔗 Google Sheets API integration
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration:
- `NEXT_PUBLIC_API_URL`: Your backend API URL (default: http://localhost:5000)
- `NEXT_PUBLIC_SPREADSHEET_URL`: Your Google Sheets URL

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

### Lint

Check code quality:
```bash
npm run lint
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Dashboard page
│   ├── pricing/           # Pricing page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── navbar.tsx         # Navigation bar
│   ├── footer.tsx         # Footer
│   └── hero-section.tsx   # Hero section
├── lib/                   # Utilities
│   └── api.ts            # API client
├── types/                 # TypeScript types
│   └── index.ts          # Type definitions
├── public/               # Static assets
└── package.json          # Dependencies
```

## Pages

- **Landing (/)**: Main landing page with hero section and features
- **Dashboard (/dashboard)**: User dashboard for managing SaaS projects
- **Pricing (/pricing)**: Pricing plans and FAQ

## API Integration

The frontend connects to the Python backend API. Configure the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### API Endpoints Expected

- `GET /api/saas` - Get all SaaS projects
- `GET /api/saas/latest` - Get latest SaaS project
- `POST /api/generate` - Generate landing page

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `NEXT_PUBLIC_SPREADSHEET_URL`: Google Sheets database URL

## Technologies

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint

## License

MIT
