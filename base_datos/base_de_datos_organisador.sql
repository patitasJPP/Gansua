
--creamos lo que son las tablas--
create table dias(
id SERIAL PRIMARY key,
dias varchar(100) not null
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

---------------------------------
--insertamos lo que son los datos
---------------------------------

insert into dias(dias) values 
('lunes'),
('martes'),
('miercoles'),
('jueves'),
('viernes'), 
('sabado'),
('domingo');

insert into habitos(habitos) values
('jugar'),
('estudiar'),
('ejercitarse'),
('ingles');


----------------------------------------------------------------
--tabla intermedia para hacer lo que son la union de los datos--
----------------------------------------------------------------
insert into habitos_echos(id_dias,id_habitos,fecha_realisado) values 
(1,1,'10-02-2026'),
(2,2,'11-02-2026'),
(3,3,'12-02-2026'),
(4,4,'13-02-2026'),
(5,1,'14-02-2026'),
(6,2,'15-02-2026'),
(7,3,'16-02-2026'),
(1,4,'17-02-2026'),
(2,1,'18-02-2026'),
(3,2,'19-02-2026'),
(4,3,'20-02-2026'),
(5,4,'21-02-2026'),
(6,1,'22-02-2026'),
(7,2,'23-02-2026'),
(1,3,'24-02-2026'),
(2,4,'25-02-2026'),
(3,1,'26-02-2026'),
(4,2,'27-02-2026'),
(5,3,'28-02-2026'),
(6,4,'01-03-2026'),
(7,1,'02-03-2026');


INSERT INTO periodos(semana, fecha_inicio, fecha_fin) VALUES
('semana 1', '01-02-2026', '07-02-2026'),
('semana 2', '08-02-2026', '14-02-2026'),
('semana 3', '15-02-2026', '21-02-2026'),
('semana 4', '22-02-2026', '28-02-2026'),
('semana 5', '01-03-2026', '07-03-2026'),
('semana 6', '08-03-2026', '14-03-2026'),
('semana 7', '15-03-2026', '21-03-2026'),
('semana 8', '22-03-2026', '28-03-2026'),
('semana 9', '29-03-2026', '04-04-2026'),
('semana 10', '05-04-2026', '11-04-2026'),
('semana 11', '12-04-2026', '18-04-2026'),
('semana 12', '19-04-2026', '25-04-2026');


--------------------
--pruevas de campo--
--------------------

select d.dias,h.habitos,he.fecha_realisado from habitos_echos he
join dias d on he.id_dias=d.id 
join habitos h on he.id_habitos= h.id 
ORDER BY CASE d.dias
  WHEN 'lunes' THEN 1
  WHEN 'martes' THEN 2
  WHEN 'miercoles' THEN 3
  WHEN 'jueves' THEN 4
  WHEN 'viernes' THEN 5
  WHEN 'sabado' THEN 6
  WHEN 'domingo' THEN 7
END;


--ver cantadidad de abitos echo en cada semana--
select p.semana, p.fecha_inicio,p.fecha_fin,count(he.id)as total_habitos from periodos p
left join habitos_echos he on he.fecha_realisado between p.fecha_inicio and p.fecha_fin
GROUP BY p.id, p.semana, p.fecha_inicio, p.fecha_fin
ORDER BY p.fecha_inicio;


--ver cantidad de cada abito en echo en cada semana--
SELECT 
  p.semana,
  h.habitos,
  COUNT(he.id) AS cantidad
FROM periodos p
LEFT JOIN habitos_echos he ON he.fecha_realisado BETWEEN p.fecha_inicio AND p.fecha_fin
LEFT JOIN habitos h ON he.id_habitos = h.id
GROUP BY p.id, p.semana, h.id, h.habitos
ORDER BY p.fecha_inicio, cantidad DESC;



--semana en que se realiso y dia en que se realiso--
SELECT 
  p.semana,
  h.habitos,
  d.dias,
  he.fecha_realisado
FROM periodos p
LEFT JOIN habitos_echos he ON he.fecha_realisado BETWEEN p.fecha_inicio AND p.fecha_fin
LEFT JOIN habitos h ON he.id_habitos = h.id
LEFT JOIN dias d ON he.id_dias = d.id
ORDER BY p.fecha_inicio, d.id, h.habitos;

