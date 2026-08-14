# Entrega técnica — Buenaventura SE LEVANTA

Documento de estado para revisar compatibilidad antes de integrar el nuevo diseño.
No se hicieron cambios de código para producir este documento — es una foto del
estado real al momento de escribirlo.

## Ubicación

- **Repositorio**: local, `d:\Documentos\KobiaSismo` (no está en GitHub todavía — es
  un repo git local).
- **Rama actual**: `diseno-visual` (creada por el agente de diseño; `master` tiene el
  último commit formal).
- **Último commit**: `c874f3b` — "v1 base: contenido investigado, API, frontend
  funcional sin diseño final". Todo lo construido después (paneles, publicaciones,
  boletines, el nuevo diseño visual) está **sin commitear todavía**, en el árbol de
  trabajo de la rama `diseno-visual`.

## Estructura de archivos

```
KobiaSismo/
├── server.js                    ← entry point (Express)
├── routes/
│   ├── api.js                   ← endpoints públicos, solo lectura
│   └── admin.js                 ← endpoints del panel, requieren autenticación
├── services/
│   ├── contenidoService.js      ← lee data/*.json (cifras, contactos, etc.) — solo lectura
│   ├── adminContenidoService.js ← lee/escribe esos mismos archivos, para el panel
│   ├── publicacionesService.js  ← CRUD de flyers/video/enlaces
│   ├── boletinesService.js      ← CRUD de boletines oficiales
│   ├── adminAuthService.js      ← login del panel (sesión en memoria)
│   └── fechaUtil.js             ← fecha en zona horaria de Colombia
├── middleware/
│   └── requiereAdmin.js         ← valida la cookie de sesión del panel
├── data/                        ← contenido fuente, JSON
│   ├── cifras-oficiales.json
│   ├── contactos-emergencia.json
│   ├── directorio-ayuda.json
│   ├── plataformas.json
│   ├── verificado-falso.json
│   ├── como-solicitar-ayuda-oficial.json
│   ├── cuentas-y-voces.json
│   ├── registro-visual.json
│   ├── publicaciones.json       ← flyers/video/enlaces publicados
│   └── boletines-oficiales.json ← documentos oficiales publicados
├── public/
│   ├── index.html / css/estilos.css / js/app.js   ← sitio público (versión "normal")
│   ├── index_premium.html / css/estilos_premium.css / js/app_premium.js
│   │                                               ← variante del agente de diseño
│   ├── admin/                   ← panel interno (index.html, admin.css, admin.js)
│   └── img/
│       ├── publicaciones/       ← archivos subidos por el equipo (flyers/video)
│       └── boletines/           ← archivos subidos (imágenes o PDF de entidades oficiales)
├── prompts/                     ← prompts de IA para curaduría interna, sin conectar aún
└── docs/
    ├── BRIEF-DISENO.md          ← reglas para el agente de diseño
    ├── COORDINACION.md          ← tablero de estado compartido (léelo, tiene historial)
    └── MAPA-CODIGO.md           ← mapa técnico completo
```

**Nota sobre `public/index_premium.html`**: existe una segunda versión del sitio
(`/premium`), aparentemente creada por el agente de diseño como alternativa visual. No
sé si reemplaza a `index.html` o es exploratoria — vale la pena aclarar cuál es la
versión que se integra antes de avanzar.

## Endpoints implementados

Todos bajo `/api/*` son **públicos, de solo lectura, sin autenticación**:

| Endpoint | Devuelve |
|---|---|
| `GET /api/cifras-oficiales` | Cifras del sismo en Buenaventura + contexto nacional + toque de queda |
| `GET /api/contactos-emergencia` | Líneas nacionales y locales, salud mental, CICR |
| `GET /api/directorio-ayuda` | Iniciativas de donación (texto), con nivel de confianza |
| `GET /api/plataformas` | Enlaces a plataformas ciudadanas y oficiales existentes |
| `GET /api/verificado-falso` | Desmentidos, cada uno con fuente |
| `GET /api/como-solicitar-ayuda-oficial` | Procedimiento conocido (parcial, honesto sobre lo que falta) |
| `GET /api/cuentas-y-voces` | Cuentas/organizaciones verificadas a seguir |
| `GET /api/registro-visual` | Checklist de verificación (hoy sin contenido real) |
| `GET /api/publicaciones?seccion=X` | Flyers/video reales. `X` = `ofrecimientos`, `puntos-acopio`, `registro-visual` o `noticias`. Sin `seccion`, devuelve todos. |
| `GET /api/boletines?nivel_gobierno=X` | Documentos oficiales. `X` = `alcaldia`, `departamento` o `nacion`. Sin el parámetro, devuelve todos. |

**Ejemplo real — `GET /api/publicaciones?seccion=puntos-acopio`:**
```json
[
  {
    "id": "772e80ae-cd82-4027-b001-b6a941106a6b",
    "seccion": "puntos-acopio",
    "tipo_presentacion": "alojado",
    "titulo": "Punto de recepción de donaciones — Calle 70C",
    "descripcion": "Dirección: Calle 70 C # 1J 00. Recibe ropa en buen estado, alimentos no perecederos.",
    "nivel_confianza": "individual",
    "archivo": "/img/publicaciones/1786665778871-b2ed5145.jpeg",
    "tipo_archivo": "imagen",
    "url_externa": null,
    "fecha_publicado": "2026-08-13",
    "publicado_por": "Equipo Buenaventura SE LEVANTA"
  }
]
```

**Ejemplo real — un ítem con enlace externo en vez de archivo propio** (mismo endpoint,
`tipo_presentacion: "tarjeta_enlace"`):
```json
{
  "id": "7fb3ac95-57f4-4ea1-b0da-4466f370869b",
  "seccion": "noticias",
  "tipo_presentacion": "tarjeta_enlace",
  "titulo": "Noticias Caracol — Panorama en Cali, Buenaventura y Quibdó",
  "descripcion": "Así está el panorama en Cali, Buenaventura y Quibdó luego de un poco más de 72 horas del fuerte terremoto en Colombia.",
  "nivel_confianza": "institucional",
  "archivo": null,
  "tipo_archivo": null,
  "url_externa": "https://web.facebook.com/reel/2310606429714229",
  "fecha_publicado": "2026-08-13",
  "publicado_por": "Equipo Buenaventura SE LEVANTA"
}
```

**Ejemplo real — `GET /api/boletines?nivel_gobierno=alcaldia`:**
```json
[
  {
    "id": "46765b29-db6e-4fd0-8245-f04371de63e1",
    "nivel_gobierno": "alcaldia",
    "entidad": "Alcaldía Distrital de Buenaventura",
    "titulo": "Informe de situación y acciones de respuesta tras el sismo",
    "descripcion": "Balance oficial: afectados, viviendas destruidas/averiadas, fallecidos, lesionados y alojamientos temporales habilitados.",
    "archivo": "/img/boletines/1786670286069-7847820e.jpeg",
    "tipo_archivo": "imagen",
    "fecha_del_boletin": "2026-08-12",
    "fecha_publicado": "2026-08-13",
    "publicado_por": "Equipo Buenaventura SE LEVANTA"
  }
]
```

## Modelo de "publicaciones" (flyers, video, enlaces)

Un solo modelo cubre dos formas de presentar contenido:

- **`tipo_presentacion: "alojado"`** — el archivo real (imagen o video) se subió y
  vive en `/img/publicaciones/`. `archivo` es la ruta servible directo; `tipo_archivo`
  es `"imagen"` o `"video"`.
- **`tipo_presentacion: "tarjeta_enlace"`** — no hay archivo propio, solo `url_externa`
  a la publicación original (red social, etc.). `archivo` viene `null`.

Campos compartidos: `seccion` (una de las 4 válidas), `nivel_confianza` (oficial /
institucional / colectivo / individual), `titulo`, `descripcion`, `fecha_publicado`
(zona horaria Colombia), `publicado_por`.

Los **boletines oficiales** son un modelo separado y deliberadamente distinto — no
tienen `nivel_confianza` (todo ahí es oficial por definición), en cambio tienen
`nivel_gobierno` + `entidad` exacta, y soportan PDF además de imagen
(`tipo_archivo: "documento"`).

## Panel administrativo (`/admin/`)

- Tres pestañas: **Archivos de contenido** (editar JSON de cifras/contactos/directorio
  con validación), **Publicaciones** (subir flyer/video o crear tarjeta de enlace, con
  vista previa en vivo antes de publicar), **Boletines oficiales** (subir imagen/PDF
  por nivel de gobierno).
- Todo pasa por autenticación (ver abajo) antes de leer o escribir nada.
- Las escrituras a `data/*.json` son casi-atómicas (archivo temporal + rename) para no
  dejar un JSON a medias si algo falla — importa porque hay cuentas bancarias reales
  en `directorio-ayuda.json`.

## Manejo de archivos y enlaces externos

- **Subida de archivos**: `multer`, guardado en disco (`public/img/publicaciones/` o
  `public/img/boletines/`), nombre único generado por el servidor (timestamp + hash),
  nunca se usa el nombre original del archivo.
- **Límite**: 25MB por archivo.
- **Tipos permitidos**: publicaciones → imagen (jpg/png/webp/gif) o video
  (mp4/webm/mov); boletines → imagen o PDF.
- **Enlaces externos**: no se descargan ni se procesan — se guarda la URL tal cual y
  se muestra como tarjeta con botón "Ver publicación original". No hay embeds de
  redes sociales (decisión deliberada, ver `docs/COORDINACION.md` para el porqué).
- **Eliminar una publicación/boletín** también borra el archivo físico asociado, si
  existe — no deja huérfanos en disco.

## Autenticación

- Panel protegido por **una sola contraseña compartida** (`ADMIN_PASSWORD` en `.env`,
  nunca en el código — ver `.env.example`).
- Sesión: token aleatorio, guardado **en memoria del servidor** (no hay base de datos
  de sesiones), entregado como cookie `httpOnly`, `sameSite: strict`, expira en 12h.
- **Limitación real a tener en cuenta**: al reiniciarse el servidor, todas las
  sesiones activas se invalidan (todos quedan deslogueados). En desarrollo esto pasa
  seguido porque se usa `node --watch` (reinicia con cada cambio de archivo). En
  producción (Render, sin `--watch`) es menos frecuente pero pasa en cada despliegue.
- No hay usuarios individuales — es una contraseña de equipo, no hay registro de quién
  hizo qué cambio.

## Tareas pendientes

**Del lado del diseño/frontend público:**
- Aclarar si `index.html` o `index_premium.html` es la versión que se integra.
- Sección "Equipos de socorro" — confirmar que ya consume `/api/contactos-emergencia`
  (el agente de diseño reportó haberla agregado, no verificado en este documento).
- Secciones "Ofrecimientos" y "Puntos de acopio" — igual, reportadas como agregadas.
- Sección **"Noticias"** — pendiente, `seccion=noticias` ya tiene contenido real listo.
- Sección **"Boletines oficiales"** — pendiente por completo, ninguna vista pública
  todavía.

**Del lado de lógica/backend:**
- Conectar los prompts de `prompts/*.md` a la API de Claude (hoy son texto sin usar).
- Revisión humana real de todo el contenido en `data/*.json` (todos con
  `ultima_revision_por_equipo: null` salvo ediciones de prueba ya revertidas).
- Preparar despliegue en Render (variables de entorno, dominio).
- Nada de esto es urgente ni bloquea la integración visual.

## Decisiones técnicas importantes a respetar

1. **JSON en archivos, no base de datos** — decisión deliberada por velocidad de
   lanzamiento. Migrar a Supabase es un cambio futuro, aislado a la capa de servicios.
2. **HTML/CSS/JS plano, sin build step** — si el nuevo diseño viene de una herramienta
   que genera React (Lovable, por ejemplo), hay que decidir si se adapta a este
   patrón o si se migra la arquitectura completa (discutido, sin resolver todavía).
3. **`public/admin/` es zona exclusiva del backend** — tiene su propio CSS/JS
   aislado, no debería tocarse desde el rediseño visual del sitio público.
4. **Todo dato mostrado debe conservar su fuente y fecha visibles** — es el principio
   rector de todo el proyecto, no un detalle de estilo (ver
   `Buenaventura SE LEVANTA - Documento de Concepto.md`).
5. **Los niveles de confianza/gobierno deben seguir siendo distinguibles
   visualmente** — sin importar cuánto cambie el estilo.
