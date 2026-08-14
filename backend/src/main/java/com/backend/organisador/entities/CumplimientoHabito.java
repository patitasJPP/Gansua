package com.backend.organisador.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CumplimientoHabito {

    private long habitoId;
    private String habito;
    private long total;
    private long diasConActividad;
    private double porcentaje;
}
