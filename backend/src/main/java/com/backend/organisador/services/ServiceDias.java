package com.backend.organisador.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.organisador.repocitory.DiasRepository;
import  com.backend.organisador.entities.Dias;

import java.util.List;

@Service
public class ServiceDias {

    @Autowired
    private DiasRepository diasRepository;

    //funcion para obtener todos los dias de la semana
   public List<Dias> obtenerTodo(){
        List <Dias> dias = diasRepository.findAll();
        return  dias;
    }


}
