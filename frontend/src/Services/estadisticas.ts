import { apiService } from "./Data";
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
  RachaAbstinencia,
  RachaHabito,
  TasaRecuperacion,
} from "../tools/Habitos/types/types";

export const estadisticasService = {
  async resumen(): Promise<EstadisticasResumen> {
    return await apiService.get<EstadisticasResumen>("estadisticas/resumen");
  },

  async porDia(): Promise<EstadisticaPorDia[]> {
    return await apiService.get<EstadisticaPorDia[]>("estadisticas/por-dia");
  },

  async porHabito(): Promise<EstadisticaPorHabito[]> {
    return await apiService.get<EstadisticaPorHabito[]>(
      "estadisticas/por-habito",
    );
  },

  async porSemana(): Promise<EstadisticaPorSemana[]> {
    return await apiService.get<EstadisticaPorSemana[]>(
      "estadisticas/por-semana",
    );
  },

  async matriz(): Promise<EstadisticaMatriz[]> {
    return await apiService.get<EstadisticaMatriz[]>("estadisticas/matriz");
  },

  async consistencia(): Promise<ConsistenciaSemana[]> {
    return await apiService.get<ConsistenciaSemana[]>(
      "estadisticas/consistencia",
    );
  },

  async rachasAbstinencia(): Promise<RachaAbstinencia[]> {
    return await apiService.get<RachaAbstinencia[]>(
      "estadisticas/rachas-abstinencia",
    );
  },

  async cumplimientoPorHabito(): Promise<CumplimientoHabito[]> {
    return await apiService.get<CumplimientoHabito[]>(
      "estadisticas/cumplimiento-por-habito",
    );
  },

  async rachasPorHabito(): Promise<RachaHabito[]> {
    return await apiService.get<RachaHabito[]>(
      "estadisticas/rachas-por-habito",
    );
  },

  async habitosEnRiesgo(): Promise<HabitoEnRiesgo[]> {
    return await apiService.get<HabitoEnRiesgo[]>(
      "estadisticas/habitos-en-riesgo",
    );
  },

  async correlacion(): Promise<CorrelacionHabito[]> {
    return await apiService.get<CorrelacionHabito[]>(
      "estadisticas/correlacion",
    );
  },

  async tasaRecuperacion(): Promise<TasaRecuperacion[]> {
    return await apiService.get<TasaRecuperacion[]>(
      "estadisticas/tasa-recuperacion",
    );
  },
};
