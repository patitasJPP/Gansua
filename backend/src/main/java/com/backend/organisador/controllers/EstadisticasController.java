package com.backend.organisador.controllers;

import com.backend.organisador.entities.ConsistenciaSemana;
import com.backend.organisador.entities.CorrelacionHabito;
import com.backend.organisador.entities.CumplimientoHabito;
import com.backend.organisador.entities.EstadisticasResumen;
import com.backend.organisador.entities.HabitoEnRiesgo;
import com.backend.organisador.entities.MejorHabitoSemana;
import com.backend.organisador.entities.RachaAbstinencia;
import com.backend.organisador.entities.RachaHabito;
import com.backend.organisador.entities.TasaRecuperacion;
import com.backend.organisador.repocitory.EstadisticasRepository;
import com.backend.organisador.services.EstadisticasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
@CrossOrigin(origins = "*")
public class EstadisticasController {

    @Autowired
    private EstadisticasService estadisticasService;

    @GetMapping("/resumen")
    public EstadisticasResumen resumen() {
        return estadisticasService.resumen();
    }

    @GetMapping("/por-dia")
    public List<EstadisticasRepository.PorDia> porDia() {
        return estadisticasService.porDia();
    }

    @GetMapping("/por-habito")
    public List<EstadisticasRepository.PorHabito> porHabito() {
        return estadisticasService.porHabito();
    }

    @GetMapping("/por-semana")
    public List<EstadisticasRepository.PorSemana> porSemana() {
        return estadisticasService.porSemana();
    }

    @GetMapping("/matriz")
    public List<EstadisticasRepository.Matriz> matriz() {
        return estadisticasService.matriz();
    }

    @GetMapping("/consistencia")
    public List<ConsistenciaSemana> consistencia() {
        return estadisticasService.consistencia();
    }

    @GetMapping("/rachas-abstinencia")
    public List<RachaAbstinencia> rachasAbstinencia() {
        return estadisticasService.rachasAbstinencia();
    }

    @GetMapping("/cumplimiento-por-habito")
    public List<CumplimientoHabito> cumplimientoPorHabito() {
        return estadisticasService.cumplimientoPorHabito();
    }

    @GetMapping("/rachas-por-habito")
    public List<RachaHabito> rachasPorHabito() {
        return estadisticasService.rachasPorHabito();
    }

    @GetMapping("/habitos-en-riesgo")
    public List<HabitoEnRiesgo> habitosEnRiesgo() {
        return estadisticasService.habitosEnRiesgo();
    }

    @GetMapping("/correlacion")
    public List<CorrelacionHabito> correlacion() {
        return estadisticasService.correlacion();
    }

    @GetMapping("/tasa-recuperacion")
    public List<TasaRecuperacion> tasaRecuperacion() {
        return estadisticasService.tasaRecuperacion();
    }
}
