const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const RAIZ = path.join(__dirname, '..', '..');
const SITIO_APROBADO = 'https://buenaventura-se-levanta.millerocoro.chatgpt.site';
const FUENTE_SERVIDOR = fs.readFileSync(path.join(RAIZ, 'server.js'), 'utf8');

test('la raíz dirige al diseño visual aprobado', () => {
  assert.match(FUENTE_SERVIDOR, new RegExp(SITIO_APROBADO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(FUENTE_SERVIDOR, /app\.get\('\/',[\s\S]*res\.redirect\(302, PUBLIC_SITE_URL\)/);
});

test('CORS público queda limitado al origen configurado y a lectura', () => {
  assert.match(FUENTE_SERVIDOR, /process\.env\.ALLOWED_ORIGINS/);
  assert.match(FUENTE_SERVIDOR, /ORIGENES_PERMITIDOS\.has\(origen\)/);
  assert.match(FUENTE_SERVIDOR, /Access-Control-Allow-Methods', 'GET, OPTIONS'/);
  assert.match(FUENTE_SERVIDOR, /app\.use\('\/api'/);
});

test('los índices públicos descartados no forman parte del portal', () => {
  assert.equal(fs.existsSync(path.join(RAIZ, 'public', 'index.html')), false);
  assert.equal(fs.existsSync(path.join(RAIZ, 'public', 'index_premium.html')), false);
});

test('Supabase admite las secciones del diseño y el bucket público', () => {
  const migracionInicial = fs.readFileSync(path.join(RAIZ, 'supabase', 'migrations', '001_crear_tablas_sismo.sql'), 'utf8');
  const migracionSecciones = fs.readFileSync(path.join(RAIZ, 'supabase', 'migrations', '002_ampliar_secciones_publicaciones.sql'), 'utf8');

  for (const seccion of ['ofrecimientos', 'puntos-acopio', 'necesidades', 'salud', 'registro-visual', 'noticias']) {
    assert.match(`${migracionInicial}\n${migracionSecciones}`, new RegExp(`'${seccion}'`));
  }
  assert.match(migracionInicial, /sismo-archivos/);
  assert.match(migracionInicial, /public\)\s*values\s*\('sismo-archivos',\s*'sismo-archivos',\s*true\)/i);
});
