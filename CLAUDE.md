# CLAUDE.md — Buenaventura SE LEVANTA

Memoria viva del proyecto. Léelo antes de tocar código o contenido.

## Qué es este proyecto

Portal ciudadano de información verificada para la emergencia sísmica de Buenaventura
(sismo M7.4, 10 de agosto de 2026). Iniciativa de Kobia Inteligencia Ancestral S.A.S,
pensada con voz ciudadana en esta fase — no como producto de marca Kobia (ver Documento
de Concepto, sección 3). El concepto completo, con todo el razonamiento detrás de cada
decisión, está en `Buenaventura SE LEVANTA - Documento de Concepto.md` en la raíz del
proyecto — léelo primero si vas a tomar decisiones de alcance o contenido.

## Principio rector — no negociable

> Lo volátil se enlaza con fuente y fecha; lo estable se afirma con nombre propio;
> lo no verificado se marca explícitamente como tal.

Cualquier cifra, cuenta bancaria, o afirmación sobre una organización que agregues al
proyecto debe seguir este patrón. No es un detalle de estilo — es la razón por la que
este portal es distinto a los flyers sin fuente que circulan en WhatsApp.

## Estado actual

Ver `README.md` (estado y pendientes) y `docs/MAPA-CODIGO.md` (estructura técnica,
actualízalo en el mismo commit si cambias la estructura).

v1 en JSON estático (`data/`), sin base de datos, sin autenticación, sin IA conectada
todavía. Es deliberado — se prioriza lanzar en días dado el contexto de emergencia
(ver Documento de Concepto, sección 11, y el hilo de conversación donde se decidió
recortar alcance: red de corresponsales, JAC/Consejos Comunitarios, vista por barrio y
buscador de IA público quedaron fuera de esta versión).

## Reglas específicas de este proyecto

- **Sin emojis, siempre SVG inline** (política corporativa — ya aplicado en `app.js`
  vía el objeto `ICONOS`).
- **Ninguna llamada a la API de Claude desde el frontend.** Los `prompts/*.md` están
  listos para un pipeline de curaduría interna (server-side), nunca se exponen al
  público ni se llaman con llave desde `public/`.
- **Ningún dato en `data/*.json` se considera publicable hasta que su campo
  `ultima_revision_por_equipo` tenga una fecha real.** Hoy todos están en `null`.
- **`directorio-ayuda.json` y `cuentas-y-voces.json` contienen datos financieros y
  nombres de personas/organizaciones reales.** Verificar antes de dar por buena
  cualquier edición ahí — un error aquí puede desviar una donación real.

## Próximos pasos técnicos (ver README para el detalle completo)

1. Revisión humana de todo el contenido en `data/`.
2. Panel de administración simple para editar sin tocar JSON a mano.
3. Migrar de JSON a Supabase cuando el flujo de edición esté validado.
4. Desplegar en Render.
