const crypto = require('crypto');

// Sesion en memoria: suficiente para un solo proceso pequeno (v1). Si el
// servidor se reinicia, todos quedan deslogueados — aceptable para un panel
// interno de un equipo chico. Migrar a sesion persistente si esto crece.
const sesionesValidas = new Set();

function contrasenaConfigurada() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function iniciarSesion(contrasenaIngresada) {
  if (!contrasenaConfigurada()) {
    throw new Error('ADMIN_PASSWORD no esta configurada en el servidor.');
  }
  const esperada = Buffer.from(process.env.ADMIN_PASSWORD);
  const recibida = Buffer.from(contrasenaIngresada || '');
  const coincide =
    esperada.length === recibida.length &&
    crypto.timingSafeEqual(esperada, recibida);

  if (!coincide) return null;

  const token = crypto.randomBytes(32).toString('hex');
  sesionesValidas.add(token);
  return token;
}

function cerrarSesion(token) {
  sesionesValidas.delete(token);
}

function sesionValida(token) {
  return Boolean(token) && sesionesValidas.has(token);
}

module.exports = { contrasenaConfigurada, iniciarSesion, cerrarSesion, sesionValida };
