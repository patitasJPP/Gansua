package com.backend.organisador.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasResumen {

    private long totalHabitos;
    private long totalMarcas;
    private long diasConActividad;
    private double promedioPorDia;
    private String mejorDia;
    private String mejorHabito;
    private long rachaActual;
    private long rachaMaxima;
}
