package com.backend.organisador.repocitory;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.organisador.entities.Habitos;

public interface HabitosRepository extends JpaRepository<Habitos, Long> {
}
