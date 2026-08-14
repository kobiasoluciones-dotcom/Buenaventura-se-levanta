// Buenaventura esta en America/Bogota (UTC-5). new Date().toISOString() da la
// fecha en UTC, que despues de las 7pm hora Colombia ya muestra el dia
// siguiente — confuso para un sitio que promete fecha exacta en cada dato.
function fechaHoyColombia() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Bogota' });
}

module.exports = { fechaHoyColombia };
