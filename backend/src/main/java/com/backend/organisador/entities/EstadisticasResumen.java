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
    private double consistenciaPromedio;
    private long diasAbstinencia;
    private long habitosAbstinencia;
    private long diasSinRegistrar;
    private double consistenciaTrend;
    private double tasaRecuperacionGlobal;
    private MejorHabitoSemana mejorHabitoSemana;
    private MejorRachaEvitacion mejorRachaEvitacion;
}
