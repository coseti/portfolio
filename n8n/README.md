# Workflow de n8n — Tracking del vídeo de presentación

Registra en una Google Sheet cada evento de visionado de las páginas
`/p/[token]`. La web (`/api/track`) firma cada evento con HMAC-SHA256 y lo
reenvía aquí; este workflow **verifica la firma** y, si es válida, añade una
fila a la hoja.

Flujo: `Webhook → Verify signature → Signature valid? → Append to Sheet → Respond 200`
(si la firma no es válida: `→ Respond 401`).

## 1. Importar

n8n → **Workflows → Import from File** → elige `track-workflow.skeleton.json`.

## 2. Requisitos en tu instancia de n8n

El nodo *Verify signature* usa `crypto` y lee el secreto con **`$env`** (en n8n
2.x el task runner aísla `process`, así que NO se usa `process.env`). En el
entorno de n8n (p. ej. EasyPanel → servicio n8n → Environment) deben estar:

```
N8N_TRACK_SECRET=<mismo valor que en Vercel>   # el secreto a verificar
N8N_BLOCK_ENV_ACCESS_IN_NODE=false             # permite leer $env en Code nodes
NODE_FUNCTION_ALLOW_BUILTIN=crypto             # permite require('crypto')
```

Tras añadir/cambiar variables, **redeploy** del contenedor (sin reiniciar, n8n
no las ve). Verifica con un Code node:
`return [{ json: { ok: Boolean($env.N8N_TRACK_SECRET) } }];` → debe dar `ok: true`.

## 3. Google Sheets

1. Crea una hoja nueva con esta **fila de cabecera** (fila 1), en este orden:

   ```
   occurredAt | company | contact | event | percent | watchedSeconds | duration | token | source
   ```

2. En el nodo **Append to Sheet**:
   - Asigna tu credencial **Google Sheets OAuth2**.
   - `documentId` → el ID de la hoja (de la URL de Google Sheets).
   - `sheetName` → el nombre de la pestaña (p. ej. `Sheet1`).
   - El mapeo es **autoMapInputData**: cada campo del evento cae en la columna
     con el mismo nombre de cabecera.

## 4. Conectar con la web (Vercel)

1. Activa el workflow (toggle **Active**) y copia la **Production URL** del nodo
   Webhook (`https://<tu-n8n>/webhook/presentation-track`).
2. Pégala en Vercel como **`N8N_TRACK_WEBHOOK_URL`** y haz redeploy.

## 5. Payload que recibe el webhook

```json
{
  "token": "…",            // token opaco de la empresa
  "company": "…",          // nombre de la empresa (de PRESENTATION_PROSPECTS)
  "contact": "…",          // persona de contacto (si la hay), si no ""
  "event": "open | play | progress_25 | progress_50 | progress_75 | complete | close",
  "watchedSeconds": 0,      // segundos vistos en ese momento
  "duration": 0,            // duración total del vídeo (s)
  "percent": 0,             // % visto (0-100)
  "occurredAt": "ISO-8601",
  "source": "migueldacal.com-presentation"
}
```

## 6. Probar

- **Smoke test (firma inválida):** manda un POST con cuerpo cualquiera y sin la
  cabecera `X-Webhook-Signature-256` → debe responder **401** y NO escribir fila.
- **End-to-end real:** abre una URL `/p/<token>` y dale al play → deberían
  aparecer filas `open`, `play`, `progress_*`, etc. en la hoja.

> Seguridad: este archivo no contiene secretos ni datos de empresas, solo la
> estructura del workflow. El secreto vive en el entorno de n8n y en Vercel.
