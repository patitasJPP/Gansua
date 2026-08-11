package com.backend.organisador.controllers;

import com.backend.organisador.entities.datosSemana;
import com.backend.organisador.entities.Periodo;
import com.backend.organisador.services.serviceDatosSemana;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import com.backend.organisador.services.serviceHabitos;
import  com.backend.organisador.entities.habitos;
import com.backend.organisador.services.servicePeriodo;


import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/habitos")
@CrossOrigin(origins = "*")
public class HabitosController {

    @Autowired
    private serviceHabitos ServicioHabitos;
    private serviceDatosSemana ServicioDatosSemana;

    @Autowired
    private servicePeriodo ServicioPeriodo;


    @GetMapping
    public List<habitos> ObtenerTodo(){
   return ServicioHabitos.ObtenerTodos();
    }


    @GetMapping("/datos_semana")
    public List<datosSemana> ObtenerDatosSemana(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fecha){
        Periodo periodo = ServicioPeriodo.obtenerOCrearSemana(fecha);
        return ServicioDatosSemana.ObtenerDatosSemana(periodo.getSemana());
    }

}
