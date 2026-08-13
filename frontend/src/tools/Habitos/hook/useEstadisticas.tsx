import React, { useCallback, useEffect } from "react";
import { estadisticasService } from "../../../Services/estadisticas";
import type {
  ConsistenciaSemana,
  EstadisticaMatriz,
  EstadisticaPorDia,
  EstadisticaPorHabito,
  EstadisticaPorSemana,
  EstadisticasResumen,
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

  const refrescar = useCallback(async () => {
    try {
      const [r, pd, ph, ps, m, c] = await Promise.all([
        estadisticasService.resumen(),
        estadisticasService.porDia(),
        estadisticasService.porHabito(),
        estadisticasService.porSemana(),
        estadisticasService.matriz(),
        estadisticasService.consistencia(),
      ]);
      setResumen(r);
      setPorDia(pd);
      setPorHabito(ph);
      setPorSemana(ps);
      setMatriz(m);
      setConsistencia(c);
    } catch (error) {
      console.error("Error al obtener las estadisticas:", error);
    }
  }, []);

  useEffect(() => {
    refrescar();
  }, [refrescar]);

  return { resumen, porDia, porHabito, porSemana, matriz, consistencia, refrescar };
};
