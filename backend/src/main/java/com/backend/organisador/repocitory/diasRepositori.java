package com.backend.organisador.repocitory;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.organisador.entities.dias;

public interface diasRepositori extends JpaRepository<dias,Long> {
}
