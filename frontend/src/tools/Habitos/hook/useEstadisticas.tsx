import React, { useCallback, useEffect } from "react";
import { estadisticasService } from "../../../Services/estadisticas";
import type {
  ConsistenciaSemana,
  CorrelacionHabito,
  CumplimientoHabito,
  EstadisticaMatriz,
  EstadisticaPorDia,
  EstadisticaPorHabito,
  EstadisticaPorSemana,
  EstadisticasResumen,
  HabitoEnRiesgo,
  RachaHabito,
  TasaRecuperacion,
} from "../types/types";

export const useEstadisticas = () => {
  const [resumen, setResumen] = React.useState<EstadisticasResumen | null>(
    null,
  );
  const [porDia, setPorDia] = React.useState<EstadisticaPorDia[]>([]);
  const [porHabito, setPorHabito] = React.useState<EstadisticaPorHabito[]>([]);
  const [porSemana, setPorSemana] = React.useState<EstadisticaPorSemana[]>([]);
  const [matriz, setMatriz] = React.useState<EstadisticaMatriz[]>([]);
  const [consistencia, setConsistencia] = React.useState<ConsistenciaSemana[]>(
    [],
  );
  const [cumplimiento, setCumplimiento] = React.useState<CumplimientoHabito[]>(
    [],
  );
  const [rachas, setRachas] = React.useState<RachaHabito[]>([]);
  const [enRiesgo, setEnRiesgo] = React.useState<HabitoEnRiesgo[]>([]);
  const [correlacion, setCorrelacion] = React.useState<CorrelacionHabito[]>([]);
  const [recuperacion, setRecuperacion] = React.useState<TasaRecuperacion[]>(
    [],
  );

  const refrescar = useCallback(async () => {
    try {
      const [r, pd, ph, ps, m, c, cump, rach, riesgo, corr, recup] =
        await Promise.all([
          estadisticasService.resumen(),
          estadisticasService.porDia(),
          estadisticasService.porHabito(),
          estadisticasService.porSemana(),
          estadisticasService.matriz(),
          estadisticasService.consistencia(),
          estadisticasService.cumplimientoPorHabito(),
          estadisticasService.rachasPorHabito(),
          estadisticasService.habitosEnRiesgo(),
          estadisticasService.correlacion(),
          estadisticasService.tasaRecuperacion(),
        ]);
      setResumen(r);
      setPorDia(pd);
      setPorHabito(ph);
      setPorSemana(ps);
      setMatriz(m);
      setConsistencia(c);
      setCumplimiento(cump);
      setRachas(rach);
      setEnRiesgo(riesgo);
      setCorrelacion(corr);
      setRecuperacion(recup);
    } catch (error) {
      console.error("Error al obtener las estadisticas:", error);
    }
  }, []);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  return {
    resumen,
    porDia,
    porHabito,
    porSemana,
    matriz,
    consistencia,
    cumplimiento,
    rachas,
    enRiesgo,
    correlacion,
    recuperacion,
    refrescar,
  };
};
