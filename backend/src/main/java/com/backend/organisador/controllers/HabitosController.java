package com.backend.organisador.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.organisador.services.serviceHabitos;
import  com.backend.organisador.entities.habitos;


import java.util.List;

@RestController
@RequestMapping("/api/habitos")
@CrossOrigin(origins = "*")
public class HabitosController {

    @Autowired
    private serviceHabitos ServicioHabitos;


    @GetMapping
    public List<habitos> ObtenerTodo(){
   return ServicioHabitos.ObtenerTodos();
    }
}
