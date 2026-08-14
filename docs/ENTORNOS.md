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

## Bug encontrado y corregido: `ALLOWED_ORIGINS` apuntaba al dominio viejo (14 de agosto de 2026, noche)

Contradice lo que decía este mismo archivo más arriba ("CORS sí está bien
configurado") — algo lo revirtió después de esa verificación (posiblemente un
redeploy o un reinicio asociado a la facturación pendiente). Detectado porque
un usuario publicó un enlace de TikTok en "Ofrecimientos" desde `/admin` y no
aparecía en la página pública.

**Diagnóstico**: `ALLOWED_ORIGINS` en el servicio `buenaventura-backend` de
Render tenía el dominio viejo de ChatGPT Sites
(`https://buenaventura-se-levanta.millerocoro.chatgpt.site`) en vez del
dominio real del frontend (`https://buenaventura-frontend.onrender.com`). El
backend respondía 200 con los datos correctos, pero sin el header
`Access-Control-Allow-Origin` para el origen real del frontend — el
navegador bloqueaba silenciosamente **todas** las peticiones dinámicas de la
página pública (cifras, contactos, publicaciones, boletines), no solo la
publicación nueva. `curl` sin cabecera `Origin` no lo detecta porque el CORS
lo aplica el navegador, no el servidor — hay que probar con
`curl -H "Origin: https://buenaventura-frontend.onrender.com" ...` o mirar la
consola de un navegador real.

**Corrección**: cambiar `ALLOWED_ORIGINS` en Render → `buenaventura-backend`
→ Environment a `https://buenaventura-frontend.onrender.com`. Si hace falta
mantener también el dominio viejo por alguna razón, separar con coma. Después
de guardar, Render redespliega solo — confirmar con la misma prueba de
`curl -H "Origin: ..."` que el header sí aparece antes de dar por cerrado.
