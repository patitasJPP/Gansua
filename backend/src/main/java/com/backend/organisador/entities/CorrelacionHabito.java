package com.backend.organisador.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CorrelacionHabito {

    private String habitoA;
    private String habitoB;
    private double coOcurrencia;
}
