package com.backend.organisador.habitos.entities;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SincronizacionRequest {

    private String semana;
    private List<HabitoMarcado> marcados;
    private List<HabitoMarcado> desmarcados;
}
