package com.backend.organisador.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RachaAbstinencia {

    private long habitoId;
    private String habito;
    private long rachaActual;
    private long rachaMaxima;
    private long totalDias;
}
