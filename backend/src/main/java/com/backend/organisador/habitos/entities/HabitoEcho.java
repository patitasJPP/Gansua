package com.backend.organisador.habitos.entities;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "habitos_echos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitoEcho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha_realisado")
    private LocalDate fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dias")
    @JsonIgnoreProperties({"echos"})
    private Dias dia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_habitos")
    @JsonIgnoreProperties({"echos"})
    private Habito habito;
}
