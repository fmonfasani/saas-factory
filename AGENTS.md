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

## Real-time SaaS Generation Feature

The dashboard now includes a real-time SaaS generation feature that allows users to create landing pages by describing their SaaS idea in natural language. This feature uses an orchestration of specialized agents:

- **ai-feature-builder**: Analyzes user prompts and extracts SaaS structure
- **landing-generator**: Generates HTML landing pages from structured data
- **frontend-analyzer**: Provides real-time feedback on the generation process
- **fullstack-integrator**: Coordinates the end-to-end generation workflow

### Components

- **Frontend**: Dashboard interface with prompt input, agent activity feed, and live preview
- **Backend**: Orchestration service that coordinates agent activities and streams progress
- **API**: REST endpoints for prompt analysis, landing page generation, and real-time events

## Commands

### Build and Run
```bash
python build.py
```
This will generate `landing.html` from the latest SaaS entry in Google Sheets and open it in your browser.

### Test API Endpoints
```bash
node backend/test-suite.js
```
Runs comprehensive tests on all API endpoints including the new generation endpoints.

### Test Generate API Only
```bash
node backend/test-generate-api.js
```
Tests only the new SaaS generation API endpoints.

## Dependencies

The project requires:
- Python 3.x
- gspread (Google Sheets API client)
- oauth2client (for service account authentication)
- Node.js and npm (for backend/frontend)
- Express.js (backend framework)
- Next.js (frontend framework)
- Various React components and hooks

## Configuration

- **SPREADSHEET_URL**: Points to the Google Sheets database at `1aonmbM3XYTQhGMJ_bX0xsb9vFGG_sdxq42oreTl4d08`
- **SHEET_NAME**: Uses worksheet named "SaaS_Factory_DB"
- Google Sheets API scope includes both Sheets and Drive access

## Output

The script generates `landing.html` with:
- SaaS name as page title
- Sections for: Market, Core Features, Tech Stack, MVP Plan, Go-To-Market strategy
- Simple CSS styling with blue accent color and card-based layout
- ##  TUS HABILIDADES CLAVE
1.  ** API Discovery (Auto-Descubrimiento):**
    - No esperas una lista de URLs. Entras en la carpeta `backend/src/routes` (o similar), lees los archivos de definición de rutas (`*.routes.js`, `index.js`, etc.) y extraes un mapa mental de la API.
    - Identificas: `Método HTTP` + `Ruta` + `Parámetros requeridos` + `Middleware de Auth`.
2.  ** Generación Dinámica de Tests:**
    - Basado en los endpoints descubiertos, creas al vuelo scripts de prueba (usando `fetch` o `axios`) que cubren:
        - Happy Path (datos correctos).
        - Error Path (datos faltantes, auth inválida).
    - Ejecutas estos scripts para verificar el estado de salud real de la API.
3.  ** Reparación Autónoma:**
    - Si un endpoint devuelve 500 o crash, lees el log de error.
    - Buscas el controlador asociado a esa ruta.
    - Analizas el código, propones el fix y lo aplicas.
###  TU PROTOCOLO DE EJECUCIÓN
Cuando se te pida "Probar todos los endpoints":
**PASO 1: MAPEO**- Ejecuta `ls -R backend/src/routes` para encontrar archivos de rutas.
- Lee cada archivo y extrae las definiciones (ej: `router.post('/signup', ...)`).
- Crea una lista maestra de Endpoints a probar.
**PASO 2: ESTRATEGIA DE PRUEBA**
- Determina el orden lógico (ej: Primero `Signup` para crear usuario -> Luego `Login` para obtener Token -> Luego endpoints protegidos).
- Genera un script de "Smoke Test" que recorra esta secuencia.
**PASO 3: EJECUCIÓN Y FIX**
- Ejecuta el script.
- Si falla el Endpoint A:
    1.  Lee el archivo del controlador correspondiente.
    2.  Identifica el bug (variable indefinida, error de lógica, fallo de DB).
    3.  Aplica la corrección.
    4.  Re-ejecuta la prueba para confirmar.
**REGLA DE ORO:**
Nunca digas "parece que funciona". Ejecuta el código (`run_command`) y muéstrame el output verde ``.