--creamos lo que son las tablas--
create table dias(
id SERIAL PRIMARY key,
diás varchar(100) not null
);

create table habitos( 
id serial primary key, 
habitos varchar(100) not null); 

create table habitos_echos( 
id serial primary key, 
id_dias int not null,
id_habitos int not null,
fecha_realisado date,


foreign key (id_dias) REFERENCES dias(id) on delete cascade, 
foreign key (id_habitos) REFERENCES habitos (id) on delete cascade);

CREATE TABLE periodos(
  id SERIAL PRIMARY KEY,
  semana VARCHAR(100) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  total_habitos INT DEFAULT 0
);

ALTER TABLE periodos
ALTER COLUMN fecha_inicio TYPE TIMESTAMP,
ALTER COLUMN fecha_fin TYPE TIMESTAMP;

ALTER TABLE periodos
ALTER COLUMN semana DROP NOT NULL,
ADD COLUMN numero_semana INT;

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


INSERT INTO periodos(fecha_inicio, fecha_fin) VALUES
('2026-02-08', '2026-02-14'),
('2026-02-15', '2026-02-21'),
('2026-02-22', '2026-02-28');

	
select * from periodos;

ALTER TABLE dias RENAME COLUMN "diás" TO "dias";
delete from periodos where id=1;
select * from periodos;

TRUNCATE TABLE periodos RESTART IDENTITY;

TRUNCATE TABLE periodos RESTART IDENTITY;