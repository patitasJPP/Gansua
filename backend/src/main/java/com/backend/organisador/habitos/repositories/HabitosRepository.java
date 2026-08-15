package com.backend.organisador.habitos.repositories;
import com.backend.organisador.habitos.entities.Habito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabitosRepository extends JpaRepository<Habito, Long> {

    List<Habito> findByEsAbstinenciaTrue();
}
