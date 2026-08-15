package com.backend.organisador.habitos.entities;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TasaRecuperacion {

    private long habitoId;
    private String habito;
    private double tasa;
    private long diasFallados;
    private long recuperaciones;
}
