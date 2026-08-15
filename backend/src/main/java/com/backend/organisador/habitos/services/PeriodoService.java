package com.backend.organisador.habitos.services;
import com.backend.organisador.habitos.entities.Periodo;
import com.backend.organisador.habitos.repositories.PeriodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Optional;

@Service
public class PeriodoService {


    @Autowired
    private PeriodoRepository periodoRepository;

    private final Object lock = new Object();

    // Verificar semana con LocalDate
    public boolean verificarSemana(LocalDate fecha) {
        // Convierte LocalDate a LocalDateTime
        LocalDateTime fechaDateTime = fecha.atStartOfDay();
        Optional<Periodo> periodo = periodoRepository.findSemanaByFecha(fechaDateTime);

        if (periodo.isPresent()) {
            return true;
        }

        return false;
    }

    // Verificar semana por nombre
    public boolean verificarSemana(String semana) {
        if (periodoRepository.existsBySemana(semana)) {
            return true;
        }

        return false;
    }

    // Obtener o crear semana
    public Periodo obtenerOCrearSemana(LocalDateTime fecha) {
        Optional<Periodo> periodo = periodoRepository.findSemanaByFecha(fecha);

        if (periodo.isPresent()) {
            return periodo.get();
        }

        // Evita que dos peticiones simultáneas creen el mismo periodo (doble inserción)
        synchronized (lock) {
            periodo = periodoRepository.findSemanaByFecha(fecha);

            if (periodo.isPresent()) {
                return periodo.get();
            }

            // Calcula el lunes de la semana actual
            LocalDate lunes = fecha.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
            LocalDate proximoLunes = lunes.plusWeeks(1);

            // Crea nuevo período
            Periodo nuevo = new Periodo();
            nuevo.setSemana("semana " + (periodoRepository.count() + 1));
            nuevo.setFechaInicio(lunes.atStartOfDay());
            nuevo.setFechaFin(proximoLunes.atStartOfDay());
            nuevo.setTotalHabitos(0);

            // Guarda en BD
            try {
                return periodoRepository.save(nuevo);
            } catch (DataIntegrityViolationException e) {
                // Otro proceso ya creó el periodo: devuelve el existente
                return periodoRepository.findSemanaByFecha(fecha).orElseThrow();
            }
        }
    }
}