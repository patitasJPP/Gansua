package com.backend.organisador.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.organisador.repocitory.diasRepositori;
import  com.backend.organisador.entities.dias;

import java.util.List;

@Service
public class serviceDias {

    @Autowired
    private diasRepositori diasRepositori;

    //funcion para obtener todos los dias de la semana
   public List<dias> ObtenerTodo(){
        List <dias> dias= diasRepositori.findAll();
        return  dias;
    }


}
