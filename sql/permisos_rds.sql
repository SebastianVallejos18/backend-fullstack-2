-- Solo para Amazon RDS: da al usuario de la aplicación los permisos mínimos.
-- "Eliminar" desactiva la cuenta, por eso no se concede DELETE.
GRANT SELECT, INSERT, UPDATE ON usuarios TO app_sonidovivo;
GRANT USAGE, SELECT ON SEQUENCE usuarios_id_seq TO app_sonidovivo;
