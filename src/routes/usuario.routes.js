const router = require('express').Router();
const { verificarToken, exigirRol } = require('../middlewares/auth.middleware');
const c = require('../controllers/usuario.controller');

router.use(verificarToken);
router.get('/', exigirRol('ADMIN'), c.listarUsuarios);
router.get('/:id', c.obtenerUsuario);
router.put('/:id', exigirRol('ADMIN'), c.actualizarUsuario);
router.delete('/:id', exigirRol('ADMIN'), c.desactivarUsuario);

module.exports = router;
