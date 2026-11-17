const jwt = require('jsonwebtoken');

// 401: sin token, alterado o vencido
const verificarToken = (req, res, next) => {
  const [tipo, token] = (req.headers.authorization || '').split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o vencido' });
  }
};

// 403: token válido pero rol insuficiente
const exigirRol = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario.rol)) {
    return res.status(403).json({ error: 'Permiso insuficiente' });
  }
  next();
};

module.exports = { verificarToken, exigirRol };
