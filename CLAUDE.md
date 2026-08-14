# CLAUDE.md — Buenaventura SE LEVANTA

Memoria viva del proyecto. Léelo antes de tocar código o contenido.

## Qué es este proyecto

Portal ciudadano de información verificada para la emergencia sísmica de Buenaventura
(sismo M7.4, 10 de agosto de 2026). Iniciativa de Kobia Inteligencia Ancestral S.A.S,
pensada con voz ciudadana en esta fase — no como producto de marca Kobia (ver Documento
de Concepto, sección 3; Kobia se presenta explícitamente solo en la fase técnica de
evaluación estructural). El concepto completo, con todo el razonamiento detrás de cada
decisión, está en `Buenaventura SE LEVANTA - Documento de Concepto.md` en la raíz del
proyecto — léelo primero si vas a tomar decisiones de alcance o contenido.

## Principio rector — no negociable

> Lo volátil se enlaza con fuente y fecha; lo estable se afirma con nombre propio;
> lo no verificado se marca explícitamente como tal.

Cualquier cifra, cuenta bancaria, o afirmación sobre una organización que agregues al
proyecto debe seguir este patrón. No es un detalle de estilo — es la razón por la que
este portal es distinto a los flyers sin fuente que circulan en WhatsApp.

## Arquitectura actual (14 de agosto de 2026)

Dos partes que se despliegan por separado, comunicadas solo por HTTP/API pública:

- **Backend** (raíz del repo): Node.js + Express. `server.js`, `routes/`, `services/`,
  `middleware/`. Único que toca Supabase (con `service_role`, nunca expuesta). Sirve
  también `public/admin/` (panel interno) y `public/` (recursos heredados, ya no la
  interfaz pública).
- **Frontend** (`frontend/`): Next.js 16 / React 19 estándar (`next dev`/`build`/
  `start`). Es el diseño visual aprobado — **no rediseñar sin que te lo pidan
  explícitamente**. Consume solo `/api/*` vía `NEXT_PUBLIC_API_BASE_URL`, nunca ve
  secretos de Supabase. Migrado el 14 de agosto desde Vinext/Cloudflare Workers (el
  stack original en que lo entregó el agente de diseño) a Next.js estándar,
  específicamente para poder desplegarse en Render — ver
  `docs/HANDOFF-AGENTES.md` para el detalle de qué se quitó y por qué.
- **Datos**: Supabase (Postgres + Storage), proyecto compartido con otros productos
  de Kobia — todas las tablas de este proyecto llevan prefijo `sismo_`. Migraciones en
  `supabase/migrations/`, se corren a mano en el Editor SQL de Supabase (no hay
  conexión directa a la base de datos configurada, solo la `service_role key`).
- **Despliegue**: Render, para las dos partes (backend y frontend), cada uno como su
  propio servicio. Pendiente de desplegar — ver `docs/ENTORNOS.md` para las URL una
  vez existan.

Cadena de actualización única, no crear atajos que la salten:
`panel /admin → backend Express → Supabase → /api → frontend`

## Cómo coordinar con otros agentes en este proyecto

Este repo lo trabajan a la vez un agente de backend/lógica (tú, Claude, vía Claude
Code) y un agente de diseño visual (ChatGPT/Antigravity o similar). No hay canal
directo entre agentes — el humano reenvía mensajes de uno a otro. La coordinación real
pasa por archivos compartidos en el repo:

- `AGENTS.md` — reglas de convivencia y arquitectura, léelo antes de modificar.
- `docs/HANDOFF-AGENTES.md` — decisiones ya aprobadas y estado de continuidad.
- `docs/COORDINACION.md` — tablero de estado más informal, historial de qué hizo cada
  quien y cuándo.
- `docs/INTEGRACION-DISENO-SUPABASE.md` — contrato entre capas.

Zonas exclusivas por convención (evita pisar trabajo en curso): `public/admin/` es
del backend; `frontend/` es del diseño visual (salvo bugs puntuales o que te pidan
explícitamente que lo extiendas).

## Reglas específicas de este proyecto

- **Sin emojis, siempre SVG inline** (política corporativa).
- **Ninguna llamada a la API de Claude desde el frontend.** Los `prompts/*.md` están
  listos para un pipeline de curaduría interna (server-side, aún sin conectar), nunca
  se exponen al público ni se llaman con llave desde `public/` o `frontend/`.
- **Ningún dato se considera publicable hasta que su campo
  `ultima_revision_por_equipo` tenga una fecha real.** Ver tablas `sismo_*` en
  Supabase (antes vivía en `data/*.json`, ya migrado).
- **Las tablas con datos financieros y nombres de personas/organizaciones reales**
  (`sismo_directorio_ayuda`, `sismo_cuentas_y_voces`, `sismo_publicaciones`)
  requieren verificar antes de dar por buena cualquier edición — un error aquí puede
  desviar una donación real.
- **Antes de un `git push`, correr las pruebas**: `npm test` en la raíz (backend) y
  `npm test` en `frontend/`.
- **Zona horaria**: usar siempre `services/fechaUtil.js` (`fechaHoyColombia()`) para
  cualquier fecha "de hoy" — `new Date().toISOString()` da UTC, que después de las
  7pm hora Colombia ya muestra el día siguiente.

## Estado y próximos pasos

Ver `docs/HANDOFF-AGENTES.md` para el estado detallado y `docs/COORDINACION.md` para
el historial. En resumen: backend y frontend funcionan juntos localmente con datos
reales de Supabase, probados de punta a punta. Pendiente: desplegar ambos en Render y
registrar las URL en `docs/ENTORNOS.md`.
