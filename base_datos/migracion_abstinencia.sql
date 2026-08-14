-- ============================================================
-- MIGRACIÓN: Hábitos de abstinencia (hábitos que quieres EVITAR)
-- Agrega la columna es_abstinencia a la tabla habitos
-- es_abstinencia = TRUE  -> "no lo quiero hacer" (dejar/evitar)
-- es_abstinencia = FALSE -> hábito normal (querer hacer)
-- ============================================================

-- Agrega la columna (idempotente: no falla si ya existe)
ALTER TABLE habitos ADD COLUMN IF NOT EXISTS es_abstinencia BOOLEAN NOT NULL DEFAULT FALSE;

-- ============================================================
-- DATOS DEMO (opcional): descomenta si quieres probar rachas
-- de abstinencia con datos de ejemplo
-- ============================================================
-- INSERT INTO habitos(habitos, es_abstinencia) VALUES
-- ('fumar', TRUE),
-- ('tomar', TRUE),
-- ('drogarme', TRUE);
--
-- INSERT INTO habitos_echos(id_dias, id_habitos, fecha_realisado) VALUES
-- (1, 5, '2026-03-01'),
-- (2, 5, '2026-03-02'),
-- (3, 5, '2026-03-03'),
-- (4, 5, '2026-03-04'),
-- (5, 5, '2026-03-05'),
-- (6, 6, '2026-03-10'),
-- (7, 6, '2026-03-11'),
-- (1, 6, '2026-03-12'),
-- (2, 7, '2026-03-20');
-- (ajusta los id_habitos según los id reales de tu base)

-- ============================================================
-- VERIFICACIÓN: lista los hábitos con su tipo
-- ============================================================
SELECT id, habitos, es_abstinencia FROM habitos ORDER BY id;
