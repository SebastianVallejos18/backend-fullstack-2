const repo = require('../repositories/usuario.repository');

const ROLES = ['ADMIN', 'VENDEDOR', 'CLIENTE'];
const idValido = (valor) => Number.isInteger(Number(valor)) && Number(valor) > 0;

const listarUsuarios = async (req, res) => {
  try {
    res.json(await repo.listar());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar usuarios' });
  }
};

// Un usuario solo puede ver su propia cuenta; el ADMIN puede ver cualquiera
const obtenerUsuario = async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ error: 'id inválido' });
  const id = Number(req.params.id);
  if (req.usuario.rol !== 'ADMIN' && req.usuario.id !== id) {
    return res.status(403).json({ error: 'Permiso insuficiente' });
  }
  try {
    const usuario = await repo.buscarPorId(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar el usuario' });
  }
};

const actualizarUsuario = async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ error: 'id inválido' });
  const { nombre, rol } = req.body ?? {};
  if (nombre === undefined && rol === undefined) {
    return res.status(400).json({ error: 'Debe enviar nombre o rol' });
  }
  if (nombre !== undefined && !String(nombre).trim()) {
    return res.status(400).json({ error: 'nombre no puede estar vacío' });
  }
  if (rol !== undefined && !ROLES.includes(rol)) {
    return res.status(400).json({ error: 'rol debe ser ADMIN, VENDEDOR o CLIENTE' });
  }
  try {
    const usuario = await repo.actualizar(Number(req.params.id), {
      nombre: nombre === undefined ? undefined : String(nombre).trim(),
      rol,
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

// "Eliminar" desactiva la cuenta (no se borra la fila)
const desactivarUsuario = async (req, res) => {
  if (!idValido(req.params.id)) return res.status(400).json({ error: 'id inválido' });
  try {
    const usuario = await repo.desactivar(Number(req.params.id));
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al desactivar el usuario' });
  }
};

module.exports = { listarUsuarios, obtenerUsuario, actualizarUsuario, desactivarUsuario };
