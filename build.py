import gspread
from oauth2client.service_account import ServiceAccountCredentials
import webbrowser
import os

# ===========================================
# CONFIGURACIÓN GOOGLE SHEETS
# ===========================================

SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1aonmbM3XYTQhGMJ_bX0xsb9vFGG_sdxq42oreTl4d08/edit?gid=0#gid=0"
SHEET_NAME = "SaaS_Factory_DB"

scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)

sheet = client.open_by_url(SPREADSHEET_URL).worksheet(SHEET_NAME)

# ===========================================
# LEE LA ÚLTIMA FILA DEL SAAS GENERADO
# ===========================================

last_row = sheet.row_values(sheet.row_count)

saas_name      = last_row[0]
idea           = last_row[1]
market         = last_row[2]
core_features  = last_row[3]
tech_stack     = last_row[4]
mvp_plan       = last_row[5]
gtm_plan       = last_row[6]

# ===========================================
# GENERA LANDING HTML CON LOS DATOS DEL SaaS
# ===========================================

html = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{saas_name}</title>
  <style>
    body {{
      font-family: Arial, sans-serif;
      margin: 40px;
      background: #f7f9fc;
      color: #333;
    }}
    h1 {{ color: #0055ff; }}
    .section {{
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }}
  </style>
</head>
<body>

<h1>{saas_name}</h1>
<p>{idea}</p>

<div class="section">
  <h2>Mercado</h2>
  <p>{market.replace("\\n", "<br>")}</p>
</div>

<div class="section">
  <h2>Características Principales</h2>
  <p>{core_features.replace("\\n", "<br>")}</p>
</div>

<div class="section">
  <h2>Stack Tecnológico</h2>
  <p>{tech_stack.replace("\\n", "<br>")}</p>
</div>

<div class="section">
  <h2>MVP Plan</h2>
  <p>{mvp_plan.replace("\\n", "<br>")}</p>
</div>

<div class="section">
  <h2>Go-To-Market</h2>
  <p>{gtm_plan.replace("\\n", "<br>")}</p>
</div>

</body>
</html>
"""

with open("landing.html", "w", encoding="utf-8") as f:
    f.write(html)

# ===========================================
# ABRE EL DEMO EN EL NAVEGADOR
# ===========================================

file_path = os.path.abspath("landing.html")
webbrowser.open(f"file://{file_path}")

print("🎉 Landing generada con éxito:", saas_name)
