package com.backend.organisador.entities;
import lombok.*;
import jakarta.persistence.*;

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

}
