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
