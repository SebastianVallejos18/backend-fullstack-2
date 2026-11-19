# Sonido Vivo – Backend (Evaluación Parcial 3)

API REST en **Node.js + Express** con base de datos **PostgreSQL** y autenticación con **JWT**.
Frontend: [(Enlace repositorio front end)](https://github.com/SebastianVallejos18/Sonido-vivo-Fullstack-2-React)

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
docs/openapi.yaml          documentación OpenAPI (Swagger)
```
Una petición recorre: **ruta → (middleware) → controlador → repositorio → base de datos**.

## Ejecutar en local
```bash
npm install
cp .env.example .env        # completar DB_PASSWORD y JWT_SECRET (el .env no se sube a GitHub)
psql -h localhost -U postgres -d sonidovivo -f sql/usuarios.sql
node scripts/crear-admin.js "Nombre" correo@dominio.cl 'Clave1234'
npm run dev
```
Comprobar: `GET http://localhost:8080/api/v1/health` debe responder `{"estado":"ok"}`.

Variables de entorno: ver `.env.example`. Con Amazon RDS se usa `DB_SSL=true` y se ejecuta además `sql/permisos_rds.sql`.

## Documentación Swagger
- En local: `http://localhost:8080/api-docs`
- En la instancia EC2: `http://IP_PUBLICA_DE_LA_EC2:8080/api-docs` (la IP cambia cada vez que se reinicia el laboratorio).

Para probar las rutas protegidas: ejecutar `POST /auth/login`, copiar el `token` y pulsarlo en **Authorize** (solo el token, sin la palabra Bearer).

## Endpoints de usuarios y autenticación
| Método | Ruta | Acceso | Respuestas |
|---|---|---|---|
| POST | `/api/v1/auth/registro` | Público (el servidor asigna el rol CLIENTE) | 201, 400, 409 |
| POST | `/api/v1/auth/login` | Público | 200 con JWT, 400, 401 (error genérico) |
| GET | `/api/v1/usuarios` | ADMIN | 200, 401, 403 |
| GET | `/api/v1/usuarios/:id` | ADMIN o el mismo usuario | 200, 401, 403, 404 |
| PUT | `/api/v1/usuarios/:id` | ADMIN | 200, 400, 401, 403, 404 |
| DELETE | `/api/v1/usuarios/:id` | ADMIN (desactiva la cuenta) | 200, 401, 403, 404 |

Roles del caso: `ADMIN`, `VENDEDOR`, `CLIENTE`. Las contraseñas se guardan con hash (bcrypt).
El JWT lleva `id` y `rol` y dura 2 horas. Las rutas protegidas esperan el encabezado `Authorization: Bearer <token>`.
Un usuario desactivado no puede iniciar sesión.

## Estado del trabajo (cierre semana 15, 22 de noviembre)
| Operación | Diseñado | Implementado | Probado |
|---|---|---|---|
| Tabla de usuarios en PostgreSQL | Sí | Sí | Sí |
| Registro de usuario (rol CLIENTE asignado por el servidor) | Sí | Sí | Sí |
| Inicio de sesión con JWT (vigencia 2 h) | Sí | Sí | Sí |
| Listar usuarios (solo ADMIN) | Sí | Sí | Sí |
| Ver usuario (ADMIN cualquiera, los demás solo el propio) | Sí | Sí | Sí |
| Modificar usuario (nombre y rol, solo ADMIN) | Sí | Sí | Sí |
| Desactivar usuario (no se borra la fila, solo ADMIN) | Sí | Sí | Sí |
| Roles y rutas protegidas (401 y 403) | Sí | Sí | Sí |
| Swagger / OpenAPI | Sí | Sí | Sí |
| Catálogo (instrumentos, equipos y accesorios) | Sí | No | No |
| Pedido (regla de stock, 409) | Sí | No | No |

El catálogo y el pedido quedan para la semana 16.

## Pruebas realizadas
| Prueba | Resultado |
|---|---|
| Listar usuarios como ADMIN | 200 |
| Listar sin token o con token falso | 401 |
| Cliente intenta listar usuarios | 403 |
| Cliente consulta a otro usuario | 403 |
| Cliente consulta su propia cuenta | 200 |
| Modificar nombre como ADMIN | 200 |
| Modificar con un rol inválido | 400 |
| Desactivar usuario | 200 (`activo: false`) |
| Login de un usuario desactivado | 401 |
| Registro con email repetido | 409 |

## Integrantes
- `Sebastian Vallejos` (seb.vallejos@duocuc.cl)
- `Enzo Arriati` (en.arriati@duocuc.cl)