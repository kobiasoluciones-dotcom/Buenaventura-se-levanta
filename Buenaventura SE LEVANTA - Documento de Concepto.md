# Buenaventura SE LEVANTA
### Documento de concepto — v1

---

## 1. Contexto

El 10 de agosto de 2026 un sismo de magnitud 7.4 (epicentro en San José del Palmar, Chocó) golpeó el occidente de Colombia. A nivel nacional: 273 fallecidos, ~97.500 damnificados, 407.530 familias afectadas. En Buenaventura específicamente (corte del 12 de agosto, Alcaldía Distrital): 3.956 personas afectadas, 540 viviendas destruidas (413 urbanas / 127 rurales), 2.833 viviendas averiadas, 13 fallecidos, 310 lesionados, 52 alojamientos temporales habilitados. La ciudad quedó incomunicada por vía terrestre por varios días debido a derrumbes. Hubo réplicas activas, incluyendo una de magnitud 4.2 el 13 de agosto. Se decretó toque de queda y calamidad pública.

## 2. Diagnóstico — por qué este proyecto y no otro

El problema no es falta de información: es **fragmentación y falta de confianza**. Identificamos más de 20 fuentes dispersas y al menos tres plataformas ciudadanas ya operando:

- **ConectaColombia 7.4** (conectacolombia.org) — mapa de iniciativas de ayuda en tiempo real.
- **gestiondeayudascolombia.com** — mapa de necesidades vs. donaciones vs. entregas, casi duplicado del anterior.
- **Colombia te busca** (colombiatebusca.com) — registro y búsqueda de personas desaparecidas.
- **Buenaventura en Línea** — medio de noticias local, sin panel consolidado de la emergencia.

Ninguna de estas está resolviendo: (a) un lugar único, hiperlocal y curado específicamente para Buenaventura, (b) verificación activa de fraude y desinformación local, ni (c) la coordinación de la evaluación técnica de seguridad de viviendas — que descubrimos que **ya está ocurriendo, ahora, sin coordinar**: la Dirección Técnica de Vivienda de la Alcaldía reclutando profesionales voluntarios por un grupo de WhatsApp, y al menos una arquitecta independiente (Leidy Angulo) haciendo inspecciones visuales gratuitas con clasificación semáforo (verde/amarillo/rojo), sin mapa compartido entre ambas iniciativas.

Revisamos también una muestra real de 19 estados de WhatsApp circulando el 13 de agosto: al menos 10 son volantes casi idénticos de distintas personas/colectivos pidiendo donaciones, con distinta cuenta bancaria, dirección y responsable — imposible de verificar para un ciudadano común. Confirma el diagnóstico.

## 3. Concepto central

**Buenaventura SE LEVANTA no es un directorio ni una plataforma de coordinación de ayuda — es una capa de confianza y traducción** entre la información oficial/comunitaria dispersa y la gente que la necesita. No creamos información nueva: la curamos, verificamos y conectamos con quien ya la resuelve mejor que nosotros (por eso enlazamos, no reconstruimos, las plataformas ya existentes).

### Principio rector
> **"Lo volátil se enlaza con fuente y fecha; lo estable se afirma con nuestro propio nombre; lo no verificado se marca explícitamente como tal."**

Cifras de víctimas, estado de vías, cupos de albergue: nunca se afirman como hecho propio, siempre "según [fuente], [fecha]". Lo que el portal sí puede afirmar con autoridad propia: cómo donar sin ser estafado, qué plataforma usar para qué, contactos verificados, contenido que el propio equipo verificó.

### Identidad — modelo híbrido
Nace con **voz de ciudadano bonaverense**, sin marca visible, para maximizar confianza y viralidad en fase de sobrevivencia (una marca corporativa compite por atención con la urgencia y puede leerse como oportunismo). **Kobia se presenta explícitamente en la fase técnica** (evaluación estructural), donde la autoridad institucional de una empresa de ingeniería geotécnica/estructural sí aporta credibilidad. La transición se anuncia desde el día uno en "Acerca de", sin ocultarla.

## 4. Mapa de actores

Se identificaron cuatro círculos de actores:

**Círculo 1 — Viven la crisis en el territorio:** víctima/damnificado urbano, comunidades rurales/ribereñas (solo accesibles por río — **fuera de alcance en v1** bajo la premisa de que el usuario objetivo tiene acceso a internet), comerciante formal, vendedor informal, trabajador portuario, persona vulnerable, niños/familias, personas privadas de la libertad.

**Círculo 2 — Quieren ayudar desde afuera:** familiar fuera de la ciudad, donante individual, diáspora bonaverense organizada, voluntario general, voluntario técnico, dueño de maquinaria pesada, dueño de embarcación/lanchero, empresa privada/gremio.

**Círculo 3 — Operan la respuesta:** funcionario público/Alcaldía, transportista/logística, coordinador de albergue, personal de salud, fuerza pública, líder comunitario/religioso, ONG seria.

**Círculo 4 — Verifican y amplifican:** periodista/medio local, fact-checkers nacionales.

### Priorizados para v1 (no se puede servir a todos desde el día uno)
1. Quien necesita decidir algo ahora (víctima, familiar) — dónde hay albergue, qué vía está cortada, contactos.
2. Quien quiere ayudar sin hacer daño (donante, voluntario) — qué es real, qué hace falta.
3. Los profesionales de evaluación de vivienda (arquitecta Leidy, equipo de la Dirección Técnica de Vivienda) — la necesidad más urgente y menos cubierta que encontramos.

Los demás actores quedan documentados para v2, no ignorados.

## 5. Los 5 trabajos que debe resolver (filtro de decisión)

Cualquier función propuesta debe responder "¿a cuál de estos sirve, y para qué actor?" — si no encaja, no entra en v1.

1. **"¿A dónde voy / qué hago ahora?"** — estado en vivo y accionable.
2. **"¿Cómo ayudo sin hacer daño?"** — canalización correcta de donación/voluntariado/recursos.
3. **"Ya no puedo responder la misma pregunta mil veces"** — alivio de carga para quien opera la respuesta.
4. **"Nadie sabe cómo estamos aquí"** — canal de reporte de doble vía, no solo de consumo.
5. **"¿Esto es real o me van a estafar?"** — verificación activa y visible.

## 6. Modelo operativo v1

Un **equipo de Kobia actúa como redacción/curaduría central**. No es un sistema de accesos distribuidos a terceros externos desde el lanzamiento (eso es v2, empezando por la arquitecta Leidy y la Dirección Técnica de Vivienda). El equipo recopila, verifica y publica:

- Flyers de ayuda, clasificados por nivel de confianza (oficial / colectivo identificable / individual).
- Video/foto, solo tras pasar un checklist de verificación humana (ver sección 8).
- Cifras y datos oficiales, con fuente y fecha.
- Noticias curadas.

### 6.1 Red de corresponsales/reporteros

Además de la curaduría pasiva (rastrear fuentes y flyers), Kobia puede sostener una **red activa de corresponsales** que consiguen contenido y reportes en terreno. Distinción clave:

- **El corresponsal es fuente, no verificador.** Reporta o produce contenido (foto, video, reporte corto con ubicación); el equipo de Kobia sigue siendo quien aplica el checklist de verificación (sección 8) antes de publicar. Esto reduce el riesgo de sumar más gente a la red, comparado con darles publicación directa.
- **Regla de autorización**: la autoriza Kobia, no depende de un cargo formal. El requisito es conexión real y verificable con la zona (vive ahí, trabaja ahí, es conocido ahí) — no hace falta llegar exactamente al presidente de una JAC o de un Consejo Comunitario para poder cubrir una zona.
- **Etiquetado honesto, sin inflar respaldo**: el contenido de un corresponsal se marca como *"reportado por corresponsal autorizado de Buenaventura SE LEVANTA en [zona]"*. Solo se etiqueta como *"reporte oficial de la JAC/Consejo Comunitario de [zona]"* cuando existe en efecto un vínculo o aval formal de esa junta — nunca se asume ese respaldo por defecto.
- **Briefing mínimo**: qué y cómo reportar (ubicación, fecha, contexto breve), límites de seguridad (no entrar a estructuras inestables ni zonas de rescate activo), y las mismas reglas de dignidad del checklist de verificación (sección 8).

**Candidatos prioritarios para esta red:**

- **Juntas de Acción Comunal (JAC)** — conocimiento hiperlocal real, estructura de confianza ya existente en cada barrio. Núcleo natural de la red y curadoras naturales de una futura "vista por barrio" dentro del sitio (ver hueco pendiente en sección 12). Punto de coordinación eficiente: ASOCOMUNAL (federación municipal de juntas), en vez de contactar barrio por barrio.
- **Consejos Comunitarios de Comunidades Negras** — distintos de las JAC, no un sustituto: son la autoridad de gobierno propio sobre territorio colectivo étnico (Ley 70 de 1993), relevante sobre todo para la zona rural/ribereña de Buenaventura (los ríos Naya, Anchicayá, Raposo, Yurumanguí, San Juan). Su junta directiva puede ser un punto de entrada legítimo incluso hacia comunidades que individualmente quedan fuera del alcance de v1 por la premisa de conectividad. Requieren su propia categoría de espacio (territorio colectivo), distinta de la vista por barrio urbano. Organizaciones afro identificadas en la muestra de WhatsApp (ej. Cadhubev Benkos Vive, E-Afrotuá) son puentes naturales hacia esta estructura.
- Si logran vincularse formalmente, ambas figuras aportan una legitimidad al proyecto que ninguna otra acción propia lograría igual de rápido.

## 7. Mapa de contenido — estructura del sitio

1. **Estado ahora** — cifras oficiales, estado de vías, albergues y cupo, servicios, toque de queda/alertas.
2. **Equipos de socorro y respuesta** — organismos desplegados, contactos de emergencia.
3. **Cómo solicitar ayuda oficial** — registro como damnificado, documentos, punto de atención, tipos de ayuda. (Distinta de la sección 4 — para quien *recibe*, no quien *da*.)
4. **Cómo ayudar** — directorio de donación por confianza, voluntariado formal, necesidades consolidadas sin duplicados.
5. **Registro visual** — video/foto verificados por el equipo (renombrada desde "documentación verificada" porque la verificación es principio de todo el sitio, no exclusiva de esta sección).
6. **Noticias** — curadas y verificadas, con fecha.
7. **Verificado / Falso** — desmentidos específicos de Buenaventura, no genéricos nacionales.
8. **Plataformas útiles** — ciudadanas (ConectaColombia, gestiondeayudascolombia, Colombia te busca) y oficiales (SGC, UNGRD, Alcaldía Distrital, Gobernación del Valle, Datos Abiertos/DesInventar).
9. **Cuentas y voces que sí están ayudando** — oficiales, medios locales, ONG con trayectoria, profesionales técnicos verificados, influencers/personalidades (con filtro adicional: identidad real, fondos por canal verificable, prioridad a quien coordina algo concreto sobre quien solo expresa solidaridad), fact-checkers. Requiere revisión periódica fechada.
10. **Acerca de** — quién lo hace, qué hace/no hace, cómo se verifica todo.

## 8. Verificación de contenido audiovisual (Registro visual)

Checklist antes de publicar cualquier video/foto:
- **Origen**: confirmado geográfica y temporalmente (evitar el problema real ya documentado de videos de Filipinas/Guatemala pasados como Colombia).
- **No reciclado**: verificación inversa de imagen/video.
- **Dignidad**: no fallecidos ni menores identificables sin consentimiento; prioriza mostrar estructura/daño sobre personas.
- **Consentimiento** de quien grabó, para publicar con o sin crédito.

Publicado con sello "Verificado por Buenaventura SE LEVANTA el [fecha]" — a diferencia del contenido oficial (que se enlaza a su fuente), aquí la responsabilidad de verificación es directamente nuestra.

## 9. Rol de la Inteligencia Artificial

### Uso interno (equipo Kobia) — automatizable de punta a punta
- Monitoreo de fuentes oficiales (RSS, Canal de WhatsApp de la Alcaldía, SGC, UNGRD).
- Traducción de comunicados oficiales a lenguaje simple.
- Detección de cambios en páginas oficiales.
- Clasificación de noticias entrantes por categoría.
- Detección de duplicados entre flyers de donación.
- Generación del "boletín del día".
- Detección asistida de patrones de fraude en flyers nuevos (señala al verificador humano, no decide sola).
- Priorización de reportes ciudadanos de daño por densidad geográfica, para apoyar las rutas de los profesionales de vivienda.

### Requiere aprobación humana antes de publicar
- Cualquier dato financiero (cuentas, llaves Bre-B, NITs).
- Cifras de víctimas/daños (siempre "según fuente, fecha").
- Veredictos de verificado/falso.
- Contactos y teléfonos de emergencia.

### De cara al público — la pieza más potente y de mayor riesgo
Buscador conversacional que responde preguntas en lenguaje natural, pero **estrictamente limitado al contenido ya verificado y publicado por el equipo** (nunca al conocimiento general de la IA ni a internet abierto). Si no hay información verificada, debe responder que no la hay, nunca inventar. Este diseño restrictivo (grounding estricto) es una condición no negociable, dado que el error de un asistente así de cara al público destruye la credibilidad de todo el sitio en un solo caso.

### Accesibilidad
Texto-a-voz para contenido crítico (estado ahora, cómo pedir ayuda), pensando en adultos mayores o baja alfabetización — bajo costo de implementación, alto impacto de inclusión.

## 10. Canal de difusión por WhatsApp

Se usa la función de **Canales de WhatsApp** (formato de una sola vía, no grupo) — ya validado en este mismo contexto: la Alcaldía Distrital de Buenaventura tiene uno con 3 mil seguidores, por donde emitió el informe de cifras oficiales y el decreto de toque de queda.

- Un solo canal, no fragmentado por tema.
- Mismo equipo editorial que el sitio; el canal amplifica, no genera contenido nuevo.
- Criterio de publicación más estricto que el sitio web: solo alto impacto y alta confianza (cambios de toque de queda, alertas de fraude verificadas, cifras oficiales nuevas, desmentidos importantes). Nunca el flujo normal de flyers individuales.

## 11. Principios de diseño validados con dos perfiles reales

Se hizo el ejercicio de ponerse en el lugar de dos personas concretas para probar el concepto, con resultados que deben gobernar el diseño de la pantalla de inicio:

**Perfil 1 — alguien en Buenaventura ahora** (batería baja, mala señal, acaba de terminar el toque de queda): necesita resolver en máximo dos toques lo crítico (estado de su zona, albergue más cercano, contactos de emergencia). No tiene paciencia para narrativa ni para menús de nueve opciones. La página debe cargar rápido y liviana.

**Perfil 2 — familiar fuera de la ciudad** (buena señal, batería llena, ansiedad distinta): sí tolera contenido más rico y contexto, pero necesita **prueba de confianza antes de que se le pida algo** — si lo primero que ve es "dona aquí", desconfía por instinto (ya vio demasiados flyers dudosos). Busca sobre todo "¿cómo está mi gente?" antes que "¿cómo ayudo?", y valora una salida a su ansiedad más allá de solo donar dinero (compartir contenido verificado, por ejemplo).

**Implicaciones de diseño que se derivan de ambos perfiles:**
- La pantalla de inicio debe reconocer rápido "¿estás en Buenaventura ahora, o preguntas por alguien / quieres ayudar desde afuera?" y ramificar desde ahí — un solo diseño no sirve igual a los dos.
- La confianza (quién lo hace, por qué, respaldo oficial) se comunica **antes** de cualquier pedido de acción (donar, compartir, registrarse), nunca después.
- La narrativa de identidad ("Buenaventura SE LEVANTA", la historia de resiliencia) vive mejor en "Acerca de" y en lo que se comparte en redes — no compite por espacio con la urgencia en la pantalla de emergencia.
- Como la mayoría de los accesos llegarán por un link compartido en WhatsApp y no escribiendo la URL directamente, la vista previa del link (título e imagen) es, en la práctica, la primera impresión del sitio.

## 12. Huecos identificados en la revisión global (pendientes de resolver)

- Búsqueda/filtro por zona o barrio específico.
- Botón de corrección ciudadana cuando un dato publicado ya no es exacto (ej. "este albergue ya no tiene cupo").
- Triage para alguien con varias necesidades simultáneas, en vez de obligarlo a navegar las 10 secciones.
- Detección proactiva de rumores emergentes, no solo reactiva a reportes.

## 13. Qué NO hace el portal

No es otra plataforma de match de ayuda (ya existen tres). No aloja video/foto sin verificación. No recibe donaciones directamente. No reemplaza a la Alcaldía ni a las autoridades. No es un feed abierto de contenido sin dueño identificable. No crea información nueva — solo la organiza, verifica y traduce.

## 14. Fases

- **Fase 0 — Sobrevivencia (ahora):** contactos, fraude, centros de acopio, enlaces a plataformas existentes.
- **Fase 1 — Recuperación (semanas):** voluntariado, reconstrucción, seguimiento de albergues.
- **Fase 2 — Reconstrucción técnica (ya urgente, no "más adelante"):** herramienta digital para la evaluación estructural de viviendas, en coordinación con la Dirección Técnica de Vivienda y profesionales independientes ya activos. Aquí Kobia se presenta explícitamente.
- **Cierre:** criterio explícito de cuándo se archiva o se entrega a la Alcaldía/Cruz Roja — para no convertirse en el sitio muerto #21.

## 15. Próximos pasos sugeridos

1. Arquitectura visual: cómo se organiza y navega la pantalla de inicio.
2. Flujo de trabajo interno del equipo: quién sube, quién aprueba, con qué herramienta.
3. Contacto formal con la Dirección Técnica de Vivienda y la arquitecta Leidy Angulo para explorar la integración de la fase técnica.
4. Definir estructura técnica (hosting, dominio, stack) una vez validado el concepto con el equipo de Kobia.
