# Ambientes y URL públicas

Este archivo registra únicamente direcciones públicas. No guardar aquí claves,
contraseñas, tokens ni valores de `service_role`.

| Componente | Proveedor | URL |
| --- | --- | --- |
| Portal visual (origen del diseño aprobado) | ChatGPT Sites | <https://buenaventura-se-levanta.millerocoro.chatgpt.site> (requiere sesión ChatGPT — ya no es el destino de despliegue) |
| Frontend (Next.js, destino real) | Render | Pendiente de registrar |
| Backend Express/API | Render | Pendiente de registrar |
| Panel administrativo | Mismo despliegue del backend | `{BACKEND_PUBLIC_URL}/admin` |
| API pública | Mismo despliegue del backend | `{BACKEND_PUBLIC_URL}/api` |

El frontend se migró de Vinext/Cloudflare a Next.js estándar (ver
`docs/HANDOFF-AGENTES.md`) específicamente para poder desplegarse en Render junto
al backend, en vez de depender de la plataforma "Sites" de origen.

Cuando se confirmen las URL de Render, sustituir `BACKEND_PUBLIC_URL` y actualizar:

- `NEXT_PUBLIC_API_BASE_URL` en el ambiente del frontend;
- `PUBLIC_SITE_URL` y `ALLOWED_ORIGINS` en el ambiente del backend;
- las pruebas de disponibilidad de `/api/cifras-oficiales` y `/admin`.
