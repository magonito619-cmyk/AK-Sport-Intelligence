# AK Sports Intelligence V4.1

Plataforma de rendimiento deportivo (HTML + CSS + JS puro, sin dependencias).

## Abrir en VS Code
1. `File > Open Folder…` y elige esta carpeta.
2. Instala la extensión **Live Server** (se sugiere automáticamente) y pulsa *Go Live*.
   (Con doble clic en `index.html` también funciona, salvo el modo offline/PWA, que requiere http/https.)

## Estructura
- `index.html` — marcado y SEO
- `css/styles.css` — estilos
- `js/i18n.js` — idiomas (ES/EN), fechas y moneda por región. Añade idiomas en `DICTS`.
- `js/app.js` — lógica de la aplicación
- `sw.js`, `manifest.webmanifest`, `icon.svg` — PWA instalable / offline

## Publicar
Cualquier hosting estático (Netlify, Vercel, GitHub Pages) sirve. Recomendado añadir cabecera CSP y HTTPS.
