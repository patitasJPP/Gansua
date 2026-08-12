import { apiService } from "./Data";
import type { Habito, MensajeResponse } from "../tools/Habitos/types/types";

export const habitosService = {
  async crear(nombre: string): Promise<Habito> {
    return await apiService.post<{ habitos: string }, Habito>(
      `habitos`,
      { habitos: nombre },
    );
  },

  async eliminar(id: number): Promise<MensajeResponse> {
    return await apiService.delete<MensajeResponse>(`habitos/${id}`);
  },
};
