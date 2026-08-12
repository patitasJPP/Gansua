package com.backend.organisador.services;

import com.backend.organisador.entities.Habitos;
import com.backend.organisador.repocitory.HabitosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceHabitos {

    @Autowired
    private HabitosRepository habitosRepository;


    //fucniones de traer los datos
    public List<Habitos> obtenerTodos(){
        //metemos todos los abitos
        List<Habitos> habitos = habitosRepository.findAll();

        return habitos;

    }
    public long contadorHabitos(){
        return habitosRepository.count();
    }
}
