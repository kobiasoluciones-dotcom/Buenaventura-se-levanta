// Buenaventura SE LEVANTA - front-end vanilla JS (Premium Version)
// Cada bloque hace fetch a /api/... y renderiza. Sin dependencias externas
// a proposito: la conectividad en Buenaventura es limitada, cada request cuenta.

const TRAZOS_ICONOS = {
  fuente: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  alerta: '<path d="M12 3 2.7 19a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L12 3Z"/><path d="M12 9v5"/><path d="M12 17h.01"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  externo: '<path d="M14 4h6v6"/><path d="M10 14 20 4"/><path d="M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"/>',
  telefono: '<path d="M21 16.4v3a2 2 0 0 1-2.2 2 18.5 18.5 0 0 1-8-2.8 18 18 0 0 1-5.5-5.5 18.5 18.5 0 0 1-2.8-8A2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.4a2 2 0 0 1-.4 2.1l-1.2 1.2a14 14 0 0 0 5.1 5.1l1.2-1.2a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.4.6a2 2 0 0 1 1.7 1.9Z"/>',
  whatsapp: '<path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4.1A8 8 0 1 1 20 11.7Z"/><path d="M8.8 8.7c.2-.5.4-.6.8-.6h.4c.2 0 .4.1.5.4l.6 1.3c.1.3.1.5-.1.7l-.4.5a5.5 5.5 0 0 0 2.5 2.5l.5-.4c.2-.2.5-.2.7-.1l1.4.6c.3.1.4.3.4.6v.4c0 .4-.2.7-.6.9-.5.3-1.1.4-1.8.2-2.8-.6-5.2-3-5.8-5.8-.1-.5 0-.9.4-1.2Z"/>',
  ubicacion: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  banco: '<path d="m3 10 9-6 9 6"/><path d="M4 10h16"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M4 18h16"/><path d="M3 22h18"/>',
  paquete: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  entidad: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-7h6v7"/><path d="M9 10h.01"/><path d="M12 10h.01"/><path d="M15 10h.01"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',
  corazon: '<path d="M20.8 4.7a5.4 5.4 0 0 0-7.7 0L12 5.8l-1.1-1.1a5.4 5.4 0 1 0-7.7 7.7L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.7Z"/>',
  escudo: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9.5 12 1.7 1.7 3.5-4"/>',
  fuego: '<path d="M12 22a7 7 0 0 0 7-7c0-3-1.5-5-4.5-7.8-.5 2.2-1.7 3.5-3.2 4.5.3-3-1.2-5.2-3.8-7.7.2 3.5-2.5 5.8-2.5 10.5A7 7 0 0 0 12 22Z"/>',
  cruz: '<path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3Z"/>',
  gota: '<path d="M12 22a7 7 0 0 0 7-7c0-5-7-13-7-13S5 10 5 15a7 7 0 0 0 7 7Z"/>',
  energia: '<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>',
  usuarios: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
};

function icono(nombre, clase = '') {
  return `<svg class="icon icon--${nombre}${clase ? ` ${clase}` : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${TRAZOS_ICONOS[nombre]}</svg>`;
}

const ICONOS = Object.fromEntries(Object.keys(TRAZOS_ICONOS).map(nombre => [nombre, icono(nombre)]));

const NOMBRES_NIVEL = {
  oficial: 'Oficial',
  institucional: 'Institucional',
  colectivo: 'Colectivo',
  individual: 'Individual',
};

const NOMBRES_SECCION_PUBLICACION = {
  ofrecimientos: 'Ofrecimientos',
  'puntos-acopio': 'Puntos de acopio',
  'registro-visual': 'Registro visual',
};

function formatoNumero(n) {
  return new Intl.NumberFormat('es-CO').format(n);
}

function formatoFecha(fechaISO) {
  if (!fechaISO) return '';
  const [anio, mes, dia] = fechaISO.split('-');
  return `${dia}/${mes}/${anio}`;
}

async function obtenerJSON(ruta) {
  const respuesta = await fetch(ruta);
  if (!respuesta.ok) throw new Error(`No se pudo cargar ${ruta}`);
  return respuesta.json();
}

function elFuente(fuente, fecha) {
  const fechaTexto = fecha ? ` · ${formatoFecha(fecha)}` : '';
  return `<div class="fuente-dato">${ICONOS.fuente} Fuente: ${fuente}${fechaTexto}</div>`;
}

function inicialesEntidad(nombre) {
  return nombre
    .replace(/\([^)]*\)/g, '')
    .split(/\s+/)
    .filter(palabra => palabra.length > 2)
    .slice(0, 3)
    .map(palabra => palabra[0])
    .join('')
    .toUpperCase();
}

function detalleConIcono(icono, etiqueta, valor) {
  if (!valor) return '';
  return `<p class="fila-dato">${icono}<span><strong>${etiqueta}</strong> ${valor}</span></p>`;
}

function enlaceTelefono(numero) {
  const tel = String(numero).replace(/[^\d+#]/g, '');
  return `<a class="accion-chip accion-chip--llamar" href="tel:${tel}" title="Llamar a ${numero}">${ICONOS.telefono}</a>`;
}

function enlaceWhatsapp(numero) {
  const limpio = String(numero).replace(/[^\d]/g, '');
  const destino = limpio.length === 10 ? `57${limpio}` : limpio;
  return `<a class="accion-chip accion-chip--whatsapp" href="https://wa.me/${destino}" target="_blank" rel="noopener" title="Enviar WhatsApp a ${numero}">${ICONOS.whatsapp}</a>`;
}

function accionWeb(url, etiqueta = 'Abrir enlace') {
  if (!url) return '';
  const href = /^https?:\/\//.test(url) ? url : `https://${url}`;
  return `<a class="accion-chip" href="${href}" target="_blank" rel="noopener">${ICONOS.externo}<span>${etiqueta}</span></a>`;
}

function iconoContacto(item, tipo) {
  const texto = `${item.nombre || ''} ${item.organizacion || ''} ${tipo}`.toLowerCase();
  if (texto.includes('whatsapp') || tipo === 'familia') return ICONOS.whatsapp;
  if (texto.includes('salud mental')) return ICONOS.corazon;
  if (texto.includes('cruz roja')) return ICONOS.cruz;
  if (texto.includes('bomberos')) return ICONOS.fuego;
  if (texto.includes('polic')) return ICONOS.escudo;
  if (texto.includes('defensa civil')) return ICONOS.escudo;
  if (texto.includes('acueducto') || texto.includes('hidropac')) return ICONOS.gota;
  if (texto.includes('energ')) return ICONOS.energia;
  if (texto.includes('alcald')) return ICONOS.entidad;
  return ICONOS.telefono;
}

function tipoContacto(item, tipo) {
  const texto = `${item.nombre || ''} ${item.organizacion || ''} ${tipo}`.toLowerCase();
  if (texto.includes('salud mental')) return 'salud';
  if (texto.includes('cruz roja')) return 'cruz-roja';
  if (texto.includes('bomberos')) return 'bomberos';
  if (texto.includes('polic')) return 'policia';
  if (texto.includes('defensa civil')) return 'defensa';
  if (texto.includes('acueducto') || texto.includes('hidropac')) return 'agua';
  if (texto.includes('energ')) return 'energia';
  if (texto.includes('alcald')) return 'entidad';
  if (tipo === 'familia') return 'familia';
  return 'emergencia';
}

function renderGrupoContactos(titulo, items, tipo = 'telefono') {
  if (!items || items.length === 0) return '';
  const tarjetas = items.map(item => `
    <article class="tarjeta-contacto" data-contacto="${tipoContacto(item, tipo)}">
      <span class="sello-entidad sello-entidad--mini sello-entidad--contacto" aria-hidden="true">${iconoContacto(item, tipo)}</span>
      <div class="tarjeta-contacto__contenido">
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <h3 class="tarjeta-contacto__nombre">${item.nombre || item.organizacion}</h3>
          ${item.numero ? `<span class="tarjeta-contacto__numero">${item.numero}</span>` : ''}
          ${item.descripcion ? `<p class="tarjeta-contacto__descripcion">${item.descripcion}</p>` : ''}
        </div>
        <div class="acciones-inline" style="margin-top: 0;">
          ${item.numero ? enlaceTelefono(item.numero) : ''}
          ${item.whatsapp ? enlaceWhatsapp(item.whatsapp) : ''}
        </div>
        ${item.email ? detalleConIcono(ICONOS.web, 'Email', item.email) : ''}
        ${item.linea_te_escucha ? detalleConIcono(ICONOS.telefono, 'Linea Te Escucha', item.linea_te_escucha) : ''}
        ${item.fuente ? elFuente(item.fuente, item.actualizado) : ''}
      </div>
    </article>
  `).join('');
  return `<div class="subtitulo-grupo">${titulo}</div><div class="grid-contactos" data-tipo="${tipo}">${tarjetas}</div>`;
}

// ---------- Estado ahora ----------

async function cargarCifras() {
  const contenedor = document.getElementById('bloque-cifras');
  try {
    const datos = await obtenerJSON('/api/cifras-oficiales');
    const b = datos.buenaventura;
    const tq = datos.toque_de_queda;

    contenedor.innerHTML = `
      <div class="grid-cifras">
        <div class="tarjeta-cifra">
          <div class="tarjeta-cifra__etiqueta">Personas afectadas</div>
          <div class="tarjeta-cifra__valor">${formatoNumero(b.afectados)}</div>
        </div>
        <div class="tarjeta-cifra">
          <div class="tarjeta-cifra__etiqueta">Fallecidos</div>
          <div class="tarjeta-cifra__valor">${formatoNumero(b.fallecidos)}</div>
        </div>
        <div class="tarjeta-cifra">
          <div class="tarjeta-cifra__etiqueta">Lesionados</div>
          <div class="tarjeta-cifra__valor">${formatoNumero(b.lesionados)}</div>
        </div>
        <div class="tarjeta-cifra">
          <div class="tarjeta-cifra__etiqueta">Viviendas destruidas</div>
          <div class="tarjeta-cifra__valor">${formatoNumero(b.viviendas_destruidas.total)}</div>
          <div class="tarjeta-cifra__subvalor">Urbano ${formatoNumero(b.viviendas_destruidas.urbano)} · Rural ${formatoNumero(b.viviendas_destruidas.rural)}</div>
        </div>
        <div class="tarjeta-cifra">
          <div class="tarjeta-cifra__etiqueta">Viviendas averiadas</div>
          <div class="tarjeta-cifra__valor">${formatoNumero(b.viviendas_averiadas.total)}</div>
          <div class="tarjeta-cifra__subvalor">Urbano ${formatoNumero(b.viviendas_averiadas.urbano)} · Rural ${formatoNumero(b.viviendas_averiadas.rural)}</div>
        </div>
        <div class="tarjeta-cifra">
          <div class="tarjeta-cifra__etiqueta">Alojamientos temporales</div>
          <div class="tarjeta-cifra__valor">${formatoNumero(b.alojamientos_temporales_habilitados)}</div>
        </div>
      </div>
      ${elFuente(b.fuente, b.fecha_corte)}

      <div class="aviso-toque-queda">
        ${ICONOS.reloj}
        <div>
          <p class="aviso-toque-queda__titulo">Toque de queda ${tq.estado === 'vigente' ? 'vigente' : ''}: ${tq.horario}</p>
          <p class="aviso-toque-queda__cuerpo">${tq.nota}</p>
          ${elFuente(tq.fuente, tq.ultimo_decreto_fecha)}
        </div>
      </div>
    `;
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudieron cargar las cifras. Intenta de nuevo en un momento.</p>`;
  }
}

// ---------- Equipos de socorro ----------

async function cargarContactosEmergencia() {
  const contenedor = document.getElementById('bloque-contactos');
  if (!contenedor) return;

  try {
    const datos = await obtenerJSON('/api/contactos-emergencia');
    contenedor.innerHTML = `
      ${renderGrupoContactos('Linea nacional', datos.nacionales, 'nacional')}
      ${renderGrupoContactos('Buenaventura', datos.buenaventura, 'local')}
      ${renderGrupoContactos('Salud mental', [datos.salud_mental], 'salud')}
      ${renderGrupoContactos('Restablecer contacto familiar', [datos.restablecimiento_contacto_familiar], 'familia')}
      ${renderGrupoContactos('Atencion ciudadana Alcaldia', [datos.atencion_ciudadano_alcaldia], 'alcaldia')}
    `;
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudieron cargar los contactos de emergencia.</p>`;
  }
}

// ---------- Publicaciones reales ----------

function renderPublicacion(pub) {
  const fecha = pub.fecha_publicado ? formatoFecha(pub.fecha_publicado) : '';
  const media = pub.tipo_presentacion === 'alojado' && pub.archivo
    ? (pub.tipo_archivo && pub.tipo_archivo.startsWith('video/')
      ? `<video class="publicacion__media" src="${pub.archivo}" controls preload="metadata"></video>`
      : `<img class="publicacion__media" src="${pub.archivo}" alt="${pub.titulo}" loading="lazy">`)
    : `<a class="publicacion__enlace" href="${pub.url_externa}" target="_blank" rel="noopener">${ICONOS.externo}<span>Ver publicacion original</span></a>`;

  return `
    <article class="publicacion" data-nivel="${pub.nivel_confianza}">
      ${media}
      <div class="publicacion__cuerpo">
        <div class="publicacion__meta">
          <span class="etiqueta-nivel" data-nivel="${pub.nivel_confianza}">${ICONOS.entidad}${NOMBRES_NIVEL[pub.nivel_confianza]}</span>
          ${fecha ? `<span>${fecha}</span>` : ''}
        </div>
        <h3 class="publicacion__titulo">${pub.titulo}</h3>
        ${pub.descripcion ? `<p class="publicacion__descripcion">${pub.descripcion}</p>` : ''}
        ${pub.publicado_por ? elFuente(pub.publicado_por, pub.fecha_publicado) : ''}
      </div>
    </article>
  `;
}

async function cargarPublicaciones(seccion, idContenedor) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  try {
    const publicaciones = await obtenerJSON(`/api/publicaciones?seccion=${encodeURIComponent(seccion)}`);
    if (!publicaciones || publicaciones.length === 0) {
      contenedor.innerHTML = `
        <div class="estado-vacio-publicaciones">
          ${ICONOS.fuente}
          <div>
            <p class="estado-vacio-publicaciones__titulo">Todavia no hay ${NOMBRES_SECCION_PUBLICACION[seccion].toLowerCase()} publicados</p>
            <p class="estado-vacio-publicaciones__texto">Cuando el equipo cargue flyers, videos o enlaces reales desde el panel interno, apareceran aqui como contenido visual principal.</p>
          </div>
        </div>
      `;
      return;
    }

    contenedor.innerHTML = `<div class="grid-publicaciones">${publicaciones.map(renderPublicacion).join('')}</div>`;
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudieron cargar estas publicaciones.</p>`;
  }
}

// ---------- Cómo ayudar ----------

async function cargarDirectorioAyuda() {
  const contenedor = document.getElementById('bloque-ayuda');
  try {
    const datos = await obtenerJSON('/api/directorio-ayuda');
    const advertencia = datos.advertencia_fraude;

    const leyenda = Object.keys(NOMBRES_NIVEL).map(nivel => `
      <div class="leyenda-niveles__item">
        <span class="leyenda-niveles__punto" style="background:var(--color-nivel-${nivel})"></span>
        ${NOMBRES_NIVEL[nivel]}
      </div>
    `).join('');

    const tarjetas = datos.iniciativas.map(item => {
      const acciones = [
        item.contacto_whatsapp ? enlaceWhatsapp(item.contacto_whatsapp) : '',
        item.whatsapp ? enlaceWhatsapp(item.whatsapp) : '',
        item.web ? accionWeb(item.web, 'Sitio web') : '',
        item.ubicacion ? `<span class="accion-chip accion-chip--pasiva">${ICONOS.ubicacion}<span>${item.ubicacion}</span></span>` : '',
      ].join('');

      return `
      <article class="tarjeta-ayuda" data-nivel="${item.nivel_confianza}">
        <div class="tarjeta-ayuda__cabecera">
          <div class="tarjeta-ayuda__identidad">
            <span class="sello-entidad" data-nivel="${item.nivel_confianza}" aria-hidden="true">${inicialesEntidad(item.nombre)}</span>
            <span class="tarjeta-ayuda__nombre">${item.nombre}</span>
          </div>
          <span class="etiqueta-nivel" data-nivel="${item.nivel_confianza}">${ICONOS.entidad}${NOMBRES_NIVEL[item.nivel_confianza]}</span>
        </div>
        ${item.descripcion ? `<p class="tarjeta-ayuda__detalle">${item.descripcion}</p>` : ''}
        ${item.recibe ? detalleConIcono(ICONOS.paquete, 'Recibe', item.recibe.join(', ')) : ''}
        ${item.no_recibe ? detalleConIcono(ICONOS.alerta, 'No recibe', item.no_recibe.join(', ')) : ''}
        ${item.como_donar ? detalleConIcono(ICONOS.corazon, 'Como donar', item.como_donar) : ''}
        ${item.cuenta ? detalleConIcono(ICONOS.banco, 'Cuenta', item.cuenta) : ''}
        ${item.llave_bre_b ? detalleConIcono(ICONOS.banco, 'Llave Bre-B', item.llave_bre_b) : ''}
        ${item.llave_daviplata ? detalleConIcono(ICONOS.banco, 'Daviplata', item.llave_daviplata) : ''}
        ${item.cuenta_bancolombia_ahorros ? detalleConIcono(ICONOS.banco, 'Bancolombia', item.cuenta_bancolombia_ahorros) : ''}
        ${item.nequi ? detalleConIcono(ICONOS.banco, 'Nequi', item.nequi) : ''}
        ${item.puntos_entrega ? detalleConIcono(ICONOS.ubicacion, 'Puntos de entrega', item.puntos_entrega.join(' · ')) : ''}
        ${item.horario ? detalleConIcono(ICONOS.reloj, 'Horario', item.horario) : ''}
        ${item.prioridad_inmediata ? detalleConIcono(ICONOS.alerta, 'Prioridad inmediata', item.prioridad_inmediata.join(', ')) : ''}
        ${acciones ? `<div class="acciones-inline">${acciones}</div>` : ''}
        ${elFuente(item.fuente)}
        ${item.nota_verificacion ? `<p class="tarjeta-ayuda__nota">${item.nota_verificacion}</p>` : ''}
      </article>
    `;
    }).join('');

    contenedor.innerHTML = `
      <div class="advertencia-fraude">
        ${ICONOS.alerta}
        <div>
          <p class="advertencia-fraude__titulo">${advertencia.titulo}</p>
          <ul>${advertencia.puntos.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="leyenda-niveles">${leyenda}</div>
      <div class="lista-ayudas">${tarjetas}</div>
    `;
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudo cargar el directorio de ayuda.</p>`;
  }
}

// ---------- Registro visual ----------

async function cargarRegistroVisual() {
  const contenedor = document.getElementById('bloque-registro-visual');
  try {
    const datos = await obtenerJSON('/api/registro-visual');

    if (!datos.items || datos.items.length === 0) {
      const checklist = datos.checklist_antes_de_publicar.map(c => `<li>${c}</li>`).join('');
      contenedor.innerHTML = `
        <div class="tarjeta-ayuda" data-nivel="individual">
          <p class="tarjeta-ayuda__nombre">Todavía no hay contenido verificado</p>
          <p class="tarjeta-ayuda__detalle">${datos.nota_transparencia}</p>
        </div>
        <div class="subtitulo-grupo">Antes de publicar algo aquí, revisamos que:</div>
        <ul class="lista-simple">${checklist}</ul>
      `;
      return;
    }

    const tarjetas = datos.items.map(item => `
      <div class="tarjeta-ayuda" data-nivel="oficial">
        <p class="tarjeta-ayuda__nombre">${item.titulo}</p>
        ${item.descripcion ? `<p class="tarjeta-ayuda__detalle">${item.descripcion}</p>` : ''}
        ${elFuente(`Verificado por Buenaventura SE LEVANTA`, item.fecha_verificacion)}
      </div>
    `).join('');
    contenedor.innerHTML = `<div class="lista-ayudas">${tarjetas}</div>`;
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudo cargar esta sección.</p>`;
  }
}

// ---------- Cómo solicitar ayuda oficial ----------

async function cargarComoSolicitarAyuda() {
  const contenedor = document.getElementById('bloque-pedir-ayuda');
  try {
    const datos = await obtenerJSON('/api/como-solicitar-ayuda-oficial');
    const pasos = datos.lo_que_se_sabe.map(p => `
      <div class="tarjeta-ayuda" data-nivel="oficial">
        <div class="tarjeta-ayuda__identidad">
          <span class="sello-entidad" data-nivel="oficial" aria-hidden="true">${ICONOS.entidad}</span>
          <p class="tarjeta-ayuda__nombre">${p.paso}</p>
        </div>
        <p class="tarjeta-ayuda__detalle">${p.detalle}</p>
      </div>
    `).join('');

    const pendientes = datos.pendiente_de_confirmar.map(p => `<li>${p}</li>`).join('');

    contenedor.innerHTML = `
      <div class="lista-ayudas">${pasos}</div>
      <div class="subtitulo-grupo">Aún sin confirmar</div>
      <ul class="lista-simple">${pendientes}</ul>
    `;
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudo cargar esta sección.</p>`;
  }
}

// ---------- Verificado / Falso ----------

async function cargarVerificadoFalso() {
  const contenedor = document.getElementById('bloque-verificado');
  try {
    const datos = await obtenerJSON('/api/verificado-falso');
    const tarjetas = datos.aclaraciones_oficiales.map(item => `
      <div class="tarjeta-verificacion">
        <span class="tarjeta-verificacion__estado" data-estado="${item.estado}">${ICONOS.x} ${item.estado}</span>
        <p class="tarjeta-verificacion__afirmacion">${item.afirmacion}</p>
        <p class="tarjeta-verificacion__explicacion">${item.explicacion}</p>
        ${elFuente(item.fuente)}
      </div>
    `).join('');
    contenedor.innerHTML = `<div class="lista-ayudas">${tarjetas}</div>`;
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudo cargar esta sección.</p>`;
  }
}

// ---------- Cuentas y voces ----------

async function cargarCuentasYVoces() {
  const contenedor = document.getElementById('bloque-cuentas');
  try {
    const datos = await obtenerJSON('/api/cuentas-y-voces');
    const grupo = (titulo, items) => {
      if (!items || items.length === 0) return '';
      const filas = items.map(c => `
        <div class="tarjeta-enlace">
          <span class="sello-entidad sello-entidad--mini" aria-hidden="true">${inicialesEntidad(c.nombre)}</span>
          <div class="tarjeta-enlace__texto">
            <span class="tarjeta-enlace__nombre">${c.nombre}</span>
            <span class="tarjeta-enlace__descripcion">${c.canal || c.descripcion || ''}</span>
          </div>
        </div>
      `).join('');
      return `<div class="subtitulo-grupo">${titulo}</div><div class="lista-enlaces lista-enlaces--compacta">${filas}</div>`;
    };

    contenedor.innerHTML =
      grupo('Oficiales', datos.oficiales) +
      grupo('Medios locales', datos.medios_locales) +
      grupo('ONG con trayectoria', datos.ong_con_trayectoria) +
      grupo('Profesionales técnicos', datos.profesionales_tecnicos);
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudo cargar esta sección.</p>`;
  }
}

// ---------- Plataformas útiles ----------

async function cargarPlataformas() {
  const contenedor = document.getElementById('bloque-plataformas');
  try {
    const datos = await obtenerJSON('/api/plataformas');
    const grupo = (titulo, items) => {
      const filas = items.map(p => `
        <a class="tarjeta-enlace tarjeta-enlace--accion" href="${p.url}" target="_blank" rel="noopener">
          <span class="sello-entidad sello-entidad--mini" aria-hidden="true">${inicialesEntidad(p.nombre)}</span>
          <div class="tarjeta-enlace__texto">
            <span class="tarjeta-enlace__nombre">${p.nombre}</span>
            <span class="tarjeta-enlace__descripcion">${p.descripcion}</span>
          </div>
          ${ICONOS.externo}
        </a>
      `).join('');
      return `<div class="subtitulo-grupo">${titulo}</div><div class="lista-enlaces lista-enlaces--compacta">${filas}</div>`;
    };
    contenedor.innerHTML = grupo('Ciudadanas', datos.ciudadanas) + grupo('Oficiales', datos.oficiales);
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudo cargar esta sección.</p>`;
  }
}

// ---------- Tema (claro/oscuro) ----------
// Logica funcional unicamente - el aspecto del boton lo define el agente de diseno.

function temaEfectivoActual() {
  const explicito = document.documentElement.getAttribute('data-theme');
  if (explicito) return explicito;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function inicializarBotonTema() {
  const boton = document.getElementById('boton-tema');
  if (!boton) return;

  const actualizarEtiqueta = () => {
    const temaOscuro = temaEfectivoActual() === 'dark';
    boton.setAttribute('aria-label', temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    boton.title = temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  };
  actualizarEtiqueta();

  boton.addEventListener('click', () => {
    const nuevoTema = temaEfectivoActual() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nuevoTema);
    localStorage.setItem('bsl-tema', nuevoTema === 'dark' ? 'oscuro' : 'claro');
    actualizarEtiqueta();
  });
}

inicializarBotonTema();

// ---------- Inicio ----------

cargarCifras();
cargarContactosEmergencia();
cargarDirectorioAyuda();
cargarPublicaciones('ofrecimientos', 'bloque-ofrecimientos');
cargarPublicaciones('puntos-acopio', 'bloque-puntos-acopio');
cargarRegistroVisual();
cargarComoSolicitarAyuda();
cargarVerificadoFalso();
cargarCuentasYVoces();
cargarPlataformas();
