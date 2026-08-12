import { apiService } from "./Data";
import type { SincronizacionRequest } from "../tools/Habitos/types/types";

export const datosSemanaService = {
  //el backend verifica si existe la semana actual, si no la crea y manda los datos
  async getDatosSemana<R>(): Promise<R> {
    return await apiService.get<R>(`habitos/datos_semana`);
  },

  //envia los cambios (marcados/desmarcados) al backend para sincronizar con la BD
  async sincronizar<R>(payload: SincronizacionRequest): Promise<R> {
    return await apiService.post<SincronizacionRequest, R>(
      `habitos/sincronizar`,
      payload,
    );
  },
};
