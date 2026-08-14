-- ============================================================
-- MIGRACIÓN: periodos sin duplicados
-- Limpia los "semana X" duplicados y evita futuras dobles inserciones
-- con una constraint UNIQUE sobre fecha_inicio.
-- ============================================================

-- 1) Borra duplicados conservando el registro con el id menor por fecha_inicio
DELETE FROM periodos a
USING periodos b
WHERE a.id > b.id
  AND a.fecha_inicio = b.fecha_inicio;

-- 2) Verifica que ya no queden duplicados (debe devolver 0 filas)
SELECT id, semana, numero_semana, fecha_inicio, fecha_fin
FROM periodos
ORDER BY id;

-- 3) Agrega la restricción de unicidad por fecha_inicio
ALTER TABLE periodos
ADD CONSTRAINT uq_periodos_fecha_inicio UNIQUE (fecha_inicio);
