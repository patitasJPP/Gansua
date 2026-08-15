package com.backend.organisador.habitos.entities;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsistenciaSemana {

    private String semana;
    private long total;
    private double porcentaje;
}
