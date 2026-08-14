----------------------------------------------------
-- YO SOY INEVITABLE
-- Muestra TODOS los datos de TODAS las tablas juntos
-- en un solo script.
----------------------------------------------------

-- 1) Dias de la semana
SELECT * FROM dias ORDER BY id;

-- 2) Habitos (incluye es_abstinencia)
SELECT * FROM habitos ORDER BY id;

-- 3) Periodos (semanas)
SELECT * FROM periodos ORDER BY fecha_inicio;

-- 4) Marcas hechas (detalle crudo)
SELECT * FROM habitos_echos ORDER BY fecha_realisado, id;

-- 5) TODO JUNTO: cada marca con su semana, día y hábito
SELECT
  p.semana,
  d.dias        AS dia,
  h.habitos,
  he.fecha_realisado AS fecha
FROM habitos_echos he
LEFT JOIN dias d      ON d.id = he.id_dias
LEFT JOIN habitos h   ON h.id = he.id_habitos
LEFT JOIN periodos p  ON he.fecha_realisado BETWEEN p.fecha_inicio AND p.fecha_fin
ORDER BY he.fecha_realisado, d.id, h.habitos;

-- 6) Resumen: filas por tabla (todas en una sola consulta)
SELECT 'dias' AS tabla, COUNT(*) AS filas FROM dias
UNION ALL SELECT 'habitos', COUNT(*) FROM habitos
UNION ALL SELECT 'periodos', COUNT(*) FROM periodos
UNION ALL SELECT 'habitos_echos', COUNT(*) FROM habitos_echos;
