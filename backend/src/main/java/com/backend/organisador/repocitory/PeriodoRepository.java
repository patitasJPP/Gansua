package com.backend.organisador.repocitory;

import com.backend.organisador.entities.Periodo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PeriodoRepository extends JpaRepository<Periodo, Integer> {

    @Query("""
        SELECT p FROM Periodo p 
        WHERE :fecha BETWEEN p.fechaInicio AND p.fechaFin
    """)
    Optional<Periodo> findSemanaByFecha(@Param("fecha") LocalDateTime fecha);

    boolean existsBySemana(String semana);
}