# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

This is a SaaS Factory project that generates landing pages for SaaS ideas. The system reads SaaS project data from a Google Sheets database and generates HTML landing pages automatically.

## Architecture

- **build.py**: Main build script that:
  1. Connects to Google Sheets using OAuth2 service account credentials
  2. Reads the last row from the SaaS_Factory_DB spreadsheet
  3. Extracts SaaS details (name, idea, market, core_features, tech_stack, mvp_plan, gtm_plan)
  4. Generates an HTML landing page with the extracted data
  5. Opens the generated landing page in the default browser

- **credentials.json**: Google Sheets API credentials (service account) - required for authentication

- **Saas_Factory**: Large data file (38.3 KB) - purpose needs investigation

## Commands

### Build and Run
```bash
python build.py
```
This will generate `landing.html` from the latest SaaS entry in Google Sheets and open it in your browser.

## Dependencies

The project requires:
- Python 3.x
- gspread (Google Sheets API client)
- oauth2client (for service account authentication)

## Configuration

- **SPREADSHEET_URL**: Points to the Google Sheets database at `1aonmbM3XYTQhGMJ_bX0xsb9vFGG_sdxq42oreTl4d08`
- **SHEET_NAME**: Uses worksheet named "SaaS_Factory_DB"
- Google Sheets API scope includes both Sheets and Drive access

## Output

The script generates `landing.html` with:
- SaaS name as page title
- Sections for: Market, Core Features, Tech Stack, MVP Plan, Go-To-Market strategy
- Simple CSS styling with blue accent color and card-based layout
