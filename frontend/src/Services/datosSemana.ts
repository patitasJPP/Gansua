import { apiService } from "./Data";

export const datosSemanaService = {
  //traemos los datos de la semana segun la fecha y hora enviada
  async getDatosSemana<R>(fecha: string): Promise<R> {
    return await apiService.get<R>(`datos_semana?fecha=${fecha}`);
  },
};
