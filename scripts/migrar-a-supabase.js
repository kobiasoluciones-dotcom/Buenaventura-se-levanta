require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const DATA_DIR = path.join(__dirname, '..', 'data');

function leerJSON(nombre) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, nombre), 'utf-8'));
}

async function upsertSingleton(tabla, fila) {
  const { error } = await supabase.from(tabla).upsert({ id: 1, ...fila });
  console.log(tabla + ':', error ? 'ERROR - ' + error.message : 'OK');
}

async function insertarFilas(tabla, filas) {
  if (filas.length === 0) {
    console.log(tabla + ': sin filas para migrar');
    return;
  }
  const { error } = await supabase.from(tabla).insert(filas);
  console.log(tabla + ':', error ? 'ERROR - ' + error.message : `OK (${filas.length} filas)`);
}

async function main() {
  // ---------- Singletons ----------

  const cifras = leerJSON('cifras-oficiales.json');
  await upsertSingleton('sismo_cifras_oficiales', {
    buenaventura: cifras.buenaventura,
    contexto_nacional: cifras.contexto_nacional,
    sismo_principal: cifras.sismo_principal,
    replicas_relevantes: cifras.replicas_relevantes,
    toque_de_queda: cifras.toque_de_queda,
    ultima_revision_por_equipo: cifras._meta?.ultima_revision_por_equipo || null,
  });

  const contactos = leerJSON('contactos-emergencia.json');
  await upsertSingleton('sismo_contactos_emergencia', {
    nacionales: contactos.nacionales,
    buenaventura: contactos.buenaventura,
    salud_mental: contactos.salud_mental,
    restablecimiento_contacto_familiar: contactos.restablecimiento_contacto_familiar,
    atencion_ciudadano_alcaldia: contactos.atencion_ciudadano_alcaldia,
    ultima_revision_por_equipo: contactos._meta?.ultima_revision_por_equipo || null,
  });

  const ayudaOficial = leerJSON('como-solicitar-ayuda-oficial.json');
  await upsertSingleton('sismo_como_solicitar_ayuda', {
    estado_contenido: ayudaOficial.estado_contenido,
    nota_transparencia: ayudaOficial.nota_transparencia,
    lo_que_se_sabe: ayudaOficial.lo_que_se_sabe,
    pendiente_de_confirmar: ayudaOficial.pendiente_de_confirmar,
    ultima_revision_por_equipo: ayudaOficial._meta?.ultima_revision_por_equipo || null,
  });

  // ---------- Listas ----------

  const directorio = leerJSON('directorio-ayuda.json');
  await insertarFilas('sismo_directorio_ayuda', directorio.iniciativas.map((item, i) => ({
    nombre: item.nombre,
    nivel_confianza: item.nivel_confianza,
    descripcion: item.descripcion || null,
    ubicacion: item.ubicacion || null,
    horario: item.horario || null,
    recibe: item.recibe || null,
    no_recibe: item.no_recibe || null,
    cuenta: item.cuenta || null,
    llave_bre_b: item.llave_bre_b || null,
    llave_daviplata: item.llave_daviplata || null,
    cuenta_bancolombia_ahorros: item.cuenta_bancolombia_ahorros || null,
    contacto_whatsapp: item.contacto_whatsapp || null,
    puntos_entrega: item.puntos_entrega || null,
    fuente: item.fuente || null,
    nota_verificacion: item.nota_verificacion || null,
    orden: i,
  })));

  const plataformas = leerJSON('plataformas.json');
  const filasPlataformas = [
    ...plataformas.ciudadanas.map((p, i) => ({ categoria: 'ciudadana', ...p, orden: i })),
    ...plataformas.oficiales.map((p, i) => ({ categoria: 'oficial', ...p, orden: i })),
  ];
  await insertarFilas('sismo_plataformas', filasPlataformas);

  const verificadoFalso = leerJSON('verificado-falso.json');
  await insertarFilas('sismo_verificado_falso', verificadoFalso.aclaraciones_oficiales.map((item) => ({
    afirmacion: item.afirmacion,
    estado: item.estado,
    explicacion: item.explicacion,
    fuente: item.fuente || null,
  })));

  const cuentas = leerJSON('cuentas-y-voces.json');
  const filasCuentas = [];
  for (const categoria of ['oficiales', 'medios_locales', 'ong_con_trayectoria', 'profesionales_tecnicos', 'influencers_y_personalidades']) {
    (cuentas[categoria] || []).forEach((item, i) => {
      filasCuentas.push({
        categoria,
        nombre: item.nombre,
        canal: item.canal || null,
        descripcion: item.descripcion || null,
        estado_verificacion: item.estado_verificacion || null,
        orden: i,
      });
    });
  }
  await insertarFilas('sismo_cuentas_y_voces', filasCuentas);

  const publicaciones = leerJSON('publicaciones.json');
  await insertarFilas('sismo_publicaciones', publicaciones.publicaciones.map((p) => ({
    seccion: p.seccion,
    tipo_presentacion: p.tipo_presentacion,
    titulo: p.titulo,
    descripcion: p.descripcion || null,
    nivel_confianza: p.nivel_confianza,
    archivo: p.archivo || null,
    tipo_archivo: p.tipo_archivo || null,
    url_externa: p.url_externa || null,
    fecha_publicado: p.fecha_publicado,
    publicado_por: p.publicado_por,
  })));

  const boletines = leerJSON('boletines-oficiales.json');
  await insertarFilas('sismo_boletines_oficiales', boletines.boletines.map((b) => ({
    nivel_gobierno: b.nivel_gobierno,
    entidad: b.entidad,
    titulo: b.titulo,
    descripcion: b.descripcion || null,
    archivo: b.archivo,
    tipo_archivo: b.tipo_archivo,
    fecha_del_boletin: b.fecha_del_boletin || null,
    fecha_publicado: b.fecha_publicado,
    publicado_por: b.publicado_por,
  })));

  console.log('\nMigración de datos completa.');
}

main();
