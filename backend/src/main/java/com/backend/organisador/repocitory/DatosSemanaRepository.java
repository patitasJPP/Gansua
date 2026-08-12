package com.backend.organisador.repocitory;

import com.backend.organisador.entities.DatosSemana;
import com.backend.organisador.entities.Dias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface DatosSemanaRepository extends JpaRepository<Dias, Long> {

    @Query(value = "SELECT p.semana AS semana, h.habitos AS habitos, d.dias AS dias, CAST(he.fecha_realisado AS varchar) AS fecha " +
            "FROM periodos p " +
            "LEFT JOIN habitos_echos he ON he.fecha_realisado BETWEEN p.fecha_inicio AND p.fecha_fin " +
            "LEFT JOIN habitos h ON he.id_habitos = h.id " +
            "LEFT JOIN dias d ON he.id_dias = d.id " +
            "WHERE p.semana = :semana " +
            "ORDER BY d.id, h.habitos", nativeQuery = true)
    List<DatosSemana> buscarPorSemana(@Param("semana") String semana);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM habitos_echos " +
            "WHERE id_dias = :idDias AND id_habitos = :idHabitos " +
            "AND fecha_realisado BETWEEN :inicio AND :fin", nativeQuery = true)
    int eliminarHabito(@Param("idDias") Long idDias,
                       @Param("idHabitos") Long idHabitos,
                       @Param("inicio") LocalDateTime inicio,
                       @Param("fin") LocalDateTime fin);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO habitos_echos (id_dias, id_habitos, fecha_realisado) " +
            "VALUES (:idDias, :idHabitos, :fecha)", nativeQuery = true)
    int insertarHabito(@Param("idDias") Long idDias,
                       @Param("idHabitos") Long idHabitos,
                       @Param("fecha") LocalDate fecha);
}
