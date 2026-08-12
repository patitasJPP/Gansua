package com.backend.organisador.repocitory;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.organisador.entities.Dias;

import java.util.Optional;

public interface DiasRepository extends JpaRepository<Dias, Long> {

    Optional<Dias> findByDias(String dias);
}
