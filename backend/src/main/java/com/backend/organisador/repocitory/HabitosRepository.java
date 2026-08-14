package com.backend.organisador.repocitory;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.organisador.entities.Habito;

import java.util.List;

public interface HabitosRepository extends JpaRepository<Habito, Long> {

    List<Habito> findByEsAbstinenciaTrue();
}
