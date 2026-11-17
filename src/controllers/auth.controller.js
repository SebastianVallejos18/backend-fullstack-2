const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repo = require('../repositories/usuario.repository');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// El rol lo asigna el servidor: quien se registra siempre es CLIENTE
const registro = async (req, res) => {
  const { nombre, email, password } = req.body ?? {};
  if (!nombre || !EMAIL_RE.test(email || '') || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'nombre, email válido y password (mínimo 8 caracteres) son obligatorios' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await repo.crear({
      nombre: String(nombre).trim(),
      email: email.toLowerCase(),
      passwordHash,
      rol: 'CLIENTE',
    });
    res.status(201).json(usuario);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'El email ya está registrado' });
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Error genérico: no revela si falló el email o la contraseña
const login = async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son obligatorios' });
  }
  try {
    const u = await repo.buscarPorEmail(String(email).toLowerCase());
    const valido = u && u.activo && (await bcrypt.compare(String(password), u.password_hash));
    if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: u.id, rol: u.rol }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    });
    res.json({ token, usuario: { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = { registro, login };
