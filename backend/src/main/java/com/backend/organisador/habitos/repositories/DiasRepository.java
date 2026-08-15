package com.backend.organisador.habitos.repositories;
import com.backend.organisador.habitos.entities.Dias;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiasRepository extends JpaRepository<Dias, Long> {

    Optional<Dias> findByDias(String dias);
}
