package com.backend.organisador.repocitory;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.organisador.entities.habitos;

public interface habitosRepositori extends JpaRepository <habitos,Long> {
}
