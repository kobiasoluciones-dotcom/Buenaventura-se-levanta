// Panel interno — vanilla JS, sin dependencias, coherente con el resto del proyecto.

const vistaLogin = document.getElementById('vista-login');
const vistaPanel = document.getElementById('vista-panel');
const botonSalir = document.getElementById('boton-salir');

const formLogin = document.getElementById('form-login');
const campoContrasena = document.getElementById('campo-contrasena');
const errorLogin = document.getElementById('error-login');

const listaArchivos = document.getElementById('lista-archivos');
const editorVacio = document.getElementById('editor-vacio');
const editorActivo = document.getElementById('editor-activo');
const editorTitulo = document.getElementById('editor-titulo');
const editorRevision = document.getElementById('editor-revision');
const editorTextarea = document.getElementById('editor-textarea');
const editorError = document.getElementById('editor-error');
const editorEstado = document.getElementById('editor-estado');
const botonGuardar = document.getElementById('boton-guardar');
const botonMarcarRevisado = document.getElementById('boton-marcar-revisado');

const editorLista = document.getElementById('editor-lista');
const editorListaTitulo = document.getElementById('editor-lista-titulo');
const editorListaContenido = document.getElementById('editor-lista-contenido');
const editorListaError = document.getElementById('editor-lista-error');
const editorListaEstado = document.getElementById('editor-lista-estado');
const botonGuardarLista = document.getElementById('boton-guardar-lista');

let claveActiva = null;

// ---------- Formularios reales para las claves con datos de organizaciones/cuentas ----------
// El resto de claves ("Cifras oficiales", "Contactos de emergencia", etc.) se
// siguen editando como JSON crudo — esto cubre primero las dos que tienen
// nombres de organizaciones y datos de cuentas reales, donde un error de JSON
// puede desviar una donación real.

const CONFIG_LISTAS = {
  'directorio-ayuda': {
    campoLista: 'iniciativas',
    etiquetaAgregar: 'Agregar iniciativa',
    etiquetaVacio: 'Todavía no hay ninguna iniciativa cargada.',
    campos: [
      { clave: 'nombre', etiqueta: 'Nombre', tipo: 'texto', requerido: true },
      { clave: 'nivel_confianza', etiqueta: 'Nivel de confianza', tipo: 'select', requerido: true,
        opciones: [
          { valor: 'oficial', etiqueta: 'Oficial' },
          { valor: 'institucional', etiqueta: 'Institucional' },
          { valor: 'colectivo', etiqueta: 'Colectivo' },
          { valor: 'individual', etiqueta: 'Individual' },
        ] },
      { clave: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
      { clave: 'ubicacion', etiqueta: 'Ubicación', tipo: 'texto' },
      { clave: 'horario', etiqueta: 'Horario', tipo: 'texto' },
      { clave: 'recibe', etiqueta: 'Qué recibe (una línea por elemento)', tipo: 'lista-texto' },
      { clave: 'no_recibe', etiqueta: 'Qué NO recibe (una línea por elemento)', tipo: 'lista-texto' },
      { clave: 'cuenta', etiqueta: 'Cuenta', tipo: 'texto' },
      { clave: 'llave_bre_b', etiqueta: 'Llave Bre-B', tipo: 'texto' },
      { clave: 'llave_daviplata', etiqueta: 'Llave Daviplata', tipo: 'texto' },
      { clave: 'cuenta_bancolombia_ahorros', etiqueta: 'Cuenta Bancolombia (ahorros)', tipo: 'texto' },
      { clave: 'contacto_whatsapp', etiqueta: 'WhatsApp de contacto', tipo: 'texto' },
      { clave: 'puntos_entrega', etiqueta: 'Puntos de entrega (una línea por dirección)', tipo: 'lista-texto' },
      { clave: 'fuente', etiqueta: 'Fuente', tipo: 'texto' },
      { clave: 'nota_verificacion', etiqueta: 'Nota de verificación', tipo: 'texto' },
    ],
  },
  'cuentas-y-voces': {
    categorias: [
      { clave: 'oficiales', etiqueta: 'Oficiales' },
      { clave: 'medios_locales', etiqueta: 'Medios locales' },
      { clave: 'ong_con_trayectoria', etiqueta: 'ONG con trayectoria' },
      { clave: 'profesionales_tecnicos', etiqueta: 'Profesionales técnicos' },
      { clave: 'influencers_y_personalidades', etiqueta: 'Influencers y personalidades' },
    ],
    etiquetaVacio: 'Todavía no hay ninguna cuenta cargada en esta categoría.',
    campos: [
      { clave: 'nombre', etiqueta: 'Nombre', tipo: 'texto', requerido: true },
      { clave: 'canal', etiqueta: 'Canal (web, WhatsApp, red social...)', tipo: 'texto' },
      { clave: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
      { clave: 'estado_verificacion', etiqueta: 'Estado de verificación (texto libre, ej: "confirmado" o "confirmado — fuente oficial")', tipo: 'texto' },
    ],
  },
};

// Estado en memoria del formulario abierto: array de items (directorio-ayuda)
// u objeto { categoria: [items] } (cuentas-y-voces). Se reconstruye el JSON
// completo a partir de esto al guardar.
let estadoListaActual = null;

function crearCampoItem(campo, valorActual) {
  const contenedor = document.createElement('div');
  const etiqueta = document.createElement('label');
  etiqueta.className = 'ph-etiqueta';
  etiqueta.textContent = campo.etiqueta + (campo.requerido ? ' *' : '');

  let control;
  if (campo.tipo === 'textarea' || campo.tipo === 'lista-texto') {
    control = document.createElement('textarea');
    control.rows = campo.tipo === 'lista-texto' ? 3 : 2;
    control.value = campo.tipo === 'lista-texto'
      ? (Array.isArray(valorActual) ? valorActual.join('\n') : '')
      : (valorActual || '');
  } else if (campo.tipo === 'select') {
    control = document.createElement('select');
    campo.opciones.forEach((opcion) => {
      const el = document.createElement('option');
      el.value = opcion.valor;
      el.textContent = opcion.etiqueta;
      if (opcion.valor === (valorActual || '')) el.selected = true;
      control.appendChild(el);
    });
  } else {
    control = document.createElement('input');
    control.type = 'text';
    control.value = valorActual || '';
  }
  control.className = 'ph-input';
  control.dataset.campo = campo.clave;
  control.dataset.tipo = campo.tipo;

  contenedor.appendChild(etiqueta);
  contenedor.appendChild(control);
  return contenedor;
}

function crearTarjetaItem(config, item, alEliminar) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'ph-tarjeta-item';

  config.campos.forEach((campo) => {
    tarjeta.appendChild(crearCampoItem(campo, item[campo.clave]));
  });

  const botonEliminar = document.createElement('button');
  botonEliminar.type = 'button';
  botonEliminar.className = 'ph-boton-eliminar-item';
  botonEliminar.textContent = 'Eliminar esta tarjeta';
  botonEliminar.addEventListener('click', alEliminar);
  tarjeta.appendChild(botonEliminar);

  return tarjeta;
}

function leerItemDeTarjeta(tarjeta) {
  const item = {};
  tarjeta.querySelectorAll('[data-campo]').forEach((control) => {
    const { campo, tipo } = control.dataset;
    if (tipo === 'lista-texto') {
      const lineas = control.value.split('\n').map((l) => l.trim()).filter(Boolean);
      item[campo] = lineas.length > 0 ? lineas : null;
    } else {
      item[campo] = control.value.trim() ? control.value.trim() : null;
    }
  });
  return item;
}

function renderEditorLista(clave, datos) {
  const config = CONFIG_LISTAS[clave];
  editorListaContenido.innerHTML = '';
  ocultarError(editorListaError);
  editorListaEstado.textContent = '';

  if (config.campoLista) {
    // Lista simple: directorio-ayuda
    estadoListaActual = Array.isArray(datos[config.campoLista]) ? datos[config.campoLista] : [];
    const grupo = document.createElement('div');
    grupo.className = 'ph-lista-items';
    grupo.dataset.grupo = 'unico';
    if (estadoListaActual.length === 0) {
      const vacio = document.createElement('p');
      vacio.className = 'ph-texto-ayuda';
      vacio.textContent = config.etiquetaVacio;
      grupo.appendChild(vacio);
    }
    estadoListaActual.forEach((item, indice) => {
      const tarjeta = crearTarjetaItem(config, item, () => {
        tarjeta.remove();
        if (grupo.querySelectorAll('.ph-tarjeta-item').length === 0) {
          const vacio = document.createElement('p');
          vacio.className = 'ph-texto-ayuda';
          vacio.dataset.marcadorVacio = 'true';
          vacio.textContent = config.etiquetaVacio;
          grupo.appendChild(vacio);
        }
      });
      grupo.appendChild(tarjeta);
    });
    editorListaContenido.appendChild(grupo);

    const botonAgregar = document.createElement('button');
    botonAgregar.type = 'button';
    botonAgregar.className = 'ph-boton ph-boton--secundario';
    botonAgregar.textContent = '+ ' + config.etiquetaAgregar;
    botonAgregar.addEventListener('click', () => {
      grupo.querySelectorAll('[data-marcador-vacio]').forEach((el) => el.remove());
      const tarjeta = crearTarjetaItem(config, {}, () => tarjeta.remove());
      grupo.appendChild(tarjeta);
      tarjeta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    editorListaContenido.appendChild(botonAgregar);
  } else {
    // Lista por categorías: cuentas-y-voces
    config.categorias.forEach((categoria) => {
      const seccion = document.createElement('fieldset');
      seccion.className = 'ph-fieldset-categoria';
      const leyenda = document.createElement('legend');
      leyenda.textContent = categoria.etiqueta;
      seccion.appendChild(leyenda);

      const grupo = document.createElement('div');
      grupo.className = 'ph-lista-items';
      grupo.dataset.grupo = categoria.clave;

      const itemsCategoria = Array.isArray(datos[categoria.clave]) ? datos[categoria.clave] : [];
      if (itemsCategoria.length === 0) {
        const vacio = document.createElement('p');
        vacio.className = 'ph-texto-ayuda';
        vacio.dataset.marcadorVacio = 'true';
        vacio.textContent = config.etiquetaVacio;
        grupo.appendChild(vacio);
      }
      itemsCategoria.forEach((item) => {
        const tarjeta = crearTarjetaItem(config, item, () => {
          tarjeta.remove();
          if (grupo.querySelectorAll('.ph-tarjeta-item').length === 0) {
            const vacio = document.createElement('p');
            vacio.className = 'ph-texto-ayuda';
            vacio.dataset.marcadorVacio = 'true';
            vacio.textContent = config.etiquetaVacio;
            grupo.appendChild(vacio);
          }
        });
        grupo.appendChild(tarjeta);
      });
      seccion.appendChild(grupo);

      const botonAgregar = document.createElement('button');
      botonAgregar.type = 'button';
      botonAgregar.className = 'ph-boton ph-boton--secundario';
      botonAgregar.textContent = '+ Agregar a ' + categoria.etiqueta;
      botonAgregar.addEventListener('click', () => {
        grupo.querySelectorAll('[data-marcador-vacio]').forEach((el) => el.remove());
        const tarjeta = crearTarjetaItem(config, {}, () => tarjeta.remove());
        grupo.appendChild(tarjeta);
        tarjeta.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      seccion.appendChild(botonAgregar);

      editorListaContenido.appendChild(seccion);
    });
  }
}

function recolectarDatosLista(clave) {
  const config = CONFIG_LISTAS[clave];
  const camposRequeridos = config.campos.filter((c) => c.requerido).map((c) => c.clave);

  function validarYLeer(grupo) {
    const items = [];
    for (const tarjeta of grupo.querySelectorAll('.ph-tarjeta-item')) {
      const item = leerItemDeTarjeta(tarjeta);
      for (const claveRequerida of camposRequeridos) {
        if (!item[claveRequerida]) {
          const campoInfo = config.campos.find((c) => c.clave === claveRequerida);
          throw new Error(`Falta "${campoInfo.etiqueta}" en una de las tarjetas — es obligatorio.`);
        }
      }
      items.push(item);
    }
    return items;
  }

  if (config.campoLista) {
    const grupo = editorListaContenido.querySelector('[data-grupo="unico"]');
    return { [config.campoLista]: validarYLeer(grupo) };
  }

  const resultado = {};
  config.categorias.forEach((categoria) => {
    const grupo = editorListaContenido.querySelector(`[data-grupo="${categoria.clave}"]`);
    resultado[categoria.clave] = validarYLeer(grupo);
  });
  return resultado;
}

botonGuardarLista.addEventListener('click', async () => {
  ocultarError(editorListaError);
  editorListaEstado.textContent = '';

  let datos;
  try {
    datos = recolectarDatosLista(claveActiva);
  } catch (error) {
    mostrarError(editorListaError, error.message);
    return;
  }

  try {
    await peticion(`/admin/api/archivos/${claveActiva}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    editorListaEstado.textContent = 'Guardado.';
    cargarListaArchivos();
  } catch (error) {
    mostrarError(editorListaError, error.message);
  }
});

function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.hidden = false;
}
function ocultarError(elemento) {
  elemento.hidden = true;
}

async function peticion(ruta, opciones) {
  const respuesta = await fetch(ruta, { credentials: 'same-origin', ...opciones });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.error || 'Ocurrió un error inesperado.');
  return datos;
}

async function revisarSesion() {
  const { autenticado } = await peticion('/admin/api/sesion');
  if (autenticado) {
    mostrarPanel();
  } else {
    mostrarLogin();
  }
}

function mostrarLogin() {
  vistaLogin.hidden = false;
  vistaPanel.hidden = true;
  botonSalir.hidden = true;
}

function mostrarPanel() {
  vistaLogin.hidden = true;
  vistaPanel.hidden = false;
  botonSalir.hidden = false;
  cargarListaArchivos();
}

formLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  ocultarError(errorLogin);
  try {
    await peticion('/admin/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contrasena: campoContrasena.value }),
    });
    campoContrasena.value = '';
    mostrarPanel();
  } catch (error) {
    mostrarError(errorLogin, error.message);
  }
});

botonSalir.addEventListener('click', async () => {
  await peticion('/admin/api/logout', { method: 'POST' });
  mostrarLogin();
});

async function cargarListaArchivos() {
  const archivos = await peticion('/admin/api/archivos');
  listaArchivos.innerHTML = '';
  archivos.forEach((archivo) => {
    const boton = document.createElement('button');
    boton.className = 'ph-archivo';
    boton.dataset.clave = archivo.clave;
    const pendiente = !archivo.ultima_revision_por_equipo;
    boton.innerHTML = `
      <span>${archivo.etiqueta}</span>
      <span class="ph-archivo__revision" data-pendiente="${pendiente}">
        ${pendiente ? 'Sin revisar todavía' : 'Revisado: ' + archivo.ultima_revision_por_equipo}
      </span>
    `;
    boton.addEventListener('click', () => abrirArchivo(archivo.clave, archivo.etiqueta));
    listaArchivos.appendChild(boton);
  });
}

async function abrirArchivo(clave, etiqueta) {
  claveActiva = clave;
  ocultarError(editorError);
  editorEstado.textContent = '';

  document.querySelectorAll('.ph-archivo').forEach((el) => {
    el.classList.toggle('activo', el.dataset.clave === clave);
  });

  const respuesta = await fetch(`/admin/api/archivos/${clave}`, { credentials: 'same-origin' });
  const textoCrudo = await respuesta.text();
  const datos = JSON.parse(textoCrudo);

  editorVacio.hidden = true;

  if (CONFIG_LISTAS[clave]) {
    editorActivo.hidden = true;
    editorLista.hidden = false;
    editorListaTitulo.textContent = etiqueta;
    renderEditorLista(clave, datos);
    return;
  }

  editorLista.hidden = true;
  editorActivo.hidden = false;
  editorTitulo.textContent = etiqueta;
  editorTextarea.value = JSON.stringify(datos, null, 2);

  const revisado = datos._meta && datos._meta.ultima_revision_por_equipo;
  editorRevision.textContent = revisado ? `Revisado: ${revisado}` : 'Sin revisar todavía';
  editorRevision.dataset.ok = String(Boolean(revisado));
}

botonGuardar.addEventListener('click', async () => {
  ocultarError(editorError);
  editorEstado.textContent = '';

  let objetoValidado;
  try {
    objetoValidado = JSON.parse(editorTextarea.value);
  } catch (error) {
    mostrarError(editorError, 'El JSON tiene un error de sintaxis: ' + error.message);
    return;
  }

  try {
    await peticion(`/admin/api/archivos/${claveActiva}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(objetoValidado),
    });
    editorEstado.textContent = 'Guardado.';
    cargarListaArchivos();
  } catch (error) {
    mostrarError(editorError, error.message);
  }
});

botonMarcarRevisado.addEventListener('click', async () => {
  ocultarError(editorError);
  try {
    await peticion(`/admin/api/archivos/${claveActiva}/marcar-revisado`, { method: 'POST' });
    editorEstado.textContent = 'Marcado como revisado hoy.';
    abrirArchivo(claveActiva, editorTitulo.textContent);
    cargarListaArchivos();
  } catch (error) {
    mostrarError(editorError, error.message);
  }
});

// ---------- Tabs principales (Archivos / Publicaciones) ----------

const tabArchivos = document.getElementById('tab-archivos');
const tabPublicaciones = document.getElementById('tab-publicaciones');
const vistaArchivos = document.getElementById('vista-archivos');
const vistaPublicaciones = document.getElementById('vista-publicaciones');

tabArchivos.addEventListener('click', () => {
  tabArchivos.classList.add('activo');
  tabPublicaciones.classList.remove('activo');
  document.getElementById('tab-boletines').classList.remove('activo');
  vistaArchivos.hidden = false;
  vistaPublicaciones.hidden = true;
  document.getElementById('vista-boletines').hidden = true;
});

tabPublicaciones.addEventListener('click', () => {
  tabPublicaciones.classList.add('activo');
  tabArchivos.classList.remove('activo');
  tabBoletines.classList.remove('activo');
  vistaPublicaciones.hidden = false;
  vistaArchivos.hidden = true;
  vistaBoletines.hidden = true;
  cargarPublicaciones();
});

const tabBoletines = document.getElementById('tab-boletines');
const vistaBoletines = document.getElementById('vista-boletines');

tabBoletines.addEventListener('click', () => {
  tabBoletines.classList.add('activo');
  tabArchivos.classList.remove('activo');
  tabPublicaciones.classList.remove('activo');
  vistaBoletines.hidden = false;
  vistaArchivos.hidden = true;
  vistaPublicaciones.hidden = true;
  cargarBoletines();
});

// ---------- Modo de publicación: archivo o enlace ----------

const modoArchivo = document.getElementById('modo-archivo');
const modoEnlace = document.getElementById('modo-enlace');
const camposArchivo = document.getElementById('campos-archivo');
const camposEnlace = document.getElementById('campos-enlace');
let modoActual = 'archivo';

modoArchivo.addEventListener('click', () => {
  modoActual = 'archivo';
  modoArchivo.classList.add('activo');
  modoEnlace.classList.remove('activo');
  camposArchivo.hidden = false;
  camposEnlace.hidden = true;
  actualizarVistaPrevia();
});

modoEnlace.addEventListener('click', () => {
  modoActual = 'enlace';
  modoEnlace.classList.add('activo');
  modoArchivo.classList.remove('activo');
  camposEnlace.hidden = false;
  camposArchivo.hidden = true;
  actualizarVistaPrevia();
});

// ---------- Vista previa en vivo ----------

const campoSeccion = document.getElementById('campo-seccion');
const campoNivel = document.getElementById('campo-nivel');
const campoTitulo = document.getElementById('campo-titulo');
const campoDescripcion = document.getElementById('campo-descripcion');
const campoArchivo = document.getElementById('campo-archivo');
const campoUrl = document.getElementById('campo-url');
const tarjetaPrevia = document.getElementById('tarjeta-previa');

const NOMBRES_NIVEL = { oficial: 'Oficial', institucional: 'Institucional', colectivo: 'Colectivo', individual: 'Individual' };

function marcadoTarjetaPublicacion(pub, urlArchivoLocal) {
  const nivelTexto = NOMBRES_NIVEL[pub.nivel_confianza] || pub.nivel_confianza;
  let media = '';
  if (pub.tipo_presentacion === 'alojado' && urlArchivoLocal) {
    media = pub.tipo_archivo === 'video'
      ? `<video class="ph-tarjeta-publicacion__media" src="${urlArchivoLocal}" controls></video>`
      : `<img class="ph-tarjeta-publicacion__media" src="${urlArchivoLocal}" alt="">`;
  }
  const enlace = pub.tipo_presentacion === 'tarjeta_enlace' && pub.url_externa
    ? `<a class="ph-tarjeta-publicacion__enlace" href="${pub.url_externa}" target="_blank" rel="noopener">Ver publicación original →</a>`
    : '';
  return `
    ${media}
    <div class="ph-tarjeta-publicacion__cuerpo">
      <span class="ph-tarjeta-publicacion__nivel">${nivelTexto}</span>
      <p class="ph-tarjeta-publicacion__titulo">${pub.titulo || '(sin título)'}</p>
      ${pub.descripcion ? `<p class="ph-tarjeta-publicacion__descripcion">${pub.descripcion}</p>` : ''}
      ${enlace}
      <div class="ph-tarjeta-publicacion__meta">${pub.seccion || ''} · ${pub.fecha_publicado || 'hoy'}</div>
    </div>
  `;
}

function actualizarVistaPrevia() {
  const previa = {
    seccion: campoSeccion.value,
    nivel_confianza: campoNivel.value,
    titulo: campoTitulo.value,
    descripcion: campoDescripcion.value,
    tipo_presentacion: modoActual === 'archivo' ? 'alojado' : 'tarjeta_enlace',
    url_externa: campoUrl.value,
    tipo_archivo: campoArchivo.files[0] && campoArchivo.files[0].type.startsWith('video') ? 'video' : 'imagen',
  };

  tarjetaPrevia.className = 'ph-tarjeta-publicacion';
  tarjetaPrevia.dataset.nivel = previa.nivel_confianza;

  const archivoLocal = campoArchivo.files[0] ? URL.createObjectURL(campoArchivo.files[0]) : null;
  tarjetaPrevia.innerHTML = marcadoTarjetaPublicacion(previa, archivoLocal);
}

[campoSeccion, campoNivel, campoTitulo, campoDescripcion, campoUrl].forEach((el) => {
  el.addEventListener('input', actualizarVistaPrevia);
});
campoArchivo.addEventListener('change', actualizarVistaPrevia);

// ---------- Publicar (guardar de verdad) ----------

const formPublicacion = document.getElementById('form-publicacion');
const errorPublicacion = document.getElementById('error-publicacion');

formPublicacion.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  ocultarError(errorPublicacion);

  try {
    if (modoActual === 'archivo') {
      if (!campoArchivo.files[0]) throw new Error('Selecciona un archivo primero.');
      const formData = new FormData();
      formData.append('archivo', campoArchivo.files[0]);
      formData.append('seccion', campoSeccion.value);
      formData.append('nivel_confianza', campoNivel.value);
      formData.append('titulo', campoTitulo.value);
      formData.append('descripcion', campoDescripcion.value);

      const respuesta = await fetch('/admin/api/publicaciones/archivo', { method: 'POST', credentials: 'same-origin', body: formData });
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error);
    } else {
      await peticion('/admin/api/publicaciones/enlace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seccion: campoSeccion.value,
          nivel_confianza: campoNivel.value,
          titulo: campoTitulo.value,
          descripcion: campoDescripcion.value,
          url_externa: campoUrl.value,
        }),
      });
    }

    formPublicacion.reset();
    tarjetaPrevia.className = 'ph-tarjeta-publicacion ph-tarjeta-publicacion--vacia';
    tarjetaPrevia.textContent = 'Completa el formulario para ver la vista previa.';
    cargarPublicaciones();
  } catch (error) {
    mostrarError(errorPublicacion, error.message);
  }
});

// ---------- Lista de ya publicado ----------

const listaPublicaciones = document.getElementById('lista-publicaciones');

async function cargarPublicaciones() {
  const publicaciones = await peticion('/admin/api/publicaciones');
  listaPublicaciones.innerHTML = publicaciones.map((pub) => `
    <div class="ph-tarjeta-publicacion" data-nivel="${pub.nivel_confianza}">
      ${marcadoTarjetaPublicacion(pub, pub.archivo)}
      <div class="ph-tarjeta-publicacion__cuerpo" style="padding-top:0">
        <button class="ph-tarjeta-publicacion__eliminar" data-id="${pub.id}">Eliminar</button>
      </div>
    </div>
  `).join('') || '<p class="ph-texto-ayuda">Todavía no hay publicaciones.</p>';

  listaPublicaciones.querySelectorAll('.ph-tarjeta-publicacion__eliminar').forEach((boton) => {
    boton.addEventListener('click', async () => {
      await peticion(`/admin/api/publicaciones/${boton.dataset.id}`, { method: 'DELETE' });
      cargarPublicaciones();
    });
  });
}

// ---------- Boletines oficiales ----------

const NOMBRES_NIVEL_GOBIERNO = { alcaldia: 'Alcaldía', departamento: 'Departamento', nacion: 'Nación' };

const formBoletin = document.getElementById('form-boletin');
const errorBoletin = document.getElementById('error-boletin');
const listaBoletines = document.getElementById('lista-boletines');

function marcadoTarjetaBoletin(b) {
  const esPdf = b.tipo_archivo === 'documento';
  const media = esPdf
    ? `<a class="ph-tarjeta-publicacion__media ph-tarjeta-publicacion__media--pdf" href="${b.archivo}" target="_blank" rel="noopener">Ver documento PDF →</a>`
    : `<img class="ph-tarjeta-publicacion__media" src="${b.archivo}" alt="">`;
  return `
    ${media}
    <div class="ph-tarjeta-publicacion__cuerpo">
      <span class="ph-tarjeta-publicacion__nivel">${NOMBRES_NIVEL_GOBIERNO[b.nivel_gobierno] || b.nivel_gobierno}</span>
      <p class="ph-tarjeta-publicacion__titulo">${b.titulo}</p>
      <p class="ph-tarjeta-publicacion__descripcion">${b.entidad}${b.descripcion ? ' — ' + b.descripcion : ''}</p>
      <div class="ph-tarjeta-publicacion__meta">
        Boletín: ${b.fecha_del_boletin || 'sin fecha'} · Publicado: ${b.fecha_publicado}
      </div>
      <button class="ph-tarjeta-publicacion__eliminar" data-id="${b.id}">Eliminar</button>
    </div>
  `;
}

async function cargarBoletines() {
  const boletines = await peticion('/admin/api/boletines');
  listaBoletines.innerHTML = boletines.map((b) => `<div class="ph-tarjeta-publicacion">${marcadoTarjetaBoletin(b)}</div>`).join('')
    || '<p class="ph-texto-ayuda">Todavía no hay boletines publicados.</p>';

  listaBoletines.querySelectorAll('.ph-tarjeta-publicacion__eliminar').forEach((boton) => {
    boton.addEventListener('click', async () => {
      await peticion(`/admin/api/boletines/${boton.dataset.id}`, { method: 'DELETE' });
      cargarBoletines();
    });
  });
}

formBoletin.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  ocultarError(errorBoletin);

  const campoArchivoBoletin = document.getElementById('boletin-archivo');
  if (!campoArchivoBoletin.files[0]) {
    mostrarError(errorBoletin, 'Selecciona un archivo primero.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('archivo', campoArchivoBoletin.files[0]);
    formData.append('nivel_gobierno', document.getElementById('boletin-nivel').value);
    formData.append('entidad', document.getElementById('boletin-entidad').value);
    formData.append('titulo', document.getElementById('boletin-titulo').value);
    formData.append('descripcion', document.getElementById('boletin-descripcion').value);
    formData.append('fecha_del_boletin', document.getElementById('boletin-fecha').value);

    const respuesta = await fetch('/admin/api/boletines', { method: 'POST', credentials: 'same-origin', body: formData });
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.error);

    formBoletin.reset();
    cargarBoletines();
  } catch (error) {
    mostrarError(errorBoletin, error.message);
  }
});

revisarSesion();
