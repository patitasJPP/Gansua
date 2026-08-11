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
public class servicePeriodo {

    @Autowired
    private PeriodoRepository PeriodoRepositori;

    public boolean verificarSemana(LocalDate fecha) {
        Optional<Periodo> periodo = PeriodoRepositori.findSemanaByFecha(fecha);

        if (periodo.isPresent()) {
            System.out.println("se encontro la fecha " + fecha + " en la semana " + periodo.get().getSemana());
            return true;
        }

        System.out.println("no se encontro la fecha " + fecha);
        return false;
    }

    public boolean verificarSemana(String semana) {
        if (PeriodoRepositori.existsBySemana(semana)) {
            System.out.println("se encontro la semana " + semana);
            return true;
        }

        System.out.println("no se encontro la semana " + semana);
        return false;
    }

    public Periodo obtenerOCrearSemana(LocalDateTime fecha) {
        Optional<Periodo> periodo = PeriodoRepositori.findSemanaByFecha(fecha.toLocalDate());

        if (periodo.isPresent()) {
            System.out.println("se encontro la fecha " + fecha + " en la semana " + periodo.get().getSemana());
            return periodo.get();
        }

        System.out.println("no se encontro la fecha " + fecha + ", se calculara la semana nueva");

        LocalDate lunes = fecha.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate proximoLunes = lunes.plusWeeks(1);

        Periodo nuevo = new Periodo();
        nuevo.setSemana("semana " + (PeriodoRepositori.count() + 1));
        nuevo.setFechaInicio(lunes);
        nuevo.setFechaFin(proximoLunes);
        nuevo.setTotalHabitos(0);

        Periodo guardado = PeriodoRepositori.save(nuevo);
        System.out.println("se inserto la semana " + guardado.getSemana() + " del " + lunes + " al " + proximoLunes);
        return guardado;
    }
}
