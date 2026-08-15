package com.backend.organisador.habitos.services;
import com.backend.organisador.habitos.entities.Habito;
import com.backend.organisador.habitos.repositories.HabitosRepository;
import com.backend.organisador.habitos.entities.HabitoEcho;
import com.backend.organisador.habitos.repositories.HabitosEchosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceHabitos {

    @Autowired
    private HabitosRepository habitosRepository;

    @Autowired
    private HabitosEchosRepository habitosEchosRepository;


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

    @Transactional
    public void eliminarHabito(Long id){
        if (!habitosRepository.existsById(id)) {
            throw new IllegalArgumentException("El habito con id " + id + " no existe");
        }
        // Borra primero el contenido asociado (habitos_echos) para no violar la FK
        List<HabitoEcho> echos = habitosEchosRepository.findByHabito_Id(id);
        if (!echos.isEmpty()) {
            habitosEchosRepository.deleteAll(echos);
        }
        habitosRepository.deleteById(id);
    }
}
