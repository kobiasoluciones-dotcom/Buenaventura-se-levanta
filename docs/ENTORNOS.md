# Ambientes y URL públicas

Este archivo registra únicamente direcciones públicas. No guardar aquí claves,
contraseñas, tokens ni valores de `service_role`.

| Componente | Proveedor | URL |
| --- | --- | --- |
| Portal visual aprobado | ChatGPT Sites | <https://buenaventura-se-levanta.millerocoro.chatgpt.site> |
| Backend Express/API | Por confirmar | Pendiente de registrar |
| Panel administrativo | Mismo despliegue del backend | `{BACKEND_PUBLIC_URL}/admin` |
| API pública | Mismo despliegue del backend | `{BACKEND_PUBLIC_URL}/api` |

Cuando se confirme la URL del backend, sustituir `BACKEND_PUBLIC_URL` y actualizar:

- `NEXT_PUBLIC_API_BASE_URL` en el ambiente del frontend;
- `PUBLIC_SITE_URL` y `ALLOWED_ORIGINS` en el ambiente del backend;
- las pruebas de disponibilidad de `/api/cifras-oficiales` y `/admin`.
