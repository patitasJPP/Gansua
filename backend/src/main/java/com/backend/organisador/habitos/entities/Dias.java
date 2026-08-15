package com.backend.organisador.habitos.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name="dias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="dias")
    private  String dias;

    @JsonIgnore
    @OneToMany(mappedBy = "dia")
    private List<HabitoEcho> echos;

}
