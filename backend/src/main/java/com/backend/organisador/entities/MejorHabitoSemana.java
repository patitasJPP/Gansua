package com.backend.organisador.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MejorHabitoSemana {

    private long habitoId;
    private String habito;
    private double porcentaje;
}
