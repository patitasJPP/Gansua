package com.backend.organisador.services;

import com.backend.organisador.entities.ConsistenciaSemana;
import com.backend.organisador.entities.EstadisticasResumen;
import com.backend.organisador.repocitory.EstadisticasRepository;
import com.backend.organisador.repocitory.HabitosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class EstadisticasService {

    @Autowired
    private EstadisticasRepository estadisticasRepository;

    @Autowired
    private HabitosRepository habitosRepository;

    public EstadisticasResumen resumen() {
        List<EstadisticasRepository.PorDia> porDia = estadisticasRepository.estadisticasPorDia();
        List<EstadisticasRepository.PorHabito> porHabito = estadisticasRepository.estadisticasPorHabito();

        String mejorDia = "";
        long maxDia = 0;
        for (EstadisticasRepository.PorDia d : porDia) {
            if (d.getTotal() > maxDia) {
                maxDia = d.getTotal();
                mejorDia = d.getDia();
            }
        }

        String mejorHabito = "";
        long maxHabito = 0;
        for (EstadisticasRepository.PorHabito h : porHabito) {
            if (h.getTotal() > maxHabito) {
                maxHabito = h.getTotal();
                mejorHabito = h.getHabito();
            }
        }

        long totalMarcas = estadisticasRepository.contarMarcas();
        long diasConActividad = estadisticasRepository.contarDiasConActividad();
        double promedio = diasConActividad == 0 ? 0 : (double) totalMarcas / diasConActividad;
        List<LocalDate> fechas = estadisticasRepository.obtenerFechasMarcadas();

        return new EstadisticasResumen(
                habitosRepository.count(),
                totalMarcas,
                diasConActividad,
                redondear(promedio),
                mejorDia,
                mejorHabito,
                calcularRachaActual(fechas),
                calcularRachaMaxima(fechas)
        );
    }

    public List<EstadisticasRepository.PorDia> porDia() {
        return estadisticasRepository.estadisticasPorDia();
    }

    public List<EstadisticasRepository.PorHabito> porHabito() {
        return estadisticasRepository.estadisticasPorHabito();
    }

    public List<EstadisticasRepository.PorSemana> porSemana() {
        return estadisticasRepository.estadisticasPorSemana();
    }

    public List<EstadisticasRepository.Matriz> matriz() {
        return estadisticasRepository.estadisticasMatriz();
    }

    public List<ConsistenciaSemana> consistencia() {
        List<EstadisticasRepository.PorSemana> semanas = estadisticasRepository.estadisticasPorSemana();
        double maxPosible = 7.0 * habitosRepository.count();

        List<ConsistenciaSemana> resultado = new ArrayList<>();
        for (EstadisticasRepository.PorSemana s : semanas) {
            double porcentaje = maxPosible == 0 ? 0 : ((double) s.getTotal() / maxPosible) * 100;
            resultado.add(new ConsistenciaSemana(s.getSemana(), s.getTotal(), redondear(porcentaje)));
        }
        return resultado;
    }

    private long calcularRachaActual(List<LocalDate> fechas) {
        if (fechas.isEmpty()) {
            return 0;
        }

        Set<LocalDate> set = new HashSet<>(fechas);

        LocalDate dia = LocalDate.now();
        if (!set.contains(dia)) {
            dia = dia.minusDays(1);
        }
        if (!set.contains(dia)) {
            return 0;
        }

        long racha = 0;
        while (set.contains(dia)) {
            racha++;
            dia = dia.minusDays(1);
        }
        return racha;
    }

    private long calcularRachaMaxima(List<LocalDate> fechas) {
        if (fechas.isEmpty()) {
            return 0;
        }

        long racha = 1;
        long max = 1;
        for (int i = 1; i < fechas.size(); i++) {
            if (fechas.get(i).equals(fechas.get(i - 1).plusDays(1))) {
                racha++;
            } else {
                racha = 1;
            }
            if (racha > max) {
                max = racha;
            }
        }
        return max;
    }

    private double redondear(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}
