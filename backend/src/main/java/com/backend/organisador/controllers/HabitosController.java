package com.backend.organisador.controllers;

import com.backend.organisador.entities.DatosSemana;
import com.backend.organisador.entities.Periodos;
import com.backend.organisador.services.serviceDatosSemana;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.backend.organisador.services.serviceHabitos;
import  com.backend.organisador.entities.habitos;
import com.backend.organisador.services.PeriodoService;


import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/habitos")
@CrossOrigin(origins = "*")
public class HabitosController {

    @Autowired
    private serviceHabitos ServicioHabitos;
    @Autowired
    private serviceDatosSemana ServicioDatosSemana;

    @Autowired
    private PeriodoService ServicioPeriodo;


    @GetMapping
    public List<habitos> ObtenerTodo(){
   return ServicioHabitos.ObtenerTodos();
    }


    @GetMapping("/datos_semana")
    @CrossOrigin(origins = "*")
    public List<DatosSemana> ObtenerDatosSemana(){
        Periodos periodo = ServicioPeriodo.obtenerOCrearSemana(LocalDateTime.now());
        return ServicioDatosSemana.ObtenerDatosSemana(periodo.getSemana());
    }

}
