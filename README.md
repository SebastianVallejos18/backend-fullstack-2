# Sonido Vivo – Backend (Evaluación Parcial 3)

API REST en **Node.js + Express** con base de datos **PostgreSQL** y autenticación con **JWT**.
Frontend: _(enlace al repositorio del frontend)_.

## Cómo está organizado
```
server.js                  arranca el servidor (puerto 8080)
src/app.js                 configura Express y conecta las rutas
src/config/db.js           conexión a PostgreSQL (Pool)
src/routes/                define las URLs y qué controlador responde
src/controllers/           valida los datos y arma la respuesta HTTP
src/repositories/          consultas SQL (únicas que tocan la base)
src/middlewares/           verifica el JWT (401) y el rol (403)
sql/                       scripts de la base de datos
scripts/crear-admin.js     crea el primer administrador
```
Una petición recorre: **ruta → (middleware) → controlador → repositorio → base de datos**.

## Ejecutar en local
```bash
npm install
cp .env.example .env        # completar DB_PASSWORD y JWT_SECRET (el .env no se sube a GitHub)
psql -U postgres -d sonidovivo -f sql/usuarios.sql
node scripts/crear-admin.js "Nombre" correo@dominio.cl 'Clave1234'
npm run dev
```
Comprobar: `GET http://localhost:8080/api/health` debe responder `{"estado":"ok"}`.

Variables de entorno: ver `.env.example`. Con Amazon RDS se usa `DB_SSL=true` y se ejecuta además `sql/permisos_rds.sql`.

## Endpoints de usuarios y autenticación
| Método | Ruta | Acceso | Respuestas |
|---|---|---|---|
| POST | `/api/auth/registro` | Público (el servidor asigna el rol CLIENTE) | 201, 400, 409 |
| POST | `/api/auth/login` | Público | 200 con JWT, 400, 401 (error genérico) |
| GET | `/api/usuarios` | ADMIN | 200, 401, 403 |
| GET | `/api/usuarios/:id` | ADMIN o el mismo usuario | 200, 401, 403, 404 |
| PUT | `/api/usuarios/:id` | ADMIN | 200, 400, 401, 403, 404 |
| DELETE | `/api/usuarios/:id` | ADMIN (desactiva la cuenta) | 200, 401, 403, 404 |

Roles del caso: `ADMIN`, `VENDEDOR`, `CLIENTE`. Las contraseñas se guardan con hash (bcrypt).
El JWT lleva `id` y `rol` y dura 2 horas. Las rutas protegidas esperan el encabezado `Authorization: Bearer <token>`.

## Estado del trabajo (avance mínimo, 16 de noviembre)
| Operación | Estado |
|---|---|
| Tabla de usuarios en PostgreSQL | Listo |
| Inicio de sesión con JWT | Listo |
| Registro de usuario | Listo |
| Modificar usuario | En avance |
| Listar usuarios | En avance |
| Eliminar o desactivar usuario | En avance |
| Swagger / OpenAPI | Pendiente |
| Catálogo (instrumentos, equipos y accesorios) | Pendiente |
| Pedido (regla de stock, 409) | Pendiente |

## Integrantes
Sebastian Vallejos, Diego Alvear y Enzo Arriati.
