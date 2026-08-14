package com.backend.organisador.services;

import com.backend.organisador.entities.ConsistenciaSemana;
import com.backend.organisador.entities.CorrelacionHabito;
import com.backend.organisador.entities.CumplimientoHabito;
import com.backend.organisador.entities.EstadisticasResumen;
import com.backend.organisador.entities.Habito;
import com.backend.organisador.entities.HabitoEnRiesgo;
import com.backend.organisador.entities.MejorHabitoSemana;
import com.backend.organisador.entities.MejorRachaEvitacion;
import com.backend.organisador.entities.Periodo;
import com.backend.organisador.entities.RachaAbstinencia;
import com.backend.organisador.entities.RachaHabito;
import com.backend.organisador.entities.TasaRecuperacion;
import com.backend.organisador.repocitory.EstadisticasRepository;
import com.backend.organisador.repocitory.HabitosRepository;
import com.backend.organisador.repocitory.PeriodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

@Service
public class EstadisticasService {

    @Autowired
    private EstadisticasRepository estadisticasRepository;

    @Autowired
    private HabitosRepository habitosRepository;

    @Autowired
    private PeriodoRepository periodoRepository;

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

        return new EstadisticasResumen(
                habitosRepository.count(),
                totalMarcas,
                diasConActividad,
                redondear(promedio),
                mejorDia,
                mejorHabito,
                consistenciaPromedio(),
                estadisticasRepository.contarDiasAbstinencia(),
                estadisticasRepository.contarHabitosAbstinencia(),
                diasSinRegistrar(),
                consistenciaTrend(),
                tasaRecuperacionGlobal(),
                mejorHabitoSemana(),
                mejorRachaEvitacion()
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

    /**
     * Racha actual y maxima por cada habito de abstinencia (es_abstinencia = TRUE).
     * Cada marca en un día = día en que el usuario EVITÓ ese hábito.
     */
    public List<RachaAbstinencia> rachasAbstinencia() {
        List<RachaAbstinencia> resultado = new ArrayList<>();
        for (RachaHabito r : rachasPorHabito()) {
            if (r.isEsAbstinencia()) {
                resultado.add(new RachaAbstinencia(r.getHabitoId(), r.getHabito(), r.getRachaActual(), r.getRachaMaxima(), r.getTotalDias()));
            }
        }
        return resultado;
    }

    // ============================================================
    // KPIs DE ANÁLISIS
    // ============================================================

    /** Días de la semana actual sin ninguna marca (0..7). */
    public long diasSinRegistrar() {
        Periodo periodo = periodoActual();
        if (periodo == null) {
            return 0;
        }
        LocalDate inicio = periodo.getFechaInicio().toLocalDate();
        LocalDate fin = periodo.getFechaFin().toLocalDate().minusDays(1);
        long conActividad = estadisticasRepository.contarDiasConActividadEnRango(inicio, fin);
        long diasSemana = ChronoUnit.DAYS.between(inicio, fin) + 1;
        return Math.max(0, diasSemana - conActividad);
    }

    /** % de consistencia de esta semana menos la anterior. */
    public double consistenciaTrend() {
        List<ConsistenciaSemana> semanas = consistencia();
        if (semanas.size() < 2) {
            return 0;
        }
        double actual = semanas.get(semanas.size() - 1).getPorcentaje();
        double anterior = semanas.get(semanas.size() - 2).getPorcentaje();
        return redondear(actual - anterior);
    }

    /** Promedio global de las tasas de recuperacion por habito. */
    public double tasaRecuperacionGlobal() {
        return tasaRecuperacion().stream()
                .mapToDouble(TasaRecuperacion::getTasa)
                .average()
                .orElse(0);
    }

    /** Habito con mayor % de cumplimiento en la semana actual (denominador 7 dias). */
    public MejorHabitoSemana mejorHabitoSemana() {        Periodo periodo = periodoActual();
        if (periodo == null) {
            return null;
        }
        Map<String, Long> marcas = marcasDeLaSemana(periodo);

        String mejorNombre = null;
        double mejorPct = 0;
        long mejorId = 0;
        for (Habito h : habitosRepository.findAll()) {
            long total = marcas.getOrDefault(h.getHabitos(), 0L);
            double pct = redondear((total / 7.0) * 100);
            if (total > 0 && pct > mejorPct) {
                mejorPct = pct;
                mejorNombre = h.getHabitos();
                mejorId = h.getId().longValue();
            }
        }

        if (mejorNombre == null) {
            return null;
        }
        return new MejorHabitoSemana(mejorId, mejorNombre, mejorPct);
    }

    /** Habito de abstinencia con la racha actual mas larga. */
    public MejorRachaEvitacion mejorRachaEvitacion() {
        MejorRachaEvitacion mejor = null;
        long max = 0;
        for (RachaAbstinencia r : rachasAbstinencia()) {
            if (mejor == null || r.getRachaActual() > max) {
                max = r.getRachaActual();
                mejor = new MejorRachaEvitacion(r.getHabitoId(), r.getHabito(), r.getRachaActual());
            }
        }
        return mejor;
    }

    /** Promedio de cumplimiento por habito = (marcas / dias con actividad) x 100. */
    public List<CumplimientoHabito> cumplimientoPorHabito() {
        long diasConActividad = estadisticasRepository.contarDiasConActividad();
        List<CumplimientoHabito> resultado = new ArrayList<>();
        if (diasConActividad == 0) {
            return resultado;
        }

        Map<Long, Long> conteo = new HashMap<>();
        for (EstadisticasRepository.DetalleMarca m : estadisticasRepository.marcasDetalladas()) {
            conteo.merge(m.getHabitoId(), 1L, Long::sum);
        }

        for (Habito h : habitosRepository.findAll()) {
            long id = h.getId().longValue();
            long total = conteo.getOrDefault(id, 0L);
            double pct = redondear(((double) total / diasConActividad) * 100);
            resultado.add(new CumplimientoHabito(id, h.getHabitos(), total, diasConActividad, pct));
        }

        resultado.sort(Comparator.comparingDouble(CumplimientoHabito::getPorcentaje).reversed());
        return resultado;
    }

    /** Racha actual y maxima de todos los habitos. */
    public List<RachaHabito> rachasPorHabito() {
        Map<Long, Set<LocalDate>> fechasPorHabito = new HashMap<>();
        for (EstadisticasRepository.FechaPorHabito f : estadisticasRepository.fechasPorHabito()) {
            fechasPorHabito.computeIfAbsent(f.getHabitoId(), k -> new HashSet<>()).add(f.getFecha());
        }

        List<RachaHabito> resultado = new ArrayList<>();
        for (Habito h : habitosRepository.findAll()) {
            long id = h.getId().longValue();
            Set<LocalDate> fechas = fechasPorHabito.getOrDefault(id, new HashSet<>());
            resultado.add(new RachaHabito(
                    id,
                    h.getHabitos(),
                    Boolean.TRUE.equals(h.getEsAbstinencia()),
                    calcularRachaActual(fechas),
                    calcularRachaMaxima(fechas),
                    fechas.size()
            ));
        }

        resultado.sort(Comparator.comparingLong(RachaHabito::getRachaMaxima).reversed());
        return resultado;
    }

    /** Habitos con cumplimiento < 50% en la semana actual. */
    public List<HabitoEnRiesgo> habitosEnRiesgo() {
        Periodo periodo = periodoActual();
        List<HabitoEnRiesgo> resultado = new ArrayList<>();
        if (periodo == null) {
            return resultado;
        }

        Map<String, Long> marcas = marcasDeLaSemana(periodo);
        for (Habito h : habitosRepository.findAll()) {
            long total = marcas.getOrDefault(h.getHabitos(), 0L);
            double pct = redondear((total / 7.0) * 100);
            if (pct < 50) {
                resultado.add(new HabitoEnRiesgo(
                        h.getId().longValue(),
                        h.getHabitos(),
                        Boolean.TRUE.equals(h.getEsAbstinencia()),
                        pct
                ));
            }
        }

        resultado.sort(Comparator.comparingDouble(HabitoEnRiesgo::getPorcentajeSemana));
        return resultado;
    }

    /** P(B se hizo | A se hizo) en el mismo dia, en %. */
    public List<CorrelacionHabito> correlacion() {
        List<CorrelacionHabito> resultado = new ArrayList<>();

        Map<LocalDate, Set<String>> porFecha = new HashMap<>();
        for (EstadisticasRepository.DetalleMarca m : estadisticasRepository.marcasDetalladas()) {
            porFecha.computeIfAbsent(m.getFecha(), k -> new HashSet<>()).add(m.getHabito());
        }

        List<String> habitos = habitosRepository.findAll().stream().map(Habito::getHabitos).toList();
        for (String a : habitos) {
            long diasA = 0;
            Map<String, Long> junto = new HashMap<>();
            for (Set<String> set : porFecha.values()) {
                if (set.contains(a)) {
                    diasA++;
                    for (String b : set) {
                        if (!b.equals(a)) {
                            junto.merge(b, 1L, Long::sum);
                        }
                    }
                }
            }
            if (diasA < 2) {
                continue;
            }
            for (String b : habitos) {
                if (b.equals(a)) {
                    continue;
                }
                long co = junto.getOrDefault(b, 0L);
                if (co == 0) {
                    continue;
                }
                double pct = redondear(((double) co / diasA) * 100);
                resultado.add(new CorrelacionHabito(a, b, pct));
            }
        }

        resultado.sort(Comparator.comparingDouble(CorrelacionHabito::getCoOcurrencia).reversed());
        return resultado;
    }

    /** Tasa de recuperacion por habito: tras fallar un dia, ?vuelve al siguiente?. */
    public List<TasaRecuperacion> tasaRecuperacion() {
        List<EstadisticasRepository.DetalleMarca> detalle = estadisticasRepository.marcasDetalladas();

        LocalDate min = null;
        LocalDate max = null;
        Map<Long, Set<LocalDate>> porHabito = new HashMap<>();
        for (EstadisticasRepository.DetalleMarca m : detalle) {
            LocalDate f = m.getFecha();
            if (min == null || f.isBefore(min)) {
                min = f;
            }
            if (max == null || f.isAfter(max)) {
                max = f;
            }
            porHabito.computeIfAbsent(m.getHabitoId(), k -> new HashSet<>()).add(f);
        }

        List<TasaRecuperacion> resultado = new ArrayList<>();
        if (min == null || max == null) {
            return resultado;
        }

        for (Habito h : habitosRepository.findAll()) {
            long id = h.getId().longValue();
            Set<LocalDate> fechas = porHabito.getOrDefault(id, new HashSet<>());
            long fallados = 0;
            long recuperados = 0;
            for (LocalDate d = min; d.isBefore(max); d = d.plusDays(1)) {
                if (fechas.contains(d)) {
                    continue;
                }
                fallados++;
                if (fechas.contains(d.plusDays(1))) {
                    recuperados++;
                }
            }
            double tasa = fallados == 0 ? 0 : redondear(((double) recuperados / fallados) * 100);
            resultado.add(new TasaRecuperacion(id, h.getHabitos(), tasa, fallados, recuperados));
        }

        resultado.sort(Comparator.comparingDouble(TasaRecuperacion::getTasa).reversed());
        return resultado;
    }

    // ============================================================
    // PRIVADOS
    // ============================================================

    private Periodo periodoActual() {
        return periodoRepository.findSemanaByFecha(LocalDate.now().atStartOfDay()).orElse(null);
    }

    private Map<String, Long> marcasDeLaSemana(Periodo periodo) {
        LocalDate inicio = periodo.getFechaInicio().toLocalDate();
        LocalDate fin = periodo.getFechaFin().toLocalDate().minusDays(1);
        Map<String, Long> marcas = new HashMap<>();
        for (EstadisticasRepository.PorHabito ph : estadisticasRepository.marcasPorHabitoEnRango(inicio, fin)) {
            marcas.put(ph.getHabito(), ph.getTotal());
        }
        return marcas;
    }

    /** Promedio del porcentaje de consistencia de todas las semanas */
    private double consistenciaPromedio() {
        List<ConsistenciaSemana> semanas = consistencia();
        if (semanas.isEmpty()) {
            return 0;
        }
        double suma = 0;
        for (ConsistenciaSemana s : semanas) {
            suma += s.getPorcentaje();
        }
        return redondear(suma / semanas.size());
    }

    private long calcularRachaActual(Set<LocalDate> fechas) {
        if (fechas.isEmpty()) {
            return 0;
        }

        LocalDate dia = LocalDate.now();
        if (!fechas.contains(dia)) {
            dia = dia.minusDays(1);
        }
        if (!fechas.contains(dia)) {
            return 0;
        }

        long racha = 0;
        while (fechas.contains(dia)) {
            racha++;
            dia = dia.minusDays(1);
        }
        return racha;
    }

    private long calcularRachaMaxima(Set<LocalDate> fechas) {
        if (fechas.isEmpty()) {
            return 0;
        }

        List<LocalDate> ordenadas = new ArrayList<>(new TreeSet<>(fechas));

        long racha = 1;
        long max = 1;
        for (int i = 1; i < ordenadas.size(); i++) {
            if (ordenadas.get(i).equals(ordenadas.get(i - 1).plusDays(1))) {
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
