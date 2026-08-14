# Ambientes y URL públicas

Este archivo registra únicamente direcciones públicas. No guardar aquí claves,
contraseñas, tokens ni valores de `service_role`.

| Componente | Proveedor | URL |
| --- | --- | --- |
| Portal visual (origen del diseño aprobado) | ChatGPT Sites | <https://buenaventura-se-levanta.millerocoro.chatgpt.site> (requiere sesión ChatGPT — ya no es el destino de despliegue) |
| Frontend (Next.js, destino real) | Render | <https://buenaventura-frontend.onrender.com> |
| Backend Express/API | Render | <https://buenaventura-backend.onrender.com> |
| Panel administrativo | Mismo despliegue del backend | <https://buenaventura-backend.onrender.com/admin> |
| API pública | Mismo despliegue del backend | <https://buenaventura-backend.onrender.com/api> |

El frontend se migró de Vinext/Cloudflare a Next.js estándar (ver
`docs/HANDOFF-AGENTES.md`) específicamente para poder desplegarse en Render junto
al backend, en vez de depender de la plataforma "Sites" de origen. Ambos servicios
se crearon el 14 de agosto de 2026 vía Blueprint (`render.yaml` en la raíz del
repo), workspace `KobiaSoluciones`, rama `diseno-visual`.

## Estado: desplegado y funcional, pero NO confiable (14 de agosto de 2026)

Confirmado en navegador (dos navegadores distintos, sin caché): el frontend
carga y muestra cifras reales tomadas en vivo del backend (`NEXT_PUBLIC_API_BASE_URL`
y `ALLOWED_ORIGINS`/CORS sí están bien configurados). El problema no es de
configuración — es de disponibilidad:

**Facturación de Render sin resolver** (`Payment failed` en el workspace,
usuario sin fondos para actualizar la tarjeta por ahora). Efecto observado por
`curl` repetido: el backend entra en un ciclo de caída/reinicio — responde bien
varios segundos y luego devuelve 404 con header `x-render-routing: no-server`
(Render no tiene ninguna instancia corriendo en ese momento), de forma
intermitente e impredecible. Hasta que se actualice el método de pago en
Render → Settings → Billing, ninguno de los dos servicios es confiable para
uso público sostenido, aunque en un momento dado sí puede verse funcionando
bien.

Nota menor, no bloqueante: `GET /` del backend redirige a
`https://buenaventura-se-levanta.millerocoro.chatgpt.site` (el default de
`.env.example`) en vez de a `https://buenaventura-frontend.onrender.com` — falta
poner `PUBLIC_SITE_URL` en el ambiente del backend en Render. No afecta al
frontend (que no depende de esta ruta), solo a quien entre directo a la URL del
backend en el navegador.

### Pendiente para dejar esto operativo (retomar cuando se resuelva la facturación)

1. Render → Billing → actualizar método de pago, confirmar que el banner
   "Payment failed" desaparece y que el servicio deja de caerse
   intermitentemente (`curl` repetido a `/api/cifras-oficiales` debe dar 200
   siempre, no alternar con 404).
2. Servicio `buenaventura-backend` → Environment → agregar
   `PUBLIC_SITE_URL=https://buenaventura-frontend.onrender.com` (cosmético, ver
   nota arriba).
