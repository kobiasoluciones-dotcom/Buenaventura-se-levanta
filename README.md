# Buenaventura SE LEVANTA

Portal ciudadano de información verificada sobre la emergencia sísmica en Buenaventura
(sismo del 10 de agosto de 2026). No reemplaza a las autoridades ni a las plataformas
ciudadanas ya existentes — consolida y verifica información dispersa en un solo lugar.

El concepto completo del proyecto (diagnóstico, actores, principios, alcance) está en
[`Buenaventura SE LEVANTA - Documento de Concepto.md`](./Buenaventura%20SE%20LEVANTA%20-%20Documento%20de%20Concepto.md).

## Qué hace

- **Estado ahora**: cifras oficiales, toque de queda — siempre con fuente y fecha.
- **Cómo ayudar**: directorio de donación clasificado por nivel de confianza (oficial /
  institucional / colectivo / individual), con advertencia de fraude visible.
- **Cómo solicitar ayuda oficial**: lo que se sabe del procedimiento, honesto sobre lo
  que aún no está confirmado.
- **Verificado / Falso**: desmentidos específicos de esta emergencia, con fuente.
- **Cuentas y voces**: cuentas verificadas que sí están ayudando.
- **Plataformas útiles**: enlaces a las plataformas ciudadanas y oficiales ya existentes
  — no las duplicamos.

## Cómo ejecutarlo

```bash
npm install
npm start          # producción
npm run dev         # con recarga automática
```

Por defecto corre en `http://localhost:3000`.

## Estado actual

**v1 en construcción** — contenido base cargado desde archivos JSON en `data/`
(ver `docs/MAPA-CODIGO.md`). Sin base de datos todavía: se eligió JSON para lanzar
rápido dado el contexto de emergencia; migrar a Supabase es el siguiente paso natural
cuando el contenido y el flujo de edición del equipo estén validados.

**Pendiente antes de publicar en producción:**
- Revisión humana de cada archivo en `data/` (todos tienen `ultima_revision_por_equipo: null`).
- Confirmar directamente los datos marcados con `nota_verificacion` en `directorio-ayuda.json`.
- Panel de administración para que el equipo edite contenido sin tocar JSON a mano.
- Desplegar en Render.

**Explícitamente fuera de esta versión** (ver Documento de Concepto, secciones 6.1 y 12):
red de corresponsales, alianzas con JAC/Consejos Comunitarios, vista por barrio, buscador de
IA de cara al público. Quedan documentados como dirección futura, no como trabajo pendiente
de esta versión.

## Dependencias

- Node.js 18+
- Express 4
- Sin base de datos externa en esta versión (JSON estático en `data/`)

## Stack

Node.js + Express + Vanilla JS (mismo patrón que KobiaGeotecnia y KobiaEstructurador).
Despliegue previsto: Render.
