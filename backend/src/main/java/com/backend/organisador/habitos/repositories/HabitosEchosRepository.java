package com.backend.organisador.habitos.repositories;
import com.backend.organisador.habitos.entities.HabitoEcho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HabitosEchosRepository extends JpaRepository<HabitoEcho, Long> {

    List<HabitoEcho> findByDia_DiasAndHabito_IdAndFechaBetween(
            String dia, Long habitoId, LocalDate inicio, LocalDate fin);

    List<HabitoEcho> findByHabito_Id(Long habitoId);
}
