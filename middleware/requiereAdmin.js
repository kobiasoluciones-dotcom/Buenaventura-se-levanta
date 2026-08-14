const adminAuthService = require('../services/adminAuthService');

const NOMBRE_COOKIE = 'bsl_admin_token';

function requiereAdmin(req, res, next) {
  const token = req.cookies ? req.cookies[NOMBRE_COOKIE] : null;
  if (!adminAuthService.sesionValida(token)) {
    return res.status(401).json({ error: 'No autenticado.' });
  }
  next();
}

module.exports = { requiereAdmin, NOMBRE_COOKIE };
