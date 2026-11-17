-- Tabla de usuarios (ejecutar una vez en la base sonidovivo)
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  rol           VARCHAR(20)  NOT NULL DEFAULT 'CLIENTE'
                CHECK (rol IN ('ADMIN', 'VENDEDOR', 'CLIENTE')),
  activo        BOOLEAN      NOT NULL DEFAULT TRUE,
  creado_en     TIMESTAMP    NOT NULL DEFAULT NOW()
);
