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

let claveActiva = null;

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

  editorVacio.hidden = true;
  editorActivo.hidden = false;
  editorTitulo.textContent = etiqueta;
  editorTextarea.value = JSON.stringify(JSON.parse(textoCrudo), null, 2);

  const datos = JSON.parse(textoCrudo);
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
