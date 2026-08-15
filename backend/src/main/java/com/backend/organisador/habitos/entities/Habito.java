package com.backend.organisador.habitos.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name="habitos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Habito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Integer id;

    @Column(name= "habitos")
    private  String habitos;

    @Column(name = "es_abstinencia")
    private Boolean esAbstinencia;

    @JsonIgnore
    @OneToMany(mappedBy = "habito")
    private List<HabitoEcho> echos;

}
