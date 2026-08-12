package com.backend.organisador.services;

import com.backend.organisador.entities.DatosSemana;
import com.backend.organisador.entities.Dias;
import com.backend.organisador.entities.HabitoMarcado;
import com.backend.organisador.entities.Periodo;
import com.backend.organisador.repocitory.DatosSemanaRepository;
import com.backend.organisador.repocitory.DiasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ServiciosDatosSemana {

    @Autowired
    private DatosSemanaRepository datosSemanaRepository;

    @Autowired
    private DiasRepository diasRepository;

    public List<DatosSemana> obtenerDatosSemana(String semana){
        System.out.println("== [SERVICIO] Obteniendo datos de la semana: " + semana + " ==");
        List<DatosSemana> datos = datosSemanaRepository.buscarPorSemana(semana);
        System.out.println("== [SERVICIO] Se encontraron " + datos.size() + " registros en la semana " + semana + " ==");
        return datos;
    }

    @Transactional
    public int sincronizar(Periodo periodo, List<HabitoMarcado> marcados, List<HabitoMarcado> desmarcados) {
        int cambios = 0;
        System.out.println("== [SERVICIO] Sincronizando semana: " + periodo.getSemana() + " ==");

        if (desmarcados != null) {
            System.out.println("== [SERVICIO] Desmarcados recibidos: " + desmarcados.size() + " ==");
            for (HabitoMarcado habito : desmarcados) {
                cambios += eliminar(periodo, habito);
            }
        }

        if (marcados != null) {
            System.out.println("== [SERVICIO] Marcados recibidos: " + marcados.size() + " ==");
            for (HabitoMarcado habito : marcados) {
                cambios += insertar(periodo, habito);
            }
        }

        System.out.println("== [SERVICIO] Sincronizacion completada. Total de cambios: " + cambios + " ==");
        return cambios;
    }

    private int eliminar(Periodo periodo, HabitoMarcado habito) {
        Optional<Dias> dia = diasRepository.findByDias(habito.getDia());

        if (dia.isEmpty()) {
            System.out.println("== [SERVICIO][ERROR] Dia no encontrado en BD: " + habito.getDia() + " ==");
            return 0;
        }

        Long idDia = dia.get().getId().longValue();
        Long idHabito = habito.getHabitoId().longValue();
        LocalDateTime inicio = periodo.getFechaInicio();
        LocalDateTime fin = periodo.getFechaFin();

        int eliminados = datosSemanaRepository.eliminarHabito(idDia, idHabito, inicio, fin);
        System.out.println("== [SERVICIO] Eliminado " + eliminados + " registro(s) del dia "
                + habito.getDia() + " habitoId " + habito.getHabitoId() + " ==");
        return eliminados;
    }

    private int insertar(Periodo periodo, HabitoMarcado habito) {
        Optional<Dias> dia = diasRepository.findByDias(habito.getDia());

        if (dia.isEmpty()) {
            System.out.println("== [SERVICIO][ERROR] Dia no encontrado en BD: " + habito.getDia() + " ==");
            return 0;
        }

        Long idDia = dia.get().getId().longValue();
        Long idHabito = habito.getHabitoId().longValue();

        // Evita duplicados: borra cualquier registro previo de este dia+habito en la semana
        eliminar(periodo, habito);

        // Fecha = fecha_inicio de la semana + offset del dia (idDia - 1): lunes -> +0, martes -> +1 ...
        LocalDate fecha = periodo.getFechaInicio().toLocalDate().plusDays(idDia - 1);

        int insertados = datosSemanaRepository.insertarHabito(idDia, idHabito, fecha);
        System.out.println("== [SERVICIO] Insertado " + insertados + " registro(s): dia "
                + habito.getDia() + " habitoId " + habito.getHabitoId() + " fecha " + fecha + " ==");
        return insertados;
    }
}
