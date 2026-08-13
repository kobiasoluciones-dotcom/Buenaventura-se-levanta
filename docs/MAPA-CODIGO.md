# Mapa de código — Buenaventura SE LEVANTA

Documento obligatorio y sensible (política corporativa 4.4). Se actualiza en el mismo
commit que cualquier cambio de estructura. Primera fuente de consulta antes de explorar
el código.

## Visión general

App Node.js + Express que sirve una API JSON de solo lectura desde archivos en `data/`,
y un frontend vanilla JS (`public/`) que la consume. Sin base de datos ni autenticación
todavía — v1 pensada para lanzar en días, no semanas (ver README, sección "Estado actual").

```
server.js              → entry point. Monta /api y sirve public/ como estático.
routes/api.js           → un endpoint GET por sección de contenido, todos de solo lectura.
services/contenidoService.js → lee y parsea los JSON de data/. Único punto que toca el filesystem.
data/*.json             → contenido fuente. Cada archivo tiene un bloque "_meta" con el
                           campo "ultima_revision_por_equipo" — hoy en null en todos, es
                           el flag de que nada ha pasado revisión humana real todavía.
public/index.html        → estructura de la página, una sección por bloque de contenido.
public/js/app.js         → hace fetch a /api/* y renderiza cada sección. Sin frameworks.
public/css/estilos.css   → tokens de color/tipografía propios del proyecto (no la paleta
                           corporativa de producto Kobia — ver Documento de Concepto, sección 3:
                           este portal usa voz ciudadana, sin marca visible, en esta fase).
prompts/*.md             → prompts de IA para curaduría interna (resumen de boletines,
                           detección de duplicados, señales de fraude). Ninguno está
                           conectado a la API de Claude todavía — son texto editable,
                           listos para cuando se construya el pipeline de automatización.
```

## Flujo de una petición

1. El navegador carga `public/index.html`.
2. `public/js/app.js` hace `fetch('/api/...')` por cada sección, en paralelo.
3. `routes/api.js` recibe la petición y llama a `services/contenidoService.js`.
4. `contenidoService.js` lee el JSON correspondiente de `data/` y lo devuelve tal cual.
5. El frontend renderiza — sin build step, sin transpilación.

## Decisiones de arquitectura que hay que conocer antes de tocar esto

- **JSON en vez de Supabase, por ahora.** Decisión deliberada por velocidad de lanzamiento
  (ver conversación de concepto). Cuando se migre: `contenidoService.js` es el único
  archivo que debería cambiar — las rutas y el frontend no deberían enterarse.
- **Ningún dato financiero o de cifras se muestra sin su fuente.** Esto está en el frontend
  (`elFuente()` en `app.js`) y en la estructura de cada JSON (`fuente`, `fuente_tipo`,
  `fecha_corte`). Si agregas contenido nuevo, respeta ese patrón — es el principio rector
  del proyecto, no un detalle de estilo.
- **`nota_verificacion` en `directorio-ayuda.json`** marca iniciativas que vienen de fuente
  secundaria (capturas de WhatsApp) sin confirmación directa del equipo. No quitar ese campo
  sin que alguien del equipo confirme la iniciativa por otro canal.
- **`influencers_y_personalidades` en `cuentas-y-voces.json` está vacío a propósito.**
  No llenar con nombres sin verificación real — ver la nota `_meta` dentro del mismo archivo.

## Qué NO existe todavía (a propósito, ver README)

Autenticación, panel de administración, base de datos, cualquier llamada real a la API de
Claude, red de corresponsales, vista por barrio, buscador de IA público.
