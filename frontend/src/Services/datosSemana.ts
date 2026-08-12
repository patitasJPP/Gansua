import { apiService } from "./Data";

export const datosSemanaService = {
  //el backend verifica si existe la semana actual, si no la crea y manda los datos
  async getDatosSemana<R>(): Promise<R> {
    return await apiService.get<R>(`habitos/datos_semana`);
  },
};
