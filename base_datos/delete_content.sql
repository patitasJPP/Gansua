----------------------------------------------------
-- SCRIPT: LIMPIAR CONTENIDO DE LAS TABLAS (sin borrarlas)
-- Borra todos los registros de las tablas y reinicia
-- los IDs (secuencias) para que vuelvan a empezar en 1.
--
-- TRUNCATE ... RESTART IDENTITY hace ambas cosas:
--   - elimina el contenido completo de cada tabla
--   - reinicia las secuencias de los id
----------------------------------------------------
TRUNCATE TABLE habitos_echos, dias, habitos, periodos RESTART IDENTITY;
