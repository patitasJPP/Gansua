package com.backend.organisador.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MejorRachaEvitacion {

    private long habitoId;
    private String habito;
    private long rachaActual;
}
