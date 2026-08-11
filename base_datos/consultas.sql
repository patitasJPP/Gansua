--------------------
--pruevas de campo--
--------------------

select d.diás,h.habitos,he.fecha_realisado from habitos_echos he
join dias d on he.id_dias=d.id 
join habitos h on he.id_habitos= h.id 
ORDER BY CASE d.diás
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
  d.diás,
  he.fecha_realisado
FROM periodos p
LEFT JOIN habitos_echos he ON he.fecha_realisado BETWEEN p.fecha_inicio AND p.fecha_fin
LEFT JOIN habitos h ON he.id_habitos = h.id
LEFT JOIN dias d ON he.id_dias = d.id
ORDER BY p.fecha_inicio, d.id, h.habitos;
