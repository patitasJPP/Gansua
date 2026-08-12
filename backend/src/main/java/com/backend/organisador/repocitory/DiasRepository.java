package com.backend.organisador.repocitory;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.organisador.entities.Dias;

public interface DiasRepository extends JpaRepository<Dias, Long> {
}
