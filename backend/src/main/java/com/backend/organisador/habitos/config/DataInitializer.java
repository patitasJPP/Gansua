package com.backend.organisador.habitos.config;

import com.backend.organisador.habitos.entities.Dias;
import com.backend.organisador.habitos.repositories.DiasRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DiasRepository diasRepository;

    public DataInitializer(DiasRepository diasRepository) {
        this.diasRepository = diasRepository;
    }

    @Override
    public void run(String... args) {
        List<String> diasEsperados = List.of(
                "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"
        );

        for (String nombre : diasEsperados) {
            if (diasRepository.findByDias(nombre).isEmpty()) {
                Dias nuevo = new Dias();
                nuevo.setDias(nombre);
                diasRepository.save(nuevo);
                System.out.println("== [DATA-INIT] Dia insertado: " + nombre + " ==");
            }
        }
    }
}
