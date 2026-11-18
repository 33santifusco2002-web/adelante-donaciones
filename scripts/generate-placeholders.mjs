// Genera imágenes placeholder para el boceto. Reemplazalas por fotos reales
// con el mismo nombre (ver README). Uso: node scripts/generate-placeholders.mjs
import sharp from "sharp";
import { mkdirSync } from "fs";

const out = (p) => new URL(`../public/${p}`, import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

/** Campo tonal con luz suave y grano fotográfico: se lee como "espacio para foto", no como ilustración. */
function photoSlot({ w, h, tones, light = [0.3, 0.35], caption }) {
  const [a, b, c] = tones;
  const fs = Math.round(Math.max(11, Math.min(w, h) * 0.022));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="0.55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>
    <radialGradient id="l" cx="${light[0]}" cy="${light[1]}" r="0.75"><stop offset="0" stop-color="#fff" stop-opacity="0.38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="v" cx="0.5" cy="0.5" r="0.8"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.28"/></radialGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#l)"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
  <rect width="100%" height="100%" filter="url(#n)"/>
  ${caption ? `<text x="${fs * 1.6}" y="${fs * 2.4}" font-family="Consolas, monospace" font-size="${fs}" letter-spacing="1" fill="#fff" fill-opacity="0.7">${caption}</text>` : ""}
</svg>`;
}

async function jpg(path, opts) {
  await sharp(Buffer.from(photoSlot(opts))).jpeg({ quality: 84, mozjpeg: true }).toFile(out(path));
  console.log("✓", path);
}

mkdirSync(out("programas"), { recursive: true });
mkdirSync(out("testimonios"), { recursive: true });

await jpg("hero.jpg", { w: 1600, h: 1200, tones: ["#C9A77A", "#8C6A45", "#3E3424"], light: [0.7, 0.25], caption: "FOTO · ACTIVIDAD EN EL BARRIO" });
await jpg("programas/etec.jpg", { w: 900, h: 675, tones: ["#B9B39A", "#7D7A5E", "#3E3F2E"], caption: "FOTO · TALLER ETEC" });
await jpg("programas/mentes-curiosas.jpg", { w: 900, h: 675, tones: ["#D9BE8E", "#A9834F", "#5A4428"], light: [0.6, 0.3], caption: "FOTO · MENTES CURIOSAS" });
await jpg("programas/adelante-futuro.jpg", { w: 900, h: 675, tones: ["#D6B3A0", "#A07560", "#553A2E"], light: [0.4, 0.2], caption: "FOTO · ADELANTE FUTURO" });
const faces = [["#CDB08F", "#94714F", "#4E3B29"], ["#B7B89F", "#7B7D63", "#3F4131"], ["#D4BBA2", "#A0806A", "#58443A"]];
for (const [i, t] of faces.entries()) await jpg(`testimonios/${i + 1}.jpg`, { w: 240, h: 240, tones: t, light: [0.5, 0.35] });

// Logo placeholder (wordmark)
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="120">
  <text x="0" y="82" font-family="Arial Black, Arial" font-weight="900" font-size="68" letter-spacing="-2" fill="#0B7A1E">adelante</text>
  <circle cx="318" cy="76" r="9" fill="#FFCC00"/></svg>`;
await sharp(Buffer.from(logo)).png().toFile(out("logo.png"));
console.log("✓ logo.png");

// Imagen para compartir (Open Graph 1200x630)
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#FAF7F1"/>
  <rect x="0" y="0" width="14" height="630" fill="#0B7A1E"/>
  <text x="90" y="140" font-family="Arial" font-weight="700" font-size="22" letter-spacing="4" fill="#0B7A1E">ASOCIACIÓN CIVIL ADELANTE · MAR DEL PLATA</text>
  <text x="90" y="260" font-family="Arial Black, Arial" font-size="66" letter-spacing="-2" fill="#17150F">Con tu aporte, 300 familias</text>
  <text x="90" y="345" font-family="Arial Black, Arial" font-size="66" letter-spacing="-2" fill="#17150F">de Mar del Plata</text>
  <text x="90" y="430" font-family="Arial Black, Arial" font-size="66" letter-spacing="-2" fill="#0B7A1E">siguen adelante.</text>
  <rect x="90" y="490" width="250" height="68" rx="8" fill="#FFCC00"/>
  <text x="215" y="533" text-anchor="middle" font-family="Arial" font-weight="700" font-size="26" fill="#17150F">Doná ahora</text></svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile(out("og.jpg"));
console.log("✓ og.jpg");
