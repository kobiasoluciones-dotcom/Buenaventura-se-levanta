# Mapa de código — Buenaventura SE LEVANTA

Documento obligatorio y sensible. Se actualiza en el mismo commit que cualquier
cambio de estructura. Primera fuente de consulta antes de explorar el código.

## Visión general

Dos aplicaciones independientes, cada una con su propio despliegue, comunicadas solo
por la API pública del backend:

```
backend (raíz)          →  Express + Supabase, sirve /api, /admin y archivos estáticos heredados
frontend/                →  Next.js 16 / React 19, consume /api vía NEXT_PUBLIC_API_BASE_URL
```

## Backend (raíz del repositorio)

```
server.js                    → entry point. CORS propio para /api, redirige "/" al frontend.
routes/
  api.js                     → endpoints públicos, solo lectura, sin autenticación.
  admin.js                   → endpoints del panel, todos detrás de requiereAdmin.
services/
  supabaseClient.js          → único cliente de Supabase (service_role), todo lo demás lo importa de aquí.
  contenidoService.js        → lee de Supabase, reconstruye la forma de JSON que espera el frontend.
  adminContenidoService.js   → lee/escribe para la pestaña "Archivos de contenido" del panel.
  publicacionesService.js    → CRUD de flyers/video/enlaces (tabla sismo_publicaciones) + Storage.
  boletinesService.js        → CRUD de boletines oficiales (tabla sismo_boletines_oficiales) + Storage.
  adminAuthService.js        → login del panel, sesión en memoria (se pierde al reiniciar el proceso).
  fechaUtil.js                → fechaHoyColombia() — usar siempre esto, nunca new Date().toISOString() a secas.
middleware/
  requiereAdmin.js           → valida la cookie de sesión del panel.
data/*.json                  → HEREDADO, ya no es la fuente de datos real (ver "Historia" abajo).
public/
  admin/                     → panel interno (index.html, admin.css, admin.js). Zona exclusiva del backend.
  index.html, css/, js/      → HEREDADO, ya no es la interfaz pública (ver "Historia" abajo).
prompts/*.md                 → prompts de curaduría con IA, texto sin conectar a la API de Claude todavía.
supabase/migrations/*.sql    → se corren a mano en el Editor SQL de Supabase (no hay conexión directa configurada).
scripts/migrar-a-supabase.js → migración única, ya ejecutada, se conserva como referencia.
scripts/tests/*.test.js      → npm test desde la raíz.
```

## Frontend (`frontend/`)

Next.js estándar, App Router. Estructura normal de Next.js — nada especial que
documentar aparte de:

```
frontend/app/page.tsx        → el diseño/contenido aprobado. No rediseñar sin que te lo pidan.
frontend/app/layout.tsx      → fuentes vía next/font/google (portable, no tocar el mecanismo).
frontend/app/globals.css     → estilos del diseño aprobado.
frontend/public/media/       → imágenes aprobadas (flyers reales + fotos de "esperanza/comunidad").
frontend/.env.local          → NEXT_PUBLIC_API_BASE_URL, apunta al backend. No committear.
frontend/tests/rendered-html.test.mjs → levanta next start real y confirma que responde. npm test desde frontend/.
```

## Flujo de una petición pública

1. El navegador carga el frontend (Next.js, desplegado aparte).
2. El frontend hace `fetch` a `{NEXT_PUBLIC_API_BASE_URL}/api/...`.
3. `server.js` aplica CORS (solo orígenes en `ALLOWED_ORIGINS`) y enruta a `routes/api.js`.
4. `routes/api.js` llama a `services/*Service.js`, que consulta Supabase con la
   `service_role key` (nunca sale del backend).
5. Supabase devuelve filas; los servicios las reensamblan a la forma de JSON que el
   frontend espera (ver contrato de contenido en `docs/HANDOFF-AGENTES.md`).

## Decisiones de arquitectura que hay que conocer antes de tocar esto

- **Supabase, no archivos.** `data/*.json` queda como referencia histórica de la forma
  original de los datos, pero `contenidoService.js` ya no lee de ahí — lee de las
  tablas `sismo_*`. Si vas a agregar un campo nuevo, hazlo en la tabla y en el
  servicio, no en el JSON.
- **Archivos subidos van a Supabase Storage** (bucket `sismo-archivos`), nunca a
  disco local — en Render el filesystem no persiste entre despliegues.
- **Todo dato mostrado debe conservar su fuente y fecha visibles.** Es el principio
  rector del proyecto completo (ver CLAUDE.md), no un detalle de estilo.
- **El frontend es un proyecto Next.js portátil a propósito.** Se migró desde
  Vinext/Cloudflare Workers el 14 de agosto de 2026 específicamente para poder
  desplegarse en Render — no reintroducir dependencias de Cloudflare (Wrangler, D1,
  `@cloudflare/vite-plugin`) sin una razón de arquitectura explícita y discutida.

## Historia — por qué hay archivos "heredados"

La v1 (agosto 2026) se construyó con `data/*.json` y un frontend HTML/CSS/JS plano en
`public/`, pensado para lanzar en días. Un agente de diseño externo entregó después un
diseño aprobado como aplicación Next.js separada (`frontend/`), y el proyecto migró de
JSON a Supabase en paralelo. `public/index.html` original y su variante `_premium` ya
fueron eliminados; lo que queda en `public/` fuera de `admin/` es principalmente el
panel y algunos recursos sin limpiar todavía — no asumir que es la cara pública del
sitio.

## Qué NO existe todavía (a propósito)

Conexión real a la API de Claude desde los prompts de curaduría, autenticación
individual en el panel (es una sola contraseña de equipo), despliegue en Render (los
dos servicios corren solo localmente hasta ahora), red de corresponsales, vista por
barrio, buscador de IA público — ver `Buenaventura SE LEVANTA - Documento de
Concepto.md` para el razonamiento completo detrás de qué quedó fuera de alcance.
