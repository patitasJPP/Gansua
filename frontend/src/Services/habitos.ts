import { apiService } from "./Data";
import type { Habito, MensajeResponse } from "../tools/Habitos/types/types";

export const habitosService = {
  async crear(nombre: string, esAbstinencia: boolean): Promise<Habito> {
    return await apiService.post<
      { habitos: string; esAbstinencia: boolean },
      Habito
    >(`habitos`, { habitos: nombre, esAbstinencia });
  },

  async eliminar(id: number): Promise<MensajeResponse> {
    return await apiService.delete<MensajeResponse>(`habitos/${id}`);
  },
};
