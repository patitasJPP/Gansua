package com.backend.organisador.habitos.services;
import com.backend.organisador.habitos.entities.HabitoMarcado;
import com.backend.organisador.habitos.entities.DatosSemana;
import com.backend.organisador.habitos.repositories.DatosSemanaRepository;
import com.backend.organisador.habitos.entities.Dias;
import com.backend.organisador.habitos.repositories.DiasRepository;
import com.backend.organisador.habitos.entities.Habito;
import com.backend.organisador.habitos.repositories.HabitosRepository;
import com.backend.organisador.habitos.entities.HabitoEcho;
import com.backend.organisador.habitos.repositories.HabitosEchosRepository;
import com.backend.organisador.habitos.entities.Periodo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ServiciosDatosSemana {

    @Autowired
    private DatosSemanaRepository datosSemanaRepository;

    @Autowired
    private DiasRepository diasRepository;

    @Autowired
    private HabitosRepository habitosRepository;

    @Autowired
    private HabitosEchosRepository habitosEchosRepository;

    public List<DatosSemana> obtenerDatosSemana(String semana){
        return datosSemanaRepository.buscarPorSemana(semana);
    }

    @Transactional
    public int sincronizar(Periodo periodo, List<HabitoMarcado> marcados, List<HabitoMarcado> desmarcados) {
        int cambios = 0;

        if (desmarcados != null) {
            for (HabitoMarcado habito : desmarcados) {
                cambios += eliminar(periodo, habito);
            }
        }

        if (marcados != null) {
            for (HabitoMarcado habito : marcados) {
                cambios += insertar(periodo, habito);
            }
        }

        return cambios;
    }

    private int eliminar(Periodo periodo, HabitoMarcado habito) {
        LocalDate inicio = periodo.getFechaInicio().toLocalDate();
        LocalDate fin = periodo.getFechaFin().toLocalDate();

        List<HabitoEcho> existentes = habitosEchosRepository
                .findByDia_DiasAndHabito_IdAndFechaBetween(habito.getDia(), habito.getHabitoId().longValue(), inicio, fin);

        if (existentes.isEmpty()) {
            System.out.println("== [SERVICIO][ERROR] Marca no encontrada en BD: " + habito.getDia() + " + " + habito.getHabitoId() + " ==");
            return 0;
        }

        habitosEchosRepository.deleteAll(existentes);
        return existentes.size();
    }

    private int insertar(Periodo periodo, HabitoMarcado habito) {
        Optional<Dias> dia = diasRepository.findByDias(habito.getDia());

        if (dia.isEmpty()) {
            System.out.println("== [SERVICIO][ERROR] Dia no encontrado en BD: " + habito.getDia() + " ==");
            return 0;
        }

        Optional<Habito> habitoBd = habitosRepository.findById(habito.getHabitoId().longValue());
        if (habitoBd.isEmpty()) {
            System.out.println("== [SERVICIO][ERROR] Habito no encontrado en BD: " + habito.getHabitoId() + " ==");
            return 0;
        }

        // Evita duplicados: borra cualquier registro previo de este dia+habito en la semana
        eliminar(periodo, habito);

        // Fecha = fecha_inicio de la semana + offset del dia (idDia - 1): lunes -> +0, martes -> +1 ...
        Long idDia = dia.get().getId().longValue();
        LocalDate fecha = periodo.getFechaInicio().toLocalDate().plusDays(idDia - 1);

        HabitoEcho nuevo = new HabitoEcho();
        nuevo.setDia(dia.get());
        nuevo.setHabito(habitoBd.get());
        nuevo.setFecha(fecha);
        habitosEchosRepository.save(nuevo);
        return 1;
    }
}
