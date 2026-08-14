const supabase = require('./supabaseClient');
const contenidoService = require('./contenidoService');
const { fechaHoyColombia } = require('./fechaUtil');

// Claves editables desde el panel ("Archivos de contenido"). "registro-visual" se
// excluyó a propósito: ahora se arma a partir de sismo_publicaciones (sección
// registro-visual), ya no es un bloque de texto suelto para editar aquí.
// Las etiquetas coinciden a propósito con los nombres de sección de la página
// pública (frontend/app/page.tsx) — es lo que ve quien está publicando desde
// aquí, así que si el nombre visible en la página cambia, esta etiqueta debe
// cambiar con él para no generar confusión sobre dónde va a salir cada dato.
const ETIQUETAS = {
  'cifras-oficiales': 'Cifras oficiales (Información oficial)',
  'contactos-emergencia': 'Equipos de socorro (Contactos de emergencia)',
  'directorio-ayuda': 'Directorio verificado de ayuda',
  'plataformas': 'Plataformas útiles',
  'verificado-falso': 'Verificado / Falso',
  'como-solicitar-ayuda-oficial': 'Cómo solicitar ayuda oficial',
  'cuentas-y-voces': 'Cuentas y voces',
};

// Las claves de tipo "singleton" ya traen su propio _meta.ultima_revision_por_equipo
// desde la tabla. Las de tipo "lista" (varias filas) no tienen ese campo todavía —
// se muestra null hasta que se agregue seguimiento de revisión por lista.
const CLAVES_SINGLETON = new Set(['cifras-oficiales', 'contactos-emergencia', 'como-solicitar-ayuda-oficial']);

async function listarArchivosEditables() {
  const resultado = [];
  for (const clave of Object.keys(ETIQUETAS)) {
    const datos = await leerPorClave(clave);
    resultado.push({
      clave,
      etiqueta: ETIQUETAS[clave],
      ultima_revision_por_equipo: datos && datos._meta ? datos._meta.ultima_revision_por_equipo : null,
    });
  }
  return resultado;
}

async function leerPorClave(clave) {
  switch (clave) {
    case 'cifras-oficiales': return contenidoService.obtenerCifrasOficiales();
    case 'contactos-emergencia': return contenidoService.obtenerContactosEmergencia();
    case 'directorio-ayuda': return contenidoService.obtenerDirectorioAyuda();
    case 'plataformas': return contenidoService.obtenerPlataformas();
    case 'verificado-falso': return contenidoService.obtenerVerificadoFalso();
    case 'como-solicitar-ayuda-oficial': return contenidoService.obtenerComoSolicitarAyudaOficial();
    case 'cuentas-y-voces': return contenidoService.obtenerCuentasYVoces();
    default: return null;
  }
}

async function leerCrudoPorClave(clave) {
  const datos = await leerPorClave(clave);
  return datos ? JSON.stringify(datos, null, 2) : null;
}

async function guardarPorClave(clave, textoJSON) {
  if (!Object.prototype.hasOwnProperty.call(ETIQUETAS, clave)) {
    throw new Error('Archivo no reconocido.');
  }

  let datos;
  try {
    datos = JSON.parse(textoJSON);
  } catch (error) {
    throw new Error('El contenido no es JSON válido: ' + error.message);
  }
  if (typeof datos !== 'object' || datos === null || Array.isArray(datos)) {
    throw new Error('El contenido debe ser un objeto JSON, no una lista ni un valor suelto.');
  }

  await escribirPorClave(clave, datos);
  return leerPorClave(clave);
}

async function escribirPorClave(clave, datos) {
  switch (clave) {
    case 'cifras-oficiales': {
      const { error } = await supabase.from('sismo_cifras_oficiales').update({
        buenaventura: datos.buenaventura,
        contexto_nacional: datos.contexto_nacional,
        sismo_principal: datos.sismo_principal,
        replicas_relevantes: datos.replicas_relevantes,
        toque_de_queda: datos.toque_de_queda,
        ultima_revision_por_equipo: datos._meta?.ultima_revision_por_equipo ?? null,
        actualizado_en: new Date().toISOString(),
      }).eq('id', 1);
      if (error) throw error;
      return;
    }
    case 'contactos-emergencia': {
      const { error } = await supabase.from('sismo_contactos_emergencia').update({
        nacionales: datos.nacionales,
        buenaventura: datos.buenaventura,
        salud_mental: datos.salud_mental,
        restablecimiento_contacto_familiar: datos.restablecimiento_contacto_familiar,
        atencion_ciudadano_alcaldia: datos.atencion_ciudadano_alcaldia,
        ultima_revision_por_equipo: datos._meta?.ultima_revision_por_equipo ?? null,
        actualizado_en: new Date().toISOString(),
      }).eq('id', 1);
      if (error) throw error;
      return;
    }
    case 'como-solicitar-ayuda-oficial': {
      const { error } = await supabase.from('sismo_como_solicitar_ayuda').update({
        estado_contenido: datos.estado_contenido,
        nota_transparencia: datos.nota_transparencia,
        lo_que_se_sabe: datos.lo_que_se_sabe,
        pendiente_de_confirmar: datos.pendiente_de_confirmar,
        ultima_revision_por_equipo: datos._meta?.ultima_revision_por_equipo ?? null,
        actualizado_en: new Date().toISOString(),
      }).eq('id', 1);
      if (error) throw error;
      return;
    }
    case 'directorio-ayuda': {
      await reemplazarLista('sismo_directorio_ayuda', (datos.iniciativas || []).map((item, i) => ({ ...item, orden: i })));
      return;
    }
    case 'plataformas': {
      const filas = [
        ...(datos.ciudadanas || []).map((p, i) => ({ categoria: 'ciudadana', ...p, orden: i })),
        ...(datos.oficiales || []).map((p, i) => ({ categoria: 'oficial', ...p, orden: i })),
      ];
      await reemplazarLista('sismo_plataformas', filas);
      return;
    }
    case 'verificado-falso': {
      await reemplazarLista('sismo_verificado_falso', datos.aclaraciones_oficiales || []);
      return;
    }
    case 'cuentas-y-voces': {
      const filas = [];
      for (const categoria of ['oficiales', 'medios_locales', 'ong_con_trayectoria', 'profesionales_tecnicos', 'influencers_y_personalidades']) {
        (datos[categoria] || []).forEach((item, i) => filas.push({ categoria, ...item, orden: i }));
      }
      await reemplazarLista('sismo_cuentas_y_voces', filas);
      return;
    }
    default:
      throw new Error('Archivo no reconocido.');
  }
}

// Reemplaza todas las filas de una tabla de tipo "lista" — simple y predecible:
// se borra todo y se reinserta lo que venga en el JSON editado. Aceptable porque
// son tablas pequeñas (decenas de filas, no miles).
async function reemplazarLista(tabla, filasNuevas) {
  const { error: errorBorrado } = await supabase.from(tabla).delete().gte('orden', -1);
  if (errorBorrado) throw errorBorrado;
  if (filasNuevas.length === 0) return;
  const { error: errorInsercion } = await supabase.from(tabla).insert(filasNuevas);
  if (errorInsercion) throw errorInsercion;
}

async function marcarRevisadoHoy(clave) {
  if (!CLAVES_SINGLETON.has(clave)) {
    throw new Error('Esta sección todavía no tiene seguimiento de revisión individual (es una lista, no un bloque único).');
  }
  const datos = await leerPorClave(clave);
  datos._meta.ultima_revision_por_equipo = fechaHoyColombia();
  await escribirPorClave(clave, datos);
  return leerPorClave(clave);
}

module.exports = {
  listarArchivosEditables,
  leerCrudoPorClave,
  guardarPorClave,
  marcarRevisadoHoy,
};
