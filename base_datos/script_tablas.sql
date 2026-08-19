-- ============================================================
-- SCRIPT: CREACION COMPLETA DE TABLAS
-- Base de datos: organisador_habitos (PostgreSQL)
--
-- Ejecuta este script en una BD vacia para crear el esquema
-- completo del Organisador de Habitos.
-- ============================================================

-- ========================
-- 1. TABLA: dias
-- ========================
CREATE TABLE dias (
  id    SERIAL PRIMARY KEY,
  dias  VARCHAR(100) NOT NULL
);

-- ========================
-- 2. TABLA: habitos
-- ========================
CREATE TABLE habitos (
  id              SERIAL PRIMARY KEY,
  habitos         VARCHAR(100) NOT NULL,
  es_abstinencia  BOOLEAN NOT NULL DEFAULT FALSE
);

-- ========================
-- 3. TABLA: periodos
-- ========================
CREATE TABLE periodos (
  id              SERIAL PRIMARY KEY,
  semana          VARCHAR(100),
  fecha_inicio    TIMESTAMP NOT NULL,
  fecha_fin       TIMESTAMP NOT NULL,
  total_habitos   INT DEFAULT 0,
  numero_semana   INT
);

-- Restriccion de unicidad para evitar semanas duplicadas
ALTER TABLE periodos
  ADD CONSTRAINT uq_periodos_fecha_inicio UNIQUE (fecha_inicio);

-- ========================
-- 4. TABLA: habitos_echos
-- ========================
CREATE TABLE habitos_echos (
  id               SERIAL PRIMARY KEY,
  id_dias          INT NOT NULL,
  id_habitos       INT NOT NULL,
  fecha_realisado  DATE,

  FOREIGN KEY (id_dias)    REFERENCES dias(id)    ON DELETE CASCADE,
  FOREIGN KEY (id_habitos) REFERENCES habitos(id)  ON DELETE CASCADE
);

-- ========================
-- 5. TRIGGER: auto-asignar numero de semana
-- ========================
CREATE OR REPLACE FUNCTION auto_incrementar_semana()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero_semana := (SELECT COALESCE(MAX(numero_semana), 0) + 1 FROM periodos);
  NEW.semana := 'semana ' || NEW.numero_semana;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_semana
  BEFORE INSERT ON periodos
  FOR EACH ROW
  EXECUTE FUNCTION auto_incrementar_semana();

-- ========================
-- 6. DATOS INICIALES: dias de la semana
-- ========================
INSERT INTO dias (dias) VALUES
  ('lunes'),
  ('martes'),
  ('miercoles'),
  ('jueves'),
  ('viernes'),
  ('sabado'),
  ('domingo');
