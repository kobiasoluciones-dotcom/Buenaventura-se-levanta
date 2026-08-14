# Guía canónica para agentes

## Producto aprobado

- El frontend oficial es el código de [`frontend/`](./frontend/).
- La referencia visual aprobada está publicada en:
  <https://buenaventura-se-levanta.millerocoro.chatgpt.site>
- No reconstruir ni sustituir este diseño por los antiguos `public/index*.html`.
- La carpeta `public/` de la raíz contiene únicamente recursos heredados del backend;
  no es la interfaz pública canónica.

## Arquitectura obligatoria

- `frontend/`: portal público Vinext/Next/React. Solo usa
  `NEXT_PUBLIC_API_BASE_URL`; nunca debe recibir secretos de Supabase.
- raíz del repositorio: backend Express, API pública y panel administrativo.
- `/admin`: edición autenticada del contenido.
- `/api/*`: contrato de lectura que consume el frontend.
- Supabase: fuente única de datos y Storage mediante el backend.

Mantener una sola cadena de actualización:

`panel /admin -> backend Express -> Supabase -> /api -> frontend aprobado`

No crear copias paralelas de datos en el frontend. El contenido de respaldo del
frontend solo evita una pantalla vacía si el API está temporalmente fuera de línea.

## Antes de modificar

1. Leer [`docs/HANDOFF-AGENTES.md`](./docs/HANDOFF-AGENTES.md).
2. Leer [`docs/INTEGRACION-DISENO-SUPABASE.md`](./docs/INTEGRACION-DISENO-SUPABASE.md).
3. Consultar [`docs/ENTORNOS.md`](./docs/ENTORNOS.md) para las URL públicas.
4. No añadir `.env`, contraseñas, claves `service_role` ni tokens al repositorio.

## Verificación mínima

- Backend: `npm test` desde la raíz.
- Frontend: `npm test` desde `frontend/`.
- Cualquier cambio de contrato debe conservar o actualizar simultáneamente:
  rutas del API, panel, migraciones de Supabase, tipos/normalizadores del frontend
  y documentación.
