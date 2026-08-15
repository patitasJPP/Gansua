package com.backend.organisador.habitos.repositories;
import com.backend.organisador.habitos.entities.Dias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EstadisticasRepository extends JpaRepository<Dias, Long> {

    interface PorDia {
        String getDia();
        Long getTotal();
    }

    interface PorHabito {
        String getHabito();
        Long getTotal();
    }

    interface PorSemana {
        String getSemana();
        Long getTotal();
    }

    interface Matriz {
        String getDia();
        String getHabito();
        Long getTotal();
    }

    interface FechaPorHabito {
        Long getHabitoId();
        LocalDate getFecha();
    }

    interface DetalleMarca {
        Long getHabitoId();
        String getHabito();
        LocalDate getFecha();
    }

    @Query(value = """
            SELECT d.dias AS dia, COUNT(he.id) AS total
            FROM dias d
            LEFT JOIN habitos_echos he ON he.id_dias = d.id
            GROUP BY d.id, d.dias
            ORDER BY CASE d.dias
              WHEN 'lunes' THEN 1
              WHEN 'martes' THEN 2
              WHEN 'miercoles' THEN 3
              WHEN 'jueves' THEN 4
              WHEN 'viernes' THEN 5
              WHEN 'sabado' THEN 6
              WHEN 'domingo' THEN 7
            END
            """, nativeQuery = true)
    List<PorDia> estadisticasPorDia();

    @Query(value = """
            SELECT h.habitos AS habito, COUNT(he.id) AS total
            FROM habitos h
            LEFT JOIN habitos_echos he ON he.id_habitos = h.id
            GROUP BY h.id, h.habitos
            ORDER BY total DESC, h.habitos ASC
            """, nativeQuery = true)
    List<PorHabito> estadisticasPorHabito();

    @Query(value = """
            SELECT p.semana AS semana, COUNT(he.id) AS total
            FROM periodos p
            LEFT JOIN habitos_echos he ON he.fecha_realisado BETWEEN p.fecha_inicio AND p.fecha_fin
            GROUP BY p.id, p.semana, p.fecha_inicio
            ORDER BY p.fecha_inicio
            """, nativeQuery = true)
    List<PorSemana> estadisticasPorSemana();

    @Query(value = """
            SELECT d.dias AS dia, h.habitos AS habito, COUNT(he.id) AS total
            FROM dias d
            CROSS JOIN habitos h
            LEFT JOIN habitos_echos he ON he.id_dias = d.id AND he.id_habitos = h.id
            GROUP BY d.id, d.dias, h.id, h.habitos
            ORDER BY CASE d.dias
              WHEN 'lunes' THEN 1
              WHEN 'martes' THEN 2
              WHEN 'miercoles' THEN 3
              WHEN 'jueves' THEN 4
              WHEN 'viernes' THEN 5
              WHEN 'sabado' THEN 6
              WHEN 'domingo' THEN 7
            END, h.id
            """, nativeQuery = true)
    List<Matriz> estadisticasMatriz();

    @Query(value = "SELECT COUNT(*) FROM habitos_echos", nativeQuery = true)
    long contarMarcas();

    @Query(value = "SELECT COUNT(DISTINCT fecha_realisado) FROM habitos_echos", nativeQuery = true)
    long contarDiasConActividad();

    @Query(value = "SELECT COUNT(DISTINCT fecha_realisado) FROM habitos_echos WHERE fecha_realisado BETWEEN :inicio AND :fin", nativeQuery = true)
    long contarDiasConActividadEnRango(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);

    @Query(value = "SELECT DISTINCT fecha_realisado FROM habitos_echos ORDER BY fecha_realisado", nativeQuery = true)
    List<LocalDate> obtenerFechasMarcadas();

    // ============================================================
    // HÁBITOS DE ABSTINENCIA (es_abstinencia = TRUE)
    // ============================================================

    @Query(value = """
            SELECT he.id_habitos AS habitoId, he.fecha_realisado AS fecha
            FROM habitos_echos he
            JOIN habitos h ON h.id = he.id_habitos
            WHERE h.es_abstinencia = TRUE
            ORDER BY he.id_habitos, he.fecha_realisado
            """, nativeQuery = true)
    List<FechaPorHabito> fechasPorHabitoAbstinente();

    @Query(value = """
            SELECT COUNT(*)
            FROM habitos_echos he
            JOIN habitos h ON h.id = he.id_habitos
            WHERE h.es_abstinencia = TRUE
            """, nativeQuery = true)
    long contarDiasAbstinencia();

    @Query(value = "SELECT COUNT(*) FROM habitos h WHERE h.es_abstinencia = TRUE", nativeQuery = true)
    long contarHabitosAbstinencia();

    // ============================================================
    // KPIs DE ANÁLISIS (cumplimiento, rachas, correlación, etc.)
    // ============================================================

    @Query(value = """
            SELECT h.habitos AS habito, COUNT(he.id) AS total
            FROM habitos h
            LEFT JOIN habitos_echos he ON he.id_habitos = h.id
              AND he.fecha_realisado BETWEEN :inicio AND :fin
            GROUP BY h.id, h.habitos
            ORDER BY h.id
            """, nativeQuery = true)
    List<PorHabito> marcasPorHabitoEnRango(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);

    @Query(value = """
            SELECT he.id_habitos AS habitoId, h.habitos AS habito, he.fecha_realisado AS fecha
            FROM habitos_echos he
            JOIN habitos h ON h.id = he.id_habitos
            ORDER BY he.id_habitos, he.fecha_realisado
            """, nativeQuery = true)
    List<DetalleMarca> marcasDetalladas();

    @Query(value = """
            SELECT DISTINCT he.id_habitos AS habitoId, he.fecha_realisado AS fecha
            FROM habitos_echos he
            JOIN habitos h ON h.id = he.id_habitos
            ORDER BY he.id_habitos, he.fecha_realisado
            """, nativeQuery = true)
    List<FechaPorHabito> fechasPorHabito();
}
