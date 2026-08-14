# Brief para el agente de diseño visual — Buenaventura SE LEVANTA

Este documento es tuyo. Tienes libertad creativa real sobre el aspecto visual del sitio —
las reglas de abajo no son "hazlo sobrio", son una lista corta de cosas que no se pueden
romper porque sostienen la confianza y la función del portal. Fuera de esa lista, decide tú.

**Lectura obligatoria antes de empezar**: `CLAUDE.md` y `docs/MAPA-CODIGO.md` en la raíz
del proyecto. Ahí está el porqué de cada decisión que no deberías deshacer sin saberlo.

## Qué es este proyecto, en una frase

Portal ciudadano de información verificada sobre la emergencia sísmica en Buenaventura
(sismo M7.4, 10 de agosto de 2026). No es un producto de marca Kobia — nace con voz
ciudadana. El concepto completo está en
`Buenaventura SE LEVANTA - Documento de Concepto.md`.

## El objetivo visual es real, no un efecto secundario

Si el sitio se ve como un formulario de gobierno, no lo comparten. Compite contra flyers
de WhatsApp con colores fuertes, corazones y mensajes cálidos — ya los revisamos, están en
`ESTADOS/`. Tiene que ser cálido, atractivo, con identidad propia de Buenaventura y el
Pacífico — no una plantilla institucional. Tienes espacio real para tomar riesgos de
diseño: color, tipografía con carácter, ilustración, composición.

## Puedes tocar

- `public/css/estilos.css` — paleta, tipografía, espaciados, todo lo visual. Los nombres
  de variables (`--color-bg`, `--color-primary`, etc.) son el contrato con el resto del
  código — puedes cambiar sus valores libremente, evita eliminarlas o renombrarlas sin
  actualizar dónde se usan.
- `public/index.html` — estructura visual, layout, envolturas nuevas. **Nunca los `id`
  existentes** (ver más abajo).
- Imágenes, ilustración, iconografía nueva.
- **Imágenes provisionales/de prueba: sí, adelante.** Para probar composición y cómo
  encaja el layout es proceso normal — solo no las dejes en el sitio final dando a
  entender que son contenido real verificado (ver regla de "Registro visual" abajo).
- `public/js/app.js` — solo para agregar clases/atributos de estilo al HTML generado.
  **Nunca la lógica de datos**: ningún `fetch`, ninguna función de carga, ningún manejo
  de eventos existente (incluida la lógica del botón de tema — ver más abajo).

## Nunca toques

- `server.js`, `routes/`, `services/`, `data/*.json` — lógica y contenido, no diseño.
- Los `id` de HTML que usa `app.js` para inyectar contenido: `bloque-cifras`,
  `bloque-ayuda`, `bloque-registro-visual`, `bloque-pedir-ayuda`, `bloque-verificado`,
  `bloque-cuentas`, `bloque-plataformas`, y las secciones `estado-ahora`, `como-ayudar`,
  `registro-visual`, `pedir-ayuda`, `verificado-falso`, `cuentas-voces`, `plataformas`,
  `acerca-de`. Cambiar un `id` rompe el renderizado silenciosamente.
- Las llamadas `fetch()` y la lógica del botón de tema (`inicializarBotonTema` en
  `app.js`) — ya funciona, cambia solo su apariencia vía CSS/clases.

## No negociable — protege la confianza del sitio

- **Fuente y fecha siempre visibles** en cualquier cifra o dato (`elFuente()` en
  `app.js`) — es el principio rector del proyecto completo.
- **Los cuatro niveles de confianza** (oficial/institucional/colectivo/individual) deben
  seguir siendo visualmente distinguibles entre sí — no los aplanes a un mismo estilo.
- **La advertencia de fraude** en "Cómo ayudar" no se reduce ni se esconde.
- **"Registro visual" no lleva fotos de daños/víctimas reales sin verificar** — hoy está
  vacía a propósito. Imágenes provisionales de diseño ahí están bien mientras se note
  que son de prueba, no contenido publicado como verificado.

## Restricciones técnicas

- **Cero emojis** — política corporativa Kobia. Usa SVG inline (ver objeto `ICONOS` en
  `app.js` como referencia de patrón).
- **Sin tipografía por CDN externo** — la conectividad en Buenaventura es limitada. Si
  agregas una tipografía nueva, autoalójala y que pese poco.
- **Modo claro/oscuro es una preferencia del usuario, no una premisa fija.** Ya existe un
  botón funcional en el encabezado (`#boton-tema`) que alterna y recuerda la elección —
  hoy es solo texto plano ("Claro"/"Oscuro"), tú decides cómo se ve. La arquitectura CSS
  ya soporta tres estados (sistema / claro explícito / oscuro explícito) vía el atributo
  `data-theme` en `<html>` — dale el mismo nivel de cuidado visual a ambos modos.
- **Mobile-first se mantiene** — la mayoría de quienes usan esto tienen mala señal y
  poca batería.

## Pendiente por agregar: falta una sección completa

Auditoría del contenido construido vs. el mapa de 10 secciones del Documento de Concepto
encontró que **"Equipos de socorro y respuesta" no existe en la página**, aunque el
endpoint ya está listo y devuelve datos reales: `GET /api/contactos-emergencia` (línea
nacional 123, Cruz Roja/Bomberos/Defensa Civil/Policía/Acueducto/Energía locales de
Buenaventura, línea de salud mental distrital, contacto CICR para restablecer contacto
familiar). Hoy solo hay 2 números sueltos hardcodeados en la barra superior — el resto es
invisible para quien entra al sitio, y en un portal de crisis eso es grave.

Como ya estás reescribiendo `public/index.html` y `public/js/app.js`, agrégala tú en el
mismo pase en vez de que alguien más la meta después en un archivo que estás editando:
una sección nueva (sugiero `id="equipos-socorro"`, contenedor `id="bloque-contactos"`,
siguiendo el mismo patrón de las demás: una función `cargarContactosEmergencia()` que
haga `fetch('/api/contactos-emergencia')` y renderice). Debería ir cerca del inicio,
junto a "Estado ahora" — es información que alguien en emergencia real necesita encontrar
rápido, no al final de la página.

## Cómo entregar

- Ya existe un commit de respaldo en git antes de tu trabajo — usa una rama nueva
  (`git checkout -b diseno-visual`).
- Antes de dar por terminado: corre el sitio (`npm run dev`) y confirma en la consola del
  navegador que no hay errores, y que las secciones siguen cargando datos reales.
