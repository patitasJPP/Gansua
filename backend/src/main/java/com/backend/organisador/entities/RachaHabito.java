package com.backend.organisador.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RachaHabito {

    private long habitoId;
    private String habito;
    private boolean esAbstinencia;
    private long rachaActual;
    private long rachaMaxima;
    private long totalDias;
}
