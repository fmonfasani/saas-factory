# 🏭 SaaS Factory

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

> Transform your SaaS ideas into beautiful, professional landing pages automatically by connecting with Google Sheets.

SaaS Factory is a powerful tool that bridges the gap between ideation and execution. Simply add your SaaS project details to a Google Sheet, and instantly generate modern, responsive landing pages with professional design and comprehensive information.

---

## 📑 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)
- [Contact](#-contact)

---

## ✨ Features

- 📊 **Google Sheets Integration** - Manage your SaaS database directly in Google Sheets
- ⚡ **Instant Generation** - Generate landing pages in seconds with a single command
- 🎨 **Modern UI** - Beautiful, responsive design built with Next.js 14 and Tailwind CSS
- 📱 **Mobile-First** - Fully responsive layouts that work on any device
- 🔒 **Secure** - OAuth2 authentication for Google Sheets API
- 🚀 **Production Ready** - TypeScript strict mode, ESLint, and modern best practices
- 📈 **Dashboard** - Real-time dashboard to manage all your SaaS projects
- 💰 **Pricing Pages** - Pre-built pricing page templates
- 🔄 **Auto-Refresh** - Update your Sheet and regenerate instantly

---

## 🚀 Demo

### Screenshots

*Coming soon - Add screenshots of your generated landing pages here*

### Live Demo

*Deploy your project and add the link here*

### Video Tutorial

*Add a demo video showing the process from Google Sheets to generated landing page*

---

## 🏗️ Architecture

SaaS Factory consists of two main components:

```
┌─────────────────────┐
│   Google Sheets     │
│   (Database)        │
└──────────┬──────────┘
           │
           │ OAuth2
           ▼
┌─────────────────────┐      ┌─────────────────────┐
│   Python Backend    │◄────►│   Next.js Frontend  │
│   (build.py)        │ API  │   (React + TS)      │
└──────────┬──────────┘      └──────────┬──────────┘
           │                             │
           ▼                             ▼
    landing.html                  Browser (localhost:3000)
```

**Backend (Python):**
- Connects to Google Sheets using service account credentials
- Reads SaaS project data (7 columns)
- Generates static HTML landing pages
- Opens pages in browser automatically

**Frontend (Next.js):**
- Modern React 18 application with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Three main pages: Landing, Dashboard, Pricing
- API integration ready for backend

---

## 📥 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **npm, yarn, or pnpm** - Comes with Node.js
- **Google Cloud Project** with Sheets API enabled
- **Service Account Credentials** (credentials.json)

### Backend Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/saas-factory.git
cd saas-factory
```

2. **Install Python dependencies:**

```bash
pip install gspread oauth2client python-dotenv
```

3. **Set up Google Sheets API:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google Sheets API
   - Create a Service Account
   - Download credentials as `credentials.json`
   - Place `credentials.json` in the root directory

4. **Create `.env` file:**

```bash
# Copy example env file
cp .env.example .env
```

Edit `.env`:

```env
SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
SHEET_NAME=SaaS_Factory_DB
```

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Configure environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
```

4. **Run the development server:**

```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Google Sheets Structure

Your Google Sheet should have the following columns (in order):

| Column | Name | Description | Example |
|--------|------|-------------|---------|
| A | `name` | SaaS product name | "TaskMaster Pro" |
| B | `idea` | Brief description | "AI-powered task management" |
| C | `market` | Target market | "Remote teams, freelancers" |
| D | `core_features` | Key features | "AI scheduling\nTeam collaboration\nAnalytics" |
| E | `tech_stack` | Technologies used | "Next.js, PostgreSQL, OpenAI" |
| F | `mvp_plan` | MVP roadmap | "Phase 1: Basic tasks\nPhase 2: AI features" |
| G | `gtm_plan` | Go-to-market strategy | "Content marketing, Product Hunt launch" |

**Important:** The script reads the **last row** of your sheet, so add new projects at the bottom.

### Environment Variables

#### Backend (.env)

```env
# Google Sheets Configuration
SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_ID/edit
SHEET_NAME=SaaS_Factory_DB
```

#### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google Sheets URL (for UI links)
NEXT_PUBLIC_SPREADSHEET_URL=https://docs.google.com/spreadsheets/d/YOUR_ID/edit
```

---

## 💻 Usage

### Quick Start (Backend)

Generate a landing page from your Google Sheet:

```bash
python build.py
```

This will:
1. Connect to your Google Sheet
2. Read the last row of data
3. Generate `landing.html`
4. Open the page in your default browser

### Quick Start (Frontend)

Run the Next.js application:

```bash
cd frontend
npm run dev
```

Visit:
- Landing page: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Pricing: http://localhost:3000/pricing

### Advanced Usage

#### Custom Output File

Modify `build.py` to change the output filename:

```python
output_file = "my-custom-landing.html"
with open(output_file, "w", encoding="utf-8") as f:
    f.write(html)
```

#### Read Specific Row

Instead of reading the last row:

```python
# Read row 5
row_data = sheet.row_values(5)
```

#### Multiple Landing Pages

Generate pages for all rows:

```python
all_rows = sheet.get_all_values()[1:]  # Skip header
for row in all_rows:
    saas_name = row[0]
    # Generate page for each row...
```

### Production Build (Frontend)

```bash
cd frontend
npm run build
npm start
```

---

## 📁 Project Structure

```
saas-factory/
├── build.py                    # Main Python backend script
├── credentials.json            # Google Sheets API credentials (gitignored)
├── landing.html                # Generated landing page output
├── .env                        # Backend environment variables (gitignored)
├── .env.example                # Backend env template
├── AGENTS.md                   # Qoder agent configuration
├── README.md                   # This file
│
└── frontend/                   # Next.js application
    ├── app/                    # App Router pages
    │   ├── layout.tsx          # Root layout
    │   ├── page.tsx            # Landing page
    │   ├── dashboard/          # Dashboard page
    │   │   └── page.tsx
    │   ├── pricing/            # Pricing page
    │   │   └── page.tsx
    │   └── globals.css         # Global styles
    │
    ├── components/             # React components
    │   ├── navbar.tsx          # Navigation bar
    │   ├── footer.tsx          # Footer component
    │   └── hero-section.tsx    # Hero section
    │
    ├── lib/                    # Utility functions
    │   └── api.ts              # API client
    │
    ├── types/                  # TypeScript definitions
    │   └── index.ts
    │
    ├── public/                 # Static assets
    ├── package.json            # Dependencies
    ├── tsconfig.json           # TypeScript config
    ├── tailwind.config.ts      # Tailwind configuration
    ├── next.config.js          # Next.js configuration
    ├── .env.local              # Frontend env (gitignored)
    └── .env.example            # Frontend env template
```

---

## 🔌 API Reference

### Expected Backend Endpoints

The frontend expects the following API endpoints (to be implemented):

#### Get All SaaS Projects

```http
GET /api/saas
```

**Response:**

```json
[
  {
    "name": "TaskMaster Pro",
    "idea": "AI-powered task management",
    "market": "Remote teams",
    "core_features": "AI scheduling, Collaboration",
    "tech_stack": "Next.js, PostgreSQL",
    "mvp_plan": "Phase 1: Basic features",
    "gtm_plan": "Content marketing"
  }
]
```

#### Get Latest SaaS Project

```http
GET /api/saas/latest
```

**Response:** Single SaaS object

#### Generate Landing Page

```http
POST /api/generate
```

**Response:**

```json
{
  "success": true,
  "url": "/landing.html"
}
```

---

## 🧪 Testing

### Backend Testing

Test the Python script:

```bash
python build.py
```

Verify:
- ✅ Connects to Google Sheets successfully
- ✅ Reads the last row without errors
- ✅ Generates `landing.html`
- ✅ Opens in browser

### Frontend Testing

```bash
cd frontend
npm run lint
```

### Manual Testing Checklist

- [ ] Landing page loads correctly
- [ ] Dashboard fetches and displays data
- [ ] Pricing page renders all plans
- [ ] Mobile responsive on all pages
- [ ] Navigation works between pages
- [ ] Environment variables load correctly

---

## 🐛 Troubleshooting

### Common Issues

#### 1. `FileNotFoundError: credentials.json`

**Problem:** Credentials file not found

**Solution:**
```bash
# Ensure credentials.json is in the root directory
ls credentials.json

# Download from Google Cloud Console if missing
```

#### 2. `gspread.exceptions.SpreadsheetNotFound`

**Problem:** Invalid spreadsheet URL or no access

**Solution:**
- Verify `SPREADSHEET_URL` in `.env`
- Share the Sheet with your service account email
- Check service account has "Editor" permissions

#### 3. `IndexError: list index out of range`

**Problem:** Empty sheet or fewer than 7 columns

**Solution:**
- Ensure your sheet has at least one data row
- Verify all 7 columns are filled
- Check column headers are not being read as data

#### 4. `Module not found: gspread`

**Problem:** Missing Python dependencies

**Solution:**
```bash
pip install gspread oauth2client python-dotenv
```

#### 5. Frontend: `Failed to fetch SaaS data`

**Problem:** API endpoint not implemented yet

**Solution:**
- The backend API endpoints need to be created
- For now, the frontend will show "No SaaS Projects Yet"
- Implement Flask/FastAPI backend to serve the data

---

## 🗺️ Roadmap

### Phase 1: Core Functionality ✅
- [x] Google Sheets integration
- [x] Basic landing page generation
- [x] Next.js frontend structure
- [x] Dashboard page
- [x] Pricing page

### Phase 2: API Integration 🚧
- [ ] Flask/FastAPI backend API
- [ ] RESTful endpoints for SaaS data
- [ ] Real-time data synchronization
- [ ] Authentication system

### Phase 3: Enhanced Features 📋
- [ ] Multiple template options
- [ ] Custom color schemes
- [ ] Logo upload support
- [ ] SEO optimization
- [ ] Analytics integration

### Phase 4: Advanced Capabilities 💡
- [ ] AI-powered content suggestions
- [ ] A/B testing for landing pages
- [ ] Custom domain support
- [ ] Export to various formats (PDF, Figma)
- [ ] Collaboration features

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for frontend code
- Follow PEP 8 for Python code
- Write meaningful commit messages
- Add comments for complex logic
- Update README if you change functionality

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 SaaS Factory

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Authors

- **Federico Monfasani** - *Initial work* - [@YourGitHubUsername](https://github.com/YourGitHubUsername)

---

## 🙏 Acknowledgments

- [gspread](https://github.com/burnash/gspread) - Google Sheets Python API
- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vercel](https://vercel.com/) - Deployment platform
- Google Sheets API for making this integration possible

---

## 📧 Contact

- **GitHub Issues**: [Report a bug or request a feature](https://github.com/yourusername/saas-factory/issues)
- **Email**: your.email@example.com
- **Twitter**: [@YourTwitterHandle](https://twitter.com/YourTwitterHandle)

---

<div align="center">

**[⬆ Back to Top](#-saas-factory)**

Made with ❤️ by the SaaS Factory team

</div>
