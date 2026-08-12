package com.backend.organisador.controllers;

import com.backend.organisador.entities.DatosSemana;
import com.backend.organisador.entities.Periodo;
import com.backend.organisador.services.ServiciosDatosSemana;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.backend.organisador.services.ServiceHabitos;
import  com.backend.organisador.entities.Habitos;
import com.backend.organisador.services.PeriodoService;


import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/habitos")
@CrossOrigin(origins = "*")
public class HabitosController {

    @Autowired
    private ServiceHabitos servicioHabitos;
    @Autowired
    private ServiciosDatosSemana servicioDatosSemana;

    @Autowired
    private PeriodoService servicioPeriodo;


    @GetMapping
    public List<Habitos> obtenerTodo(){
   return servicioHabitos.obtenerTodos();
    }


    @GetMapping("/datos_semana")
    @CrossOrigin(origins = "*")
    public List<DatosSemana> obtenerDatosSemana(){
        Periodo periodo = servicioPeriodo.obtenerOCrearSemana(LocalDateTime.now());
        return servicioDatosSemana.obtenerDatosSemana(periodo.getSemana());
    }

}
