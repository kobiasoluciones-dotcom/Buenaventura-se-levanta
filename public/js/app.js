// Buenaventura SE LEVANTA — front-end vanilla JS
// Cada bloque hace fetch a /api/... y renderiza. Sin dependencias externas
// a propósito: la conectividad en Buenaventura es limitada, cada request cuenta.

const ICONOS = {
  fuente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  externo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>',
};

const NOMBRES_NIVEL = {
  oficial: 'Oficial',
  institucional: 'Institucional',
  colectivo: 'Colectivo',
  individual: 'Individual',
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

    const tarjetas = datos.iniciativas.map(item => `
      <div class="tarjeta-ayuda" data-nivel="${item.nivel_confianza}">
        <div class="tarjeta-ayuda__cabecera">
          <span class="tarjeta-ayuda__nombre">${item.nombre}</span>
          <span class="etiqueta-nivel" data-nivel="${item.nivel_confianza}">${NOMBRES_NIVEL[item.nivel_confianza]}</span>
        </div>
        ${item.descripcion ? `<p class="tarjeta-ayuda__detalle">${item.descripcion}</p>` : ''}
        ${item.recibe ? `<p class="tarjeta-ayuda__detalle"><strong>Recibe:</strong> ${item.recibe.join(', ')}</p>` : ''}
        ${item.no_recibe ? `<p class="tarjeta-ayuda__detalle"><strong>No recibe:</strong> ${item.no_recibe.join(', ')}</p>` : ''}
        ${item.cuenta ? `<p class="tarjeta-ayuda__detalle"><strong>Cuenta:</strong> ${item.cuenta}</p>` : ''}
        ${item.llave_bre_b ? `<p class="tarjeta-ayuda__detalle"><strong>Llave Bre-B:</strong> ${item.llave_bre_b}</p>` : ''}
        ${item.llave_daviplata ? `<p class="tarjeta-ayuda__detalle"><strong>Daviplata:</strong> ${item.llave_daviplata}</p>` : ''}
        ${item.cuenta_bancolombia_ahorros ? `<p class="tarjeta-ayuda__detalle"><strong>Bancolombia:</strong> ${item.cuenta_bancolombia_ahorros}</p>` : ''}
        ${item.contacto_whatsapp ? `<p class="tarjeta-ayuda__detalle"><strong>WhatsApp:</strong> ${item.contacto_whatsapp}</p>` : ''}
        ${item.ubicacion ? `<p class="tarjeta-ayuda__detalle"><strong>Ubicación:</strong> ${item.ubicacion}</p>` : ''}
        ${item.puntos_entrega ? `<p class="tarjeta-ayuda__detalle"><strong>Puntos de entrega:</strong> ${item.puntos_entrega.join(' · ')}</p>` : ''}
        ${item.horario ? `<p class="tarjeta-ayuda__detalle"><strong>Horario:</strong> ${item.horario}</p>` : ''}
        ${elFuente(item.fuente)}
        ${item.nota_verificacion ? `<p class="tarjeta-ayuda__nota">${item.nota_verificacion}</p>` : ''}
      </div>
    `).join('');

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
        <p class="tarjeta-ayuda__nombre">${p.paso}</p>
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
          <div class="tarjeta-enlace__texto">
            <span class="tarjeta-enlace__nombre">${c.nombre}</span>
            <span class="tarjeta-enlace__descripcion">${c.canal || c.descripcion || ''}</span>
          </div>
        </div>
      `).join('');
      return `<div class="subtitulo-grupo">${titulo}</div><div class="lista-enlaces">${filas}</div>`;
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
        <a class="tarjeta-enlace" href="${p.url}" target="_blank" rel="noopener">
          <div class="tarjeta-enlace__texto">
            <span class="tarjeta-enlace__nombre">${p.nombre}</span>
            <span class="tarjeta-enlace__descripcion">${p.descripcion}</span>
          </div>
          ${ICONOS.externo}
        </a>
      `).join('');
      return `<div class="subtitulo-grupo">${titulo}</div><div class="lista-enlaces">${filas}</div>`;
    };
    contenedor.innerHTML = grupo('Ciudadanas', datos.ciudadanas) + grupo('Oficiales', datos.oficiales);
  } catch (error) {
    contenedor.innerHTML = `<p class="marcador-error">No se pudo cargar esta sección.</p>`;
  }
}

// ---------- Inicio ----------

cargarCifras();
cargarDirectorioAyuda();
cargarRegistroVisual();
cargarComoSolicitarAyuda();
cargarVerificadoFalso();
cargarCuentasYVoces();
cargarPlataformas();
