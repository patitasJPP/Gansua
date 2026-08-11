package com.backend.organisador.services;

import com.backend.organisador.entities.datosSemana;
import com.backend.organisador.repocitory.datosSemanaRepositori;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class serviceDatosSemana {

    @Autowired
    private datosSemanaRepositori datosSemanaRepositori;

    public List<datosSemana> ObtenerDatosSemana(String semana){
        return datosSemanaRepositori.buscarPorSemana(semana);
    }
}
