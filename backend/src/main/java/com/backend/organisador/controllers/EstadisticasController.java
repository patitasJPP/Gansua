package com.backend.organisador.controllers;

import com.backend.organisador.entities.ConsistenciaSemana;
import com.backend.organisador.entities.EstadisticasResumen;
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
}
