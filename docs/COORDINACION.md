# Coordinación — Claude (lógica/backend) y agente de diseño (visual)

Tablero de estado compartido. No es chat en tiempo real — cada agente lo lee antes de
empezar a trabajar, y lo actualiza cuando termina algo que el otro necesita saber.
Ninguno de los dos puede avisarle al otro directamente — el humano es quien reenvía
"revisa este archivo" de un lado al otro.

**Regla base de convivencia** (ver también `docs/BRIEF-DISENO.md`): Claude no toca
`public/index.html`, `public/css/`, `public/js/app.js`, ni nada dentro de `public/`
que el agente de diseño esté editando activamente. El agente de diseño no toca
`server.js`, `routes/`, `services/`, `middleware/`, `data/*.json`. `public/admin/` es
zona exclusiva de Claude (panel interno, con su propio CSS/JS aislado).

---

## Estado — 13 de agosto de 2026

### Construido por Claude, disponible para usar ya

- **API pública de contenido** (`routes/api.js`): `/api/cifras-oficiales`,
  `/api/contactos-emergencia`, `/api/directorio-ayuda`, `/api/plataformas`,
  `/api/verificado-falso`, `/api/como-solicitar-ayuda-oficial`, `/api/cuentas-y-voces`,
  `/api/registro-visual`. Todas de solo lectura, JSON, sin autenticación.

- **API de publicaciones (flyers y video reales)** — nueva:
  `GET /api/publicaciones?seccion=ofrecimientos|puntos-acopio|registro-visual`.
  Devuelve cada publicación con: `titulo`, `descripcion`, `nivel_confianza`
  (oficial/institucional/colectivo/individual), `tipo_presentacion`
  (`alojado` con `archivo` servible directo, o `tarjeta_enlace` con `url_externa`),
  `fecha_publicado`. El equipo las carga desde `/admin/` (pestaña "Publicaciones") —
  sube el archivo real o pega un enlace externo, con vista previa antes de publicar.

- **Panel de administración** (`/admin/`) — el equipo de Kobia edita cifras/contactos/
  directorio de ayuda sin tocar JSON a mano, y publica flyers/video reales.

### Pendiente de construir — le corresponde al agente de diseño

- **Sección "Equipos de socorro"** en la página pública — el endpoint
  `/api/contactos-emergencia` ya tiene datos reales (líneas nacionales y locales de
  Buenaventura), pero nada en `public/index.html` lo muestra todavía. Ver detalle
  completo en `docs/BRIEF-DISENO.md`.

- **Renderizar "Publicaciones" en la página pública** — las secciones "Ofrecimientos"
  y "Puntos de acopio" no existen aún en `public/index.html`/`app.js`. Deben consumir
  `GET /api/publicaciones?seccion=...` y mostrar la imagen/video o la tarjeta de
  enlace como contenido principal (no como texto que resume el flyer — el flyer/video
  real es el contenido). Ver conversación sobre tipos de flyer para el criterio de qué
  va en cada sección.

### Pendiente de construir — le corresponde a Claude, no bloquea al agente de diseño

- Conectar los prompts de `prompts/*.md` a la API de Claude de verdad (hoy son texto
  sin usar).
- Revisión humana real del contenido en `data/*.json` (todos con
  `ultima_revision_por_equipo: null`).
- Preparar despliegue en Render.

---

## Actualización Claude — 13 de agosto de 2026 (noche)

- **Nueva API de boletines oficiales**: `GET /api/boletines?nivel_gobierno=alcaldia|departamento|nacion`.
  Documentos/imágenes originales de la Alcaldía, la Gobernación del Valle o entidades
  nacionales (distinto de `cifras-oficiales.json`, que son solo los números ya
  extraídos). Cada boletín trae `entidad`, `titulo`, `descripcion`, `archivo` (imagen o
  PDF — si es PDF, `tipo_archivo` viene como `"documento"`), `fecha_del_boletin` (la
  fecha del documento) y `fecha_publicado`. Se sube desde `/admin/`, pestaña "Boletines
  oficiales". **Aún no se renderiza en la página pública** — igual que con
  Publicaciones, eso le corresponde al agente de diseño.

- **Bug corregido que puede interesarte**: en `public/admin/admin.css` había una regla
  `.ph-layout { display: flex }` que le ganaba en la cascada a `[hidden]`, así que
  ocultar un panel con el atributo `hidden` no funcionaba de verdad si el elemento
  también tenía esa clase. Si `public/index.html`/`estilos.css` usan un patrón parecido
  de pestañas o paneles con `hidden` + una clase con `display` propio, vale la pena
  revisar que no tengan el mismo problema — el arreglo fue agregar
  `[hidden] { display: none !important; }` una sola vez, cerca del top del CSS.

- **Corregido**: las fechas se generaban en UTC (`toISOString()`), lo que después de las
  7pm hora Colombia mostraba el día siguiente. Ahora hay un helper
  (`services/fechaUtil.js`, `fechaHoyColombia()`) que usa `America/Bogota`. Si el
  frontend público calcula o muestra alguna fecha "de hoy" por su cuenta, aplica la
  misma precaución.

## Actualización Claude — cuarta sección: Noticias

- Se agregó **"noticias"** como cuarta sección válida en `data/publicaciones.json`
  (junto a ofrecimientos, puntos-acopio, registro-visual) — mismo mecanismo, sin
  cambios de API. `GET /api/publicaciones?seccion=noticias` ya devuelve contenido real
  (un video de Noticias Caracol sobre el panorama en Cali, Buenaventura y Quibdó, modo
  `tarjeta_enlace`).
- **Pendiente en la página pública**: no existe todavía una sección `#noticias` que
  consuma esto — mismo patrón que ya usaron para `#ofrecimientos` y `#puntos-acopio`,
  solo cambia el valor de `seccion` en la query.

## Actualización Claude — 14 de agosto de 2026 (cierre de sesión)

- Migración 002 de Supabase **confirmada aplicada** (probado insertando y borrando
  una fila de prueba con `seccion: 'necesidades'`).
- `CLAUDE.md` y `docs/MAPA-CODIGO.md` reescritos por completo para reflejar la
  arquitectura real actual (Supabase + backend Express + frontend Next.js
  independiente) — estaban desactualizados desde antes de la migración a Supabase.
- Pendiente para la próxima sesión, de cualquier agente: desplegar backend y
  frontend en Render, registrar las URL en `docs/ENTORNOS.md`, y con eso completar
  `NEXT_PUBLIC_API_BASE_URL` / `ALLOWED_ORIGINS` con los valores reales en vez de
  localhost.

## Actualización Claude — 14 de agosto de 2026 (despliegue en Render)

- `render.yaml` agregado en la raíz (Blueprint con los dos servicios) y desplegado
  desde el dashboard de Render, workspace `KobiaSoluciones`, rama `diseno-visual`.
  URL reales ya registradas en `docs/ENTORNOS.md`.
- **Funciona, pero no es confiable todavía** — confirmado en navegador que el
  frontend sí muestra cifras reales en vivo desde el backend (CORS y
  `NEXT_PUBLIC_API_BASE_URL` están bien). El bloqueador real es que el
  workspace de Render tiene la facturación sin resolver (usuario sin fondos
  por ahora), lo que causa caídas/reinicios intermitentes del backend — detalle
  y checklist en `docs/ENTORNOS.md`.
- Próxima sesión/agente: no dar por hecho que el portal público en
  `buenaventura-frontend.onrender.com` responde de forma sostenida sin antes
  revisar si se resolvió la facturación en `docs/ENTORNOS.md`.

## Cómo actualizar este archivo

Agrega una entrada con fecha cuando termines algo que el otro necesita saber, o cuando
dejes algo pendiente que el otro debería tomar en cuenta antes de seguir.

---

## Actualizacion agente de diseno - 13 de agosto de 2026

- Pagina publica actualizada para mostrar **Equipos de socorro** cerca del inicio: nueva seccion `#equipos-socorro`, contenedor `#bloque-contactos`, funcion `cargarContactosEmergencia()` consumiendo `GET /api/contactos-emergencia`.
- Pagina publica actualizada para mostrar **Publicaciones reales**: secciones `#ofrecimientos` (`#bloque-ofrecimientos`) y `#puntos-acopio` (`#bloque-puntos-acopio`), ambas consumen `GET /api/publicaciones?seccion=...`.
- Si no hay publicaciones cargadas todavia, se muestra estado vacio explicito; no se inventan flyers ni se resume contenido inexistente.
- Se agrego hero visual humano de resiliencia comunitaria en `public/img/hero-comunidad-ayuda.png`. Es imagen representativa, no registro visual verificado de danos.

## Actualizacion agente de diseno - sistema visual

- Se reemplazo la hoja visual por un sistema coherente de emergencia ciudadana: tokens, hero, cifras, contactos, ayudas, publicaciones, verificacion y enlaces.
- Se creo un sistema interno de iconos en `public/js/app.js` con `TRAZOS_ICONOS`, `icono()` e `ICONOS`; todos los iconos renderizados por JS comparten viewBox, trazo, clases `.icon` y nombres semanticos.
- Contactos de emergencia ahora usan iconos contextuales por servicio: fuego, escudo, cruz, gota, energia, corazon, WhatsApp, telefono y entidad.
- La seccion de equipos de socorro se redisenó para verse como modulo operativo de emergencia, no como grilla decorativa.
