package com.backend.organisador.services;

import com.backend.organisador.entities.DatosSemana;
import com.backend.organisador.repocitory.DatosSemanaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiciosDatosSemana {

    @Autowired
    private DatosSemanaRepository datosSemanaRepository;

    public List<DatosSemana> obtenerDatosSemana(String semana){
        return datosSemanaRepository.buscarPorSemana(semana);
    }
}
