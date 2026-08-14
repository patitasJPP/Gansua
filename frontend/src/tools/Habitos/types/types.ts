//bamos a poner todos los tipos de la base de datos
export type Habito = {
  id: number;
  habitos: string;
  // TRUE -> "no lo quiero hacer" (dejar/evitar), FALSE -> hábito normal
  esAbstinencia: boolean;
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
  consistenciaPromedio: number;
  diasAbstinencia: number;
  habitosAbstinencia: number;
  diasSinRegistrar: number;
  consistenciaTrend: number;
  tasaRecuperacionGlobal: number;
  mejorHabitoSemana: MejorHabitoSemana | null;
  mejorRachaEvitacion: MejorRachaEvitacion | null;
};

//habito de abstinencia con la racha actual mas larga
export type MejorRachaEvitacion = {
  habitoId: number;
  habito: string;
  rachaActual: number;
};

//mejor hábito de la semana actual (nombre + %)
export type MejorHabitoSemana = {
  habitoId: number;
  habito: string;
  porcentaje: number;
};

//promedio de cumplimiento por habito = (marcas / dias con actividad) x 100
export type CumplimientoHabito = {
  habitoId: number;
  habito: string;
  total: number;
  diasConActividad: number;
  porcentaje: number;
};

//racha actual y maxima de cualquier hábito
export type RachaHabito = {
  habitoId: number;
  habito: string;
  esAbstinencia: boolean;
  rachaActual: number;
  rachaMaxima: number;
  totalDias: number;
};

//habito con cumplimiento < 50% en la semana actual
export type HabitoEnRiesgo = {
  habitoId: number;
  habito: string;
  esAbstinencia: boolean;
  porcentajeSemana: number;
};

//P(B se hizo | A se hizo) en el mismo dia, en %
export type CorrelacionHabito = {
  habitoA: string;
  habitoB: string;
  coOcurrencia: number;
};

//tasa de recuperacion por habito (tras fallar, vuelve al siguiente dia)
export type TasaRecuperacion = {
  habitoId: number;
  habito: string;
  tasa: number;
  diasFallados: number;
  recuperaciones: number;
};

//racha actual y maxima de un hábito de abstinencia
export type RachaAbstinencia = {
  habitoId: number;
  habito: string;
  rachaActual: number;
  rachaMaxima: number;
  totalDias: number;
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
