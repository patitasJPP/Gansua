package com.backend.organisador.habitos.entities;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitoEnRiesgo {

    private long habitoId;
    private String habito;
    private boolean esAbstinencia;
    private double porcentajeSemana;
}
