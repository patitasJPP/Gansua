//bamos a poner todos los tipos de la base de datos
export type Habito = {
  id: number;
  habitos: string;
};

//datos que nos entrega el filtro por semana
export type DatoSemana = {
  semana: string;
  habitos: string;
  dias: string;
  fecha: string;
};
