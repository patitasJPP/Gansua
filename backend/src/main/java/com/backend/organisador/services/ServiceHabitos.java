package com.backend.organisador.services;

import com.backend.organisador.entities.Habito;
import com.backend.organisador.repocitory.HabitosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceHabitos {

    @Autowired
    private HabitosRepository habitosRepository;


    //fucniones de traer los datos
    public List<Habito> obtenerTodos(){
        //metemos todos los abitos
        List<Habito> habitos = habitosRepository.findAll();

        return habitos;

    }

    public Habito crearHabito(String nombre, boolean esAbstinencia){
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del habito no puede estar vacio");
        }
        Habito nuevo = new Habito();
        nuevo.setHabitos(nombre.trim());
        nuevo.setEsAbstinencia(esAbstinencia);
        return habitosRepository.save(nuevo);
    }

    public void eliminarHabito(Long id){
        if (!habitosRepository.existsById(id)) {
            throw new IllegalArgumentException("El habito con id " + id + " no existe");
        }
        habitosRepository.deleteById(id);
    }
}
