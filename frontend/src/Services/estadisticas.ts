import { apiService } from "./Data";
import type {
  ConsistenciaSemana,
  EstadisticaMatriz,
  EstadisticaPorDia,
  EstadisticaPorHabito,
  EstadisticaPorSemana,
  EstadisticasResumen,
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
};
