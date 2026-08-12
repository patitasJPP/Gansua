package com.backend.organisador.services;

import com.backend.organisador.entities.Periodo;
import com.backend.organisador.repocitory.PeriodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    // Verificar semana con LocalDate
    public boolean verificarSemana(LocalDate fecha) {
        // Convierte LocalDate a LocalDateTime
        LocalDateTime fechaDateTime = fecha.atStartOfDay();
        Optional<Periodo> periodo = periodoRepository.findSemanaByFecha(fechaDateTime);

        if (periodo.isPresent()) {
            System.out.println("se encontro la fecha " + fecha + " en la semana " + periodo.get().getSemana());
            return true;
        }

        System.out.println("no se encontro la fecha " + fecha);
        return false;
    }

    // Verificar semana por nombre
    public boolean verificarSemana(String semana) {
        if (periodoRepository.existsBySemana(semana)) {
            System.out.println("se encontro la semana " + semana);
            return true;
        }

        System.out.println("no se encontro la semana " + semana);
        return false;
    }

    // Obtener o crear semana
    public Periodo obtenerOCrearSemana(LocalDateTime fecha) {
        Optional<Periodo> periodo = periodoRepository.findSemanaByFecha(fecha);

        if (periodo.isPresent()) {
            System.out.println("se encontro la fecha " + fecha + " en la semana " + periodo.get().getSemana());
            return periodo.get();
        }

        System.out.println("no se encontro la fecha " + fecha + ", se calculara la semana nueva");

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
        Periodo guardado = periodoRepository.save(nuevo);
        System.out.println("se inserto la semana " + guardado.getSemana() + " del " + lunes + " al " + proximoLunes);
        return guardado;
    }
}