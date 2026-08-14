# Continuidad del desarrollo para agentes

## Objetivo

Este repositorio reúne el producto completo de **Buenaventura se levanta** para
evitar trabajos aislados: el diseño público aprobado, el backend Express, el panel
de actualización y la infraestructura Supabase deben evolucionar como un solo
sistema compatible.

## Decisiones ya aprobadas

1. La interfaz de `frontend/` es la única referencia visual del portal.
2. Los antiguos `public/index.html` y `public/index_premium.html` fueron descartados.
3. El panel existente en `/admin` se conserva como herramienta de edición.
4. Supabase es la fuente única de datos y de archivos dinámicos.
5. La clave `SUPABASE_SERVICE_ROLE_KEY` existe solo en el backend.
6. El frontend consulta exclusivamente la API pública con
   `NEXT_PUBLIC_API_BASE_URL`.
7. Si el API falla, el frontend muestra contenido de respaldo, pero ese contenido
   no reemplaza la fuente administrable.

## Código y referencias

| Elemento | Ubicación canónica |
| --- | --- |
| Diseño aprobado | `frontend/app/page.tsx` y `frontend/app/globals.css` |
| Recursos visuales aprobados | `frontend/public/media/` |
| Configuración del frontend | `frontend/.env.example` |
| Backend y API | `server.js`, `routes/`, `services/` |
| Panel administrativo | `public/admin/` y rutas `/admin/api/*` |
| Migraciones Supabase | `supabase/migrations/` |
| Migración de datos y archivos | `scripts/migrar-a-supabase.js` |
| Contrato funcional | `docs/INTEGRACION-DISENO-SUPABASE.md` |
| URL de ambientes | `docs/ENTORNOS.md` |

La versión visual originalmente aprobada se publicó en:
<https://buenaventura-se-levanta.millerocoro.chatgpt.site> (requiere inicio de
sesión con ChatGPT — plataforma "Sites" de origen, ya no es el destino de
despliegue).

El código incorporado en `frontend/` corresponde al estado de integración del
frontend identificado originalmente por el commit
`ed58691022f861421fc32d3b3a9db3510af595d5`.

La primera integración del backend quedó identificada por el commit
`50a6f3d3b114831f026dceee8c0ef4ab4bf6dd87`.

**Migración a Next.js estándar (14 de agosto de 2026)**: `frontend/` se movió de
Vinext/Cloudflare Workers a Next.js estándar (`next dev`/`build`/`start`) para
poder desplegarse en Render junto al backend. Se confirmó, antes de quitar nada,
que `db/`, `examples/d1/`, `drizzle.config.ts`, `worker/index.ts` y
`app/chatgpt-auth.ts` no tenían ninguna referencia desde `app/page.tsx` ni
`app/layout.tsx` — el diseño y el contenido no cambiaron, solo la herramienta de
build. `app/layout.tsx` ya usaba `next/font/google` (mecanismo estándar de
Next.js), por lo que las fuentes cargan igual o mejor que antes.

## Contrato de contenido

| Datos del panel/Supabase | Presentación en el portal |
| --- | --- |
| Cifras oficiales | Franja de emergencia y bloque de cifras |
| `ofrecimientos` | Filtro **Puedo ayudar** |
| `puntos-acopio` | Filtro **Puntos de acopio** |
| `necesidades` | Filtro **Necesito ayuda** |
| `salud` | Filtro **Salud** |
| `registro-visual` | Registro visual |
| `noticias` | Actualidad e historias |
| Verificaciones | Bloque Verificado/Falso |
| Boletines | Fuentes oficiales |
| Contactos de emergencia | Líneas telefónicas |

## Regla de coordinación

Una función no se considera terminada si solo cambia una capa. Cuando corresponda,
el mismo trabajo debe incluir:

- esquema o migración de Supabase;
- servicio y ruta del backend;
- control de edición del panel;
- consumo y estado visual del frontend;
- pruebas y actualización de este contrato.

## Próximo paso de despliegue

Registrar la URL pública del backend en `docs/ENTORNOS.md`, configurar esa misma URL
como `NEXT_PUBLIC_API_BASE_URL` del frontend y agregar el dominio público del portal
a `ALLOWED_ORIGINS` del backend. Después se debe comprobar una operación completa:
crear o editar desde `/admin`, leer desde `/api` y visualizar el cambio en el portal.
