package com.backend.organisador.services;

import com.backend.organisador.entities.habitos;
import com.backend.organisador.repocitory.habitosRepositori;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class serviceHabitos {

    @Autowired
    private habitosRepositori HabitosRepositori;


    //fucniones de traer los datos
    public List<habitos> ObtenerTodos(){
        //metemos todos los abitos
        List<habitos> habitos=HabitosRepositori.findAll();

        return habitos;

    }
    public long contadorHabitos(){
        return HabitosRepositori.count();
    }
}
