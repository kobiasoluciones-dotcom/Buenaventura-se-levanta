# Integración del diseño aprobado con Supabase y el panel

## Decisión canónica

- **Interfaz pública:** diseño aprobado de “Buenaventura se levanta”.
- **Edición:** panel Express en `/admin`.
- **Fuente única de datos:** tablas `sismo_*` de Supabase.
- **Archivos:** bucket público `sismo-archivos`; solo el backend puede escribir.
- **Lectura pública:** API Express en `/api`; el navegador nunca recibe la clave `service_role`.
- Los antiguos `public/index.html` e `public/index_premium.html` no forman parte del producto final.

## Flujo sincronizado

1. El equipo inicia sesión en `/admin` con `ADMIN_PASSWORD`.
2. El panel crea o actualiza contenido mediante `/admin/api/*`.
3. El backend valida los datos, escribe en Supabase y sube archivos a Storage.
4. Las rutas GET `/api/*` leen las mismas tablas.
5. El diseño aprobado consume esas rutas mediante `NEXT_PUBLIC_API_BASE_URL`.

## Variables de despliegue

### Backend Express

- `PORT`
- `ADMIN_PASSWORD`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PUBLIC_SITE_URL`
- `ALLOWED_ORIGINS`

### Portal público

- `NEXT_PUBLIC_API_BASE_URL`: URL pública del backend Express, sin barra final.

## Contrato entre panel y diseño

| Sección administrable | Destino visual |
| --- | --- |
| `ofrecimientos` | Filtro “Puedo ayudar” |
| `puntos-acopio` | Filtro “Puntos de acopio” |
| `necesidades` | Filtro “Necesito ayuda” |
| `salud` | Filtro “Salud” |
| `registro-visual` | Registro visual |
| `noticias` | Actualidad / historias |
| Cifras oficiales | Franja de emergencia y bloque de cifras |
| Verificado / falso | Bloque de verificación |
| Boletines | Listado de fuentes oficiales |
| Contactos de emergencia | Líneas telefónicas del portal |

## Puesta en marcha sin duplicar información

1. Ejecutar `supabase/migrations/001_crear_tablas_sismo.sql` en proyectos nuevos.
2. En una base que ya tenga la migración inicial, ejecutar `002_ampliar_secciones_publicaciones.sql`.
3. Crear las variables del backend sin exponer `SUPABASE_SERVICE_ROLE_KEY` al frontend.
4. Ejecutar una sola vez `node scripts/migrar-a-supabase.js`. El script traslada también los archivos locales heredados a Storage.
5. Desplegar el backend y comprobar sus rutas GET.
6. Configurar `NEXT_PUBLIC_API_BASE_URL` en el portal aprobado.
7. Comprobar desde el panel que una actualización aparece en el portal y que su eliminación también se refleja.

## Seguridad

- Las tablas tienen RLS activado y no ofrecen políticas para acceso directo anónimo.
- La clave `service_role` pertenece únicamente al backend.
- El CORS de `/api` acepta solo los dominios enumerados en `ALLOWED_ORIGINS`.
- Las cookies del panel siguen siendo `httpOnly` y `sameSite=strict`.
- La API pública no acepta escrituras.
