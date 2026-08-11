import React, { useEffect } from "react";
import type { Habito } from "../types/types";
import { apiService } from "../../../Services/Data";

export const useHabitos = () => {
  const [habito, setHabito] = React.useState<Habito[]>([]);

  useEffect(() => {
    const ObetenerHabitos = async () => {
      try {
        const response = await apiService.get<Habito[]>("habitos");
        console.log("Estos son los hábitos recibidos:", response);
        setHabito(response);
      } catch (error) {
        console.error("Error al obtener los hábitos:", error);
      }
    };

    ObetenerHabitos();
  }, []);

  return [habito];
};
