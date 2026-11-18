# Datos pendientes de confirmar por Adelante

Todos están en `src/content/site.ts`, marcados con `// PENDIENTE`. Hoy se muestran con valores de ejemplo.

## Organización
- [ ] **CUIT** de la Asociación Civil (hoy: "a confirmar")
- [ ] **Número de personería jurídica** (hoy: "a confirmar")
- [ ] **¿La donación es deducible de Ganancias?** (exención ARCA/AFIP) → ajustar la respuesta de la FAQ
- [ ] **Cantidad de voluntarios** (ejemplo: 60)
- [ ] **Años de trabajo en los barrios** (ejemplo: 8)
- [ ] **E-mail de contacto** (ejemplo: contacto@adelante.org.ar)

## Donaciones
- [ ] **Montos de donación única** e impactos (provisorios: $10.000, $25.000, $50.000, $100.000)
- [ ] **Monto mínimo** de "Otro monto" (provisorio: $3.000)
- [ ] **Alias y CBU** para transferencia (hoy: "a confirmar")
- [ ] Credenciales de Mercado Pago de la cuenta de Adelante (prueba y producción) y clave secreta de webhooks

## Contenido
- [ ] Textos de los 3 programas (ETEC, Mentes Curiosas, Adelante Futuro) y qué financia cada uno
- [ ] 2–3 testimonios reales con nombre de pila, foto y autorización (hoy: Laura, Martín y Sofía, de ejemplo)
- [ ] Porcentajes reales de uso de fondos (ejemplo: 50 / 25 / 15 / 10)
- [ ] Link al **informe de impacto**
- [ ] Links a **Términos y condiciones** y **Política de privacidad**

## Imágenes
- [ ] Logo (`public/logo.png`)
- [ ] Foto principal (`public/hero.jpg`)
- [ ] Fotos de los programas (`public/programas/*.jpg`)
- [ ] Fotos de testimonios (`public/testimonios/*.jpg`)
- [ ] Imagen para compartir en WhatsApp (`public/og.jpg`)

## Medición
- [ ] ID del Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`)
- [ ] ID de Google Tag Manager (`NEXT_PUBLIC_GTM_ID`)

## Operación
- [ ] Base de datos definitiva para guardar donaciones (hoy: JSON, se borra en Vercel)
- [ ] Quién recibe y procesa los pedidos de baja del formulario (hoy quedan guardados, sin aviso por e-mail)
