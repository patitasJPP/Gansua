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

//habito marcado/desmarcado que se envia al backend para sincronizar
export type HabitoMarcado = {
  dia: string;
  habitoId: number;
};

//cuerpo de la peticion de sincronizacion
export type SincronizacionRequest = {
  semana: string;
  marcados: HabitoMarcado[];
  desmarcados: HabitoMarcado[];
};

//respuesta del backend al sincronizar
export type MensajeResponse = {
  success: boolean;
  message: string;
};

//resumen de estadisticas (KPIs)
export type EstadisticasResumen = {
  totalHabitos: number;
  totalMarcas: number;
  diasConActividad: number;
  promedioPorDia: number;
  mejorDia: string;
  mejorHabito: string;
  rachaActual: number;
  rachaMaxima: number;
};

//marcas por dia de la semana
export type EstadisticaPorDia = {
  dia: string;
  total: number;
};

//marcas por habito (ranking)
export type EstadisticaPorHabito = {
  habito: string;
  total: number;
};

//marcas por semana
export type EstadisticaPorSemana = {
  semana: string;
  total: number;
};

//tabla cruzada dia x habito
export type EstadisticaMatriz = {
  dia: string;
  habito: string;
  total: number;
};

//consistencia (porcentaje) por semana
export type ConsistenciaSemana = {
  semana: string;
  total: number;
  porcentaje: number;
};
