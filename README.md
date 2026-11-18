# Adelante – Página de donaciones (boceto funcional)

Propuesta de nueva página de donaciones para la **Asociación Civil Adelante** (Mar del Plata).
Pensada para celulares y para convertir las visitas que llegan desde los anuncios de Meta/Instagram en donaciones.

- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- Mercado Pago (SDK oficial de Node, solo en el servidor): Checkout Pro para donaciones únicas y suscripciones (preapproval) para las mensuales
- **Modo demo**: sin credenciales de Mercado Pago, el pago se simula y lleva a `/gracias`

---

## 1. Correrlo en tu compu

Necesitás Node.js 20 o más nuevo.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrí http://localhost:3000. Con `.env.local` tal como viene, la página funciona en **modo demo**.

> Atención: si cambiás el puerto, actualizá `NEXT_PUBLIC_SITE_URL` en `.env.local`.

---

## 2. Cambiar textos, montos y datos

**Todo** está en un solo archivo: [`src/content/site.ts`](src/content/site.ts).

| Qué querés cambiar | Dónde |
|---|---|
| Montos mensuales / únicos y su impacto | `donation.amounts.mensual` / `donation.amounts.unica` |
| Monto preseleccionado ("Más elegido") | poné `featured: true` en el monto que corresponda (solo uno por frecuencia) |
| Monto mínimo de "Otro monto" | `donation.minAmount` |
| Alias y CBU | `donation.transfer` |
| CUIT, personería, voluntarios, años | `org` |
| Programas, testimonios, uso de fondos | `programs`, `testimonials`, `transparency` |
| Preguntas frecuentes | `faq` |
| Título y descripción para Google/WhatsApp | `seo` |

Cada dato sin confirmar tiene el comentario `// PENDIENTE`. Buscalos con Ctrl+Shift+F → `PENDIENTE`.
La lista completa está en [`PENDIENTES.md`](PENDIENTES.md).

### Imágenes

Reemplazá estos archivos por fotos reales **con el mismo nombre** (JPG o PNG, cualquier tamaño razonable; Next.js las convierte a WebP/AVIF y las optimiza solo):

| Archivo | Uso | Tamaño sugerido |
|---|---|---|
| `public/logo.png` | Logo del header | 400 × 120 (fondo transparente) |
| `public/hero.jpg` | Foto principal | 1600 × 1000 |
| `public/programas/etec.jpg`, `mentes-curiosas.jpg`, `adelante-futuro.jpg` | Tarjetas de programas | 800 × 560 |
| `public/testimonios/1.jpg`, `2.jpg`, `3.jpg` | Fotos de testimonios | 320 × 320 |
| `public/og.jpg` | Imagen al compartir el link (WhatsApp, Facebook) | 1200 × 630 |

Las imágenes actuales son placeholders generados con `node scripts/generate-placeholders.mjs`.
Usá fotos reales del trabajo en los barrios (con autorización de las familias), no fotos de stock.

---

## 3. Variables de entorno

Ver [`.env.example`](.env.example). Resumen:

| Variable | Para qué | ¿Pública? |
|---|---|---|
| `MP_ACCESS_TOKEN` | Crear pagos y suscripciones. **Vacía = modo demo** | No (solo servidor) |
| `MP_PUBLIC_KEY` | Reservada para Checkout Bricks (no se usa todavía) | — |
| `MP_WEBHOOK_SECRET` | Validar la firma `x-signature` de los webhooks | No |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (back_urls, webhooks, Open Graph) | Sí |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (opcional) | Sí |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (opcional) | Sí |
| `NEXT_PUBLIC_DEMO_MODE` | `true` muestra la franja "Boceto de propuesta – datos de ejemplo" | Sí |

El access token **nunca** llega al navegador: solo lo usan los route handlers de `src/app/api`.

---

## 4. Activar Mercado Pago

### 4.1 Modo prueba (sin plata real)

1. Entrá a https://www.mercadopago.com.ar/developers/panel/app con la cuenta de Mercado Pago de Adelante y creá una aplicación (producto: *Pagos online* → *Checkout Pro*; también habilitá *Suscripciones*).
2. En la aplicación, andá a **Cuentas de prueba** y creá dos usuarios: uno **vendedor** y uno **comprador**.
3. Iniciá sesión (en una ventana de incógnito) con el **usuario vendedor de prueba**, entrá a su panel de desarrolladores y copiá sus **credenciales de producción** (`APP_USR-…`). Esas son las que se usan para probar con cuentas de prueba.
   - Alternativa simple para la donación única: usar las *Credenciales de prueba* (`TEST-…`) de tu propia aplicación.
4. Pegalas en `.env.local`:
   ```
   MP_ACCESS_TOKEN=APP_USR-xxxxxxxx   (o TEST-xxxxxxxx)
   MP_PUBLIC_KEY=APP_USR-xxxxxxxx
   ```
5. Mercado Pago **no acepta `localhost`** como URL de retorno ni de webhook. Para probar el ida y vuelta completo:
   - lo más fácil: desplegá en Vercel (sección 6) y probá ahí, o
   - exponé tu compu con un túnel HTTPS (`npx cloudflared tunnel --url http://localhost:3000`) y poné esa URL en `NEXT_PUBLIC_SITE_URL`.
6. Reiniciá `npm run dev`, elegí un monto y donale con el **usuario comprador de prueba**.
   - Tarjeta de prueba: Mastercard `5031 7557 3453 0604`, CVV `123`, vencimiento `11/30`, titular `APRO` (aprobado) u `OTHE` (rechazado). DNI `12345678`.
   - Las donaciones mensuales (suscripciones) **requieren** que el e-mail que cargás en el formulario sea el del usuario comprador de prueba.

### 4.2 Producción (plata real)

1. En la aplicación de Adelante, completá los datos para **activar credenciales de producción**.
2. Copiá el access token de producción (`APP_USR-…` de la cuenta real de Adelante) en las variables de entorno de Vercel.
3. Poné `NEXT_PUBLIC_DEMO_MODE=false`.
4. Configurá los webhooks (4.3) y hacé una donación real chica para verificar.

### 4.3 Webhooks (notificaciones de pago)

1. En el panel de la aplicación → **Webhooks** → *Configurar notificaciones*.
2. URL de producción: `https://TU-DOMINIO/api/webhooks/mercadopago`
3. Eventos: **Pagos** y **Planes y suscripciones**.
4. Guardá y copiá la **clave secreta** → variable `MP_WEBHOOK_SECRET`.
5. Con el botón *Simular* del panel podés mandar una notificación de prueba.

El webhook valida la firma `x-signature`, consulta el pago o la suscripción en la API de Mercado Pago y actualiza el estado de la donación (`approved`, `authorized`, `rejected`, `cancelled`, etc.).

---

## 5. Dónde se guardan las donaciones

Cada intento de donación se guarda con nombre, e-mail, celular, monto, frecuencia, estado y **UTMs del anuncio** (para atribuir cada donación a su campaña).

- Implementación actual: un JSON (`data/donations.json` en tu compu; `/tmp` en Vercel, que **se borra** cada tanto).
- Para producción: implementá la interfaz `DonationStore` de [`src/lib/store/types.ts`](src/lib/store/types.ts) con una base real (Vercel Postgres, Supabase, Neon, Google Sheets…) y cambiá una línea en [`src/lib/store/index.ts`](src/lib/store/index.ts).

Los pedidos de baja del formulario de `/baja` se guardan en el mismo lugar (`unsubscribes`).

---

## 6. Deploy en Vercel, paso a paso

1. Subí el proyecto a un repositorio de GitHub (puede ser privado).
2. Entrá a https://vercel.com, iniciá sesión con GitHub → **Add New… → Project** → elegí el repositorio.
3. Framework: Next.js (se detecta solo). No cambies nada del build.
4. En **Environment Variables** cargá las de la sección 3. Para mostrar el boceto alcanza con:
   ```
   NEXT_PUBLIC_DEMO_MODE=true
   NEXT_PUBLIC_SITE_URL=https://adelante-donaciones.vercel.app   (la URL que te dé Vercel)
   ```
5. **Deploy**. En 1–2 minutos tenés el link para compartir.
6. Si después cambiás `NEXT_PUBLIC_SITE_URL` o cualquier variable `NEXT_PUBLIC_…`, hacé **Redeploy** (se leen al compilar).
7. Dominio propio (ej. `donar.adelante.org.ar`): *Settings → Domains*, agregalo y seguí las instrucciones de DNS.

---

## 7. Anuncios: links con todo preseleccionado

```
https://TU-DOMINIO/?frecuencia=mensual&monto=20000&utm_source=meta&utm_medium=paid&utm_campaign=kits-escolares
https://TU-DOMINIO/?frecuencia=unica&monto=25000&utm_source=instagram&utm_campaign=historias
```

- `frecuencia`: `mensual` o `unica`
- `monto`: si coincide con un botón, lo selecciona; si no, lo carga en "Otro monto"
- `utm_*`, `fbclid` y `gclid` se guardan junto con la donación

---

## 8. Medición (Meta Pixel + GTM / GA4)

Pixel y GTM se cargan **de forma diferida** (después de que la página ya es usable) y solo si están las variables.
Todos los eventos van al `dataLayer` (para GA4 vía GTM) y, si hay Pixel, a Meta:

| Paso | Evento | Datos |
|---|---|---|
| Entra a la página | `ViewContent` | frecuencia |
| Cambia mensual/única | `select_frequency` | frequency |
| Elige monto | `select_amount` | value, currency, frequency |
| Pasa al paso 2 | `step_2_view` | value, frequency |
| Va a Mercado Pago | `InitiateCheckout` | value, currency, frequency |
| Error al iniciar el pago | `checkout_error` | value |
| Llega a /gracias | `Donate` y `Purchase` | value, currency `ARS`, frequency, transaction_id |
| Comparte / acepta pasar a mensual | `share_whatsapp`, `upsell_monthly_click` | — |

**Ver dónde abandona la gente:**
- GA4 → *Explorar* → *Exploración de embudo* con los pasos `ViewContent → step_2_view → InitiateCheckout → Purchase`.
- Meta → *Administrador de eventos* → comparar `ViewContent`, `InitiateCheckout` y `Donate`. Optimizá las campañas por `Donate` o `Purchase`.

En GTM creá un activador *Evento personalizado* por cada nombre de evento y una etiqueta de evento de GA4 que envíe `value`, `currency` y `frequency`.

---

## 9. Estructura

```
src/
  content/site.ts            ← TODOS los textos, montos y datos
  app/
    page.tsx                 ← landing
    gracias/ baja/ pago-pendiente/ pago-fallido/
    api/checkout             ← crea preferencia (única) o suscripción (mensual); simula en modo demo
    api/webhooks/mercadopago ← valida firma y actualiza estado
    api/baja                 ← registra pedidos de baja
  components/                ← DonationForm (pasos 1 y 2), Hero/Header, ImpactBar, Programs, etc.
  lib/                       ← analytics, formato de montos, cliente MP, store
```
