# Workflow de n8n — Aviso de mensajes entrantes de WhatsApp

Cuando alguien escribe al número secundario (el del botón de la web), Meta
manda un webhook a n8n; este workflow **verifica la firma de Meta** y, si es un
mensaje real, te envía un **WhatsApp a tu número principal** con quién escribió
y qué dijo. Así te enteras en tu línea principal aunque la cuenta esté en el
teléfono secundario.

Flujo (dos disparadores, mismo URL):

- `Webhook GET → Check verify token → Token valid? → Respond challenge / 403`
  (handshake de verificación que Meta hace una sola vez al dar de alta el URL).
- `Webhook POST → Verify signature → Signature valid? → Extract message →
  Has message? → Notify primary (WhatsApp template) → Respond 200`
  (firma inválida → `Respond 401`; callbacks de estado sin mensaje →
  `Respond 200 (ignored)` sin avisar).

## 0. Requisito previo importante

Pasar el número a la **WhatsApp Business Cloud API** lo **saca de la app normal
de WhatsApp** (pasa a ser solo-API). Solo hazlo si te compensa: a cambio tienes
notificación automatizada, registro y posibilidad de auto-respuesta. Necesitas
una **Meta Business / WhatsApp Business Platform** con una app y un número
registrado en la Cloud API.

## 1. Importar

n8n → **Workflows → Import from File** → `whatsapp-notify.skeleton.json`.

## 2. Variables de entorno en n8n

El Code node usa `crypto` y lee secretos con **`$env`** (en n8n 2.x el task
runner aísla `process`). En EasyPanel → servicio n8n → Environment:

```
WHATSAPP_VERIFY_TOKEN=<cadena inventada por ti>   # la repites en Meta (paso 4)
WHATSAPP_APP_SECRET=<App Secret de tu app de Meta>
WHATSAPP_TOKEN=<access token de la Cloud API (Bearer)>
WHATSAPP_PHONE_NUMBER_ID=<phone_number_id del número emisor>
WHATSAPP_NOTIFY_TO=<tu número principal en E.164, p.ej. 346XXXXXXXX>
WHATSAPP_TEMPLATE_NAME=<nombre de la plantilla aprobada (paso 3)>
WHATSAPP_TEMPLATE_LANG=es                          # opcional, por defecto es
N8N_BLOCK_ENV_ACCESS_IN_NODE=false                 # permite leer $env en Code nodes
NODE_FUNCTION_ALLOW_BUILTIN=crypto                 # permite require('crypto')
```

Tras añadir/cambiar variables, **redeploy** del contenedor. Verifica con un Code
node: `return [{ json: { ok: Boolean($env.WHATSAPP_APP_SECRET) } }];` → `ok:true`.

> El **App Secret** y el **token** son secretos: van solo en el entorno de n8n,
> nunca en este repo.

## 3. Crear la plantilla (obligatorio)

Como el aviso lo **inicia el negocio**, Meta exige una **plantilla aprobada**.
En **WhatsApp Manager → Templates → Create template**:

- **Category:** Utility
- **Name:** p.ej. `nuevo_lead_web` (este nombre va en `WHATSAPP_TEMPLATE_NAME`)
- **Language:** Spanish (`es`) — debe coincidir con `WHATSAPP_TEMPLATE_LANG`
- **Body** con **3 variables**, en este orden:

  ```
  📩 Nuevo mensaje en WhatsApp desde la web.
  De: {{1}} ({{2}})
  Mensaje: {{3}}
  ```

  El workflow rellena `{{1}}`=nombre, `{{2}}`=número, `{{3}}`=texto del mensaje.

La aprobación de Meta tarda de minutos a ~24-48h. Hasta que esté **Approved**,
el envío fallará.

## 4. Conectar el webhook en Meta

1. Activa el workflow (toggle **Active**) y copia la **Production URL** del nodo
   *Webhook messages (POST)*: `https://<tu-n8n>/webhook/whatsapp-inbound`.
   (El nodo GET comparte el mismo URL; Meta usa GET para verificar y POST para
   los mensajes.)
2. En Meta → tu app → **WhatsApp → Configuration → Webhook → Edit**:
   - **Callback URL:** el URL de arriba.
   - **Verify token:** el mismo valor que `WHATSAPP_VERIFY_TOKEN`.
   - Guarda → Meta hace el GET de verificación; debe quedar en verde.
3. En **Webhook fields**, suscríbete a **`messages`**.

## 5. Payload que envía Meta (resumen)

```json
{
  "entry": [{
    "changes": [{
      "value": {
        "contacts": [{ "profile": { "name": "Ada" }, "wa_id": "346..." }],
        "messages": [{ "from": "346...", "id": "wamid...", "timestamp": "...",
                       "type": "text", "text": { "body": "Hola, me interesa..." } }]
      }
    }]
  }]
}
```

Los callbacks de **estado** (entregado/leído) llegan con `statuses` en vez de
`messages`: el workflow los ignora (responde 200 sin avisarte).

## 6. Probar

- **Verificación (paso 4.2):** al guardar en Meta debe ponerse en verde. Si da
  error, revisa que `WHATSAPP_VERIFY_TOKEN` coincide y que el workflow está
  **Active**.
- **Firma inválida:** un POST manual sin la cabecera `x-hub-signature-256` →
  responde **401** y no envía nada.
- **End-to-end:** escribe desde otro teléfono al número secundario → en segundos
  debe llegarte el WhatsApp de plantilla a tu número principal.

## 7. Notas

- Responder **200** rápido a todos los POST es obligatorio; si no, Meta reintenta
  y puede desactivar el webhook. El workflow ya responde 200 también a los
  eventos que ignora.
- Para mensajes **no de texto** (imagen, audio, etc.) el aviso muestra `[image]`,
  `[audio]`… en lugar del texto.
- Este archivo no contiene secretos: solo la estructura. Tokens y secretos viven
  en el entorno de n8n.
```
