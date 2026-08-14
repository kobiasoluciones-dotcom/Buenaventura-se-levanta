# Buenaventura se levanta

Portal ciudadano de información, coordinación de ayudas y comunicación verificada
para la emergencia sísmica en Buenaventura.

Este repositorio contiene el sistema completo y sincronizado:

- [`frontend/`](./frontend/): diseño visual aprobado y portal público.
- raíz del repositorio: backend Express, API y panel administrativo.
- [`supabase/`](./supabase/): migraciones de base de datos y Storage.
- [`docs/`](./docs/): arquitectura, contratos y continuidad técnica.

## Referencia visual oficial

El diseño aprobado está publicado en:
<https://buenaventura-se-levanta.millerocoro.chatgpt.site>

El código fuente exacto del portal se conserva en [`frontend/`](./frontend/).
Los antiguos índices HTML de la raíz no pertenecen al producto final.

## Arquitectura

```text
Panel /admin -> Backend Express -> Supabase -> API /api -> Frontend aprobado
```

El backend es la única capa que utiliza `SUPABASE_SERVICE_ROLE_KEY`. El navegador
solo conoce la URL pública del API mediante `NEXT_PUBLIC_API_BASE_URL`.

## Ejecución local

### Backend

```bash
npm install
cp .env.example .env
npm start
```

Por defecto corre en `http://localhost:3000`; el panel está en `/admin`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Configure `NEXT_PUBLIC_API_BASE_URL` con la URL del backend, sin barra final.

## Pruebas

```bash
npm test
cd frontend && npm test
```

## Documentación esencial

- [`AGENTS.md`](./AGENTS.md): instrucciones que debe seguir cualquier agente.
- [`docs/HANDOFF-AGENTES.md`](./docs/HANDOFF-AGENTES.md): decisiones y estado de continuidad.
- [`docs/INTEGRACION-DISENO-SUPABASE.md`](./docs/INTEGRACION-DISENO-SUPABASE.md): contrato entre capas.
- [`docs/ENTORNOS.md`](./docs/ENTORNOS.md): URL públicas, nunca secretos.
- [`docs/MAPA-CODIGO.md`](./docs/MAPA-CODIGO.md): mapa del backend.

## Seguridad

- No versionar archivos `.env` ni credenciales.
- No exponer la clave `service_role` al frontend.
- Las escrituras se realizan únicamente a través del panel/backend autenticado.
- La API pública ofrece solo operaciones de lectura.
