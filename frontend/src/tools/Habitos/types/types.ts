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
