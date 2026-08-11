package com.backend.organisador.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="dias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class dias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="diás")
    private  String dias;
}
