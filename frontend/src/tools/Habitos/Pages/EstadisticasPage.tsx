import { useEffect, useRef } from "react";
import {
  Ban,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CalendarX2,
  CheckCheck,
  CheckCircle2,
  Flame,
  Gauge,
  HeartPulse,
  ListChecks,
  Share2,
  Star,
  TrendingUp,
  TriangleAlert,
  Trophy,
} from "lucide-react";
import { useEstadisticas } from "../hook/useEstadisticas";
import { useCssColor } from "../../../theme/ThemeContext";
import { KpiCard } from "../components/estadisticas/KpiCard";
import { GraficoBarras } from "../components/estadisticas/GraficoBarras";
import { GraficoLinea } from "../components/estadisticas/GraficoLinea";
import { TablaCruzada } from "../components/estadisticas/TablaCruzada";
import { TablaDatos } from "../components/estadisticas/TablaDatos";
import { HeatmapCorrelacion } from "../components/estadisticas/HeatmapCorrelacion";
import { CaruselHabitos } from "../components/estadisticas/CaruselHabitos";

const ANCHO_PUNTO = 90;

const formatearPorcentaje = (valor: number) => `${Math.round(valor)}%`;

const capitalizar = (texto: string) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const EstadisticasPage = () => {
  const {
    resumen,
    porDia,
    porHabito,
    porSemana,
    matriz,
    consistencia,
    cumplimiento,
    rachas,
    enRiesgo,
    correlacion,
    recuperacion,
  } = useEstadisticas();

  const colorPrimario = useCssColor("--brand-600");
  const colorSecundario = useCssColor("--brand-500");

  const listaSemanaRef = useRef<HTMLUListElement>(null);
  const listaConsistenciaRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = listaSemanaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [porSemana]);

  useEffect(() => {
    const el = listaConsistenciaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [consistencia]);

  if (!resumen) {
    return (
      <div className="min-h-screen bg-brand-50 p-8 flex items-center justify-center">
        <p className="text-brand-600 text-lg">Cargando estadísticas...</p>
      </div>
    );
  }

  const totalPorHabito = porHabito.reduce((acc, h) => acc + h.total, 0);
  const trend = resumen.consistenciaTrend;
  const mejorSemana = resumen.mejorHabitoSemana;

  const caruselData = porHabito.map((h) => ({
    habito: h.habito,
    total: h.total,
    esAbstinencia:
      rachas.find((r) => r.habito === h.habito)?.esAbstinencia ?? false,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-50 to-brand-100/60 p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-900">Estadísticas</h1>
          <p className="text-brand-700 mt-0.5">
            Resumen de tu progreso con los hábitos
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          titulo="Hábitos activos"
          valor={resumen.totalHabitos}
          icono={ListChecks}
        />
        <KpiCard
          titulo="Total de marcas"
          valor={resumen.totalMarcas}
          icono={CheckCheck}
        />
        <KpiCard
          titulo="Días con actividad"
          valor={resumen.diasConActividad}
          icono={CalendarDays}
        />
        <KpiCard
          titulo="Promedio por día"
          valor={resumen.promedioPorDia}
          icono={TrendingUp}
        />
        <KpiCard
          titulo="Consistencia promedio"
          valor={`${Math.round(resumen.consistenciaPromedio)}%`}
          icono={Gauge}
          medidor={resumen.consistenciaPromedio}
        />
        <KpiCard
          titulo="Racha de evitación"
          valor={
            resumen.mejorRachaEvitacion
              ? `${resumen.mejorRachaEvitacion.rachaActual} días`
              : "—"
          }
          icono={Ban}
          color="rose"
          sub={
            resumen.mejorRachaEvitacion
              ? `${capitalizar(resumen.mejorRachaEvitacion.habito)} · lo que más has evitado seguido`
              : "Aún sin hábitos a evitar"
          }
        />
        <KpiCard
          titulo="Mejor día de la semana"
          valor={capitalizar(resumen.mejorDia) || "—"}
          icono={CalendarCheck}
        />
        <KpiCard
          titulo="Mejor hábito (histórico)"
          valor={capitalizar(resumen.mejorHabito) || "—"}
          icono={Star}
        />
        <KpiCard
          titulo="Mejor hábito esta semana"
          valor={mejorSemana ? capitalizar(mejorSemana.habito) : "—"}
          icono={Trophy}
          sub={
            mejorSemana
              ? `${Math.round(mejorSemana.porcentaje)}% de cumplimiento`
              : "Aún sin marcas esta semana"
          }
        />
        <KpiCard
          titulo="Días sin registrar"
          valor={resumen.diasSinRegistrar}
          icono={CalendarX2}
          color={resumen.diasSinRegistrar > 0 ? "amber" : "brand"}
          sub="días sin marcas esta semana"
        />
        <KpiCard
          titulo="Consistencia trend"
          valor={`${trend >= 0 ? "+" : ""}${Math.round(trend)}%`}
          icono={TrendingUp}
          trend
          delta={trend}
          sub="vs semana anterior"
        />
        <KpiCard
          titulo="Tasa de recuperación"
          valor={`${Math.round(resumen.tasaRecuperacionGlobal)}%`}
          icono={HeartPulse}
          sub="vuelve al día siguiente tras fallar"
        />
      </div>

      {/* Carrusel: todos los hábitos con sus veces hechas/evitadas */}
      <div className="mt-6 tarjeta p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-lg font-semibold text-brand-900">
              Todos tus hábitos
            </h2>
            <p className="text-sm text-brand-600 mt-1">
              Cuántas veces los hiciste o evitaste en todo el historial
            </p>
          </div>
          <span className="text-xs text-brand-500">
            Desliza para ver más
          </span>
        </div>
        <div className="mt-4">
          <CaruselHabitos data={caruselData} />
        </div>
      </div>

      {/* Promedio de cumplimiento + tasa de recuperación */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tarjeta p-6">
          <h2 className="text-lg font-semibold text-brand-900">
            Promedio de cumplimiento por hábito
          </h2>
          <p className="text-sm text-brand-600 mt-1">
            Porcentaje de días con actividad en los que cumpliste cada hábito
          </p>
          <div className="mt-4 space-y-3">
            {cumplimiento.length === 0 ? (
              <p className="text-sm text-brand-600">
                Aún no hay marcas registradas.
              </p>
            ) : (
              cumplimiento.map((c) => (
                <div key={c.habitoId}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-brand-800">
                      {capitalizar(c.habito)}
                    </span>
                    <span className="tabular-nums text-brand-700">
                      {Math.round(c.porcentaje)}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-brand-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-500 transition-all"
                      style={{ width: `${Math.min(100, c.porcentaje)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="tarjeta p-6">
          <h2 className="text-lg font-semibold text-brand-900">
            Tasa de recuperación por hábito
          </h2>
          <p className="text-sm text-brand-600 mt-1">
            Tras fallar un día, qué porcentaje de veces vuelves al día siguiente
          </p>
          <div className="mt-4 space-y-3">
            {recuperacion.length === 0 ? (
              <p className="text-sm text-brand-600">
                Aún no hay datos suficientes.
              </p>
            ) : (
              recuperacion.map((r) => (
                <div key={r.habitoId}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-brand-800">
                      {capitalizar(r.habito)}
                    </span>
                    <span className="tabular-nums text-brand-700">
                      {Math.round(r.tasa)}% · {r.recuperaciones}/
                      {r.diasFallados}
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-brand-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        r.tasa >= 50
                          ? "bg-gradient-to-r from-brand-600 to-brand-500"
                          : "bg-gradient-to-r from-amber-500 to-amber-400"
                      }`}
                      style={{ width: `${Math.min(100, r.tasa)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rachas máximas + hábitos en riesgo */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tarjeta p-6">
          <h2 className="text-lg font-semibold text-brand-900">
            Rachas máximas por hábito
          </h2>
          <p className="text-sm text-brand-600 mt-1">
            Tu secuencia consecutiva más larga en todo el historial
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rachas.map((r) => (
              <div
                key={r.habitoId}
                className={`rounded-xl border p-4 flex items-center justify-between gap-3 ${
                  r.esAbstinencia
                    ? "border-rose-100 bg-rose-50/60"
                    : "border-brand-100 bg-brand-50/40"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`truncate font-semibold ${
                        r.esAbstinencia ? "text-rose-900" : "text-brand-900"
                      }`}
                    >
                      {capitalizar(r.habito)}
                    </span>
                    {r.esAbstinencia && (
                      <span className="shrink-0 inline-flex items-center text-[10px] uppercase tracking-wide font-bold text-rose-600 bg-rose-100 rounded-full px-2 py-0.5">
                        Evitar
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-600 mt-0.5">
                    Actual: {r.rachaActual} · Total: {r.totalDias} días
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Flame
                      className={`w-4 h-4 ${
                        r.esAbstinencia ? "text-rose-500" : "text-brand-500"
                      }`}
                    />
                    <p
                      className={`text-2xl font-bold tabular-nums ${
                        r.esAbstinencia ? "text-rose-700" : "text-brand-800"
                      }`}
                    >
                      {r.rachaMaxima}
                    </p>
                  </div>
                  <p className="text-xs text-brand-500">días seguidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tarjeta p-6">
          <h2 className="text-lg font-semibold text-brand-900">
            Hábitos en riesgo
          </h2>
          <p className="text-sm text-brand-600 mt-1">
            Cumplimiento menor al 50% esta semana
          </p>
          <div className="mt-4">
            {enRiesgo.length === 0 ? (
              <div className="flex items-center gap-3 text-green-700 bg-green-50 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">
                  Sin hábitos en riesgo esta semana
                </span>
              </div>
            ) : (
              <ul className="divide-y divide-brand-50">
                {enRiesgo.map((r) => (
                  <li
                    key={r.habitoId}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <TriangleAlert className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="truncate text-brand-800">
                        {capitalizar(r.habito)}
                      </span>
                      {r.esAbstinencia && (
                        <span className="shrink-0 inline-flex items-center text-[10px] uppercase tracking-wide font-bold text-rose-600 bg-rose-100 rounded-full px-2 py-0.5">
                          Evitar
                        </span>
                      )}
                    </div>
                    <span className="tabular-nums font-semibold text-amber-600">
                      {Math.round(r.porcentajeSemana)}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Correlación de hábitos */}
      <div className="mt-6 tarjeta p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-brand-900">
              Correlación de hábitos
            </h2>
            <p className="text-sm text-brand-600">
              Cuando haces el hábito de la fila, ¿qué tanto también haces el de
              la columna?
            </p>
          </div>
        </div>
        <div className="mt-4">
          <HeatmapCorrelacion correlacion={correlacion} />
        </div>
      </div>

      {/* Por día + evolución por semana */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tarjeta p-6">
          <h2 className="text-lg font-semibold text-brand-900">
            Marcas por día de la semana
          </h2>
          <div className="mt-4">
            <GraficoBarras
              data={porDia}
              xKey="dia"
              yKey="total"
              color={colorPrimario}
              xLabel="Día de la semana"
              yLabel="Marcas"
            />
            <TablaDatos
              data={porDia}
              xKey="dia"
              yKey="total"
              tituloX="Día"
              tituloY="Marcas"
            />
          </div>
        </div>

        <div className="tarjeta p-6">
          <h2 className="text-lg font-semibold text-brand-900">
            Evolución por semana
          </h2>
          <p className="text-sm text-brand-600 mt-1">
            Desplázate hacia la derecha para ver las semanas anteriores
          </p>
          <div className="mt-4">
            <GraficoLinea
              data={porSemana}
              xKey="semana"
              yKey="total"
              color={colorPrimario}
              xLabel="Semana"
              yLabel="Marcas"
              anchoPunto={ANCHO_PUNTO}
            />
            <ul
              ref={listaSemanaRef}
              className="mt-4 h-48 overflow-y-auto border border-brand-100 rounded-lg divide-y divide-brand-50"
            >
              {porSemana.map((w, i) => {
                const esActual = i === porSemana.length - 1;
                return (
                  <li
                    key={i}
                    className={`flex items-center justify-between px-3 h-8 text-sm ${
                      esActual
                        ? "bg-brand-50 font-semibold text-brand-900"
                        : "text-brand-700"
                    }`}
                  >
                    <span className="truncate">{capitalizar(w.semana)}</span>
                    <span className="tabular-nums">{w.total} marcas</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Ranking + consistencia */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="tarjeta p-6">
          <h2 className="text-lg font-semibold text-brand-900">
            Ranking de hábitos
          </h2>
          <div className="mt-4">
            <GraficoBarras
              data={porHabito}
              xKey="habito"
              yKey="total"
              color={colorSecundario}
              xLabel="Hábito"
              yLabel="Marcas"
            />
          </div>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-brand-700 border-b border-brand-200">
                <th className="py-2 pr-2">#</th>
                <th>Hábito</th>
                <th className="text-right">Marcas</th>
                <th className="text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {porHabito.map((h, i) => (
                <tr
                  key={h.habito}
                  className="border-b border-brand-50 text-brand-900"
                >
                  <td className="py-2 pr-2">{i + 1}</td>
                  <td>{capitalizar(h.habito)}</td>
                  <td className="text-right font-medium tabular-nums">
                    {h.total}
                  </td>
                  <td className="text-right tabular-nums">
                    {totalPorHabito > 0
                      ? Math.round((h.total / totalPorHabito) * 100)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tarjeta p-6">
          <h2 className="text-lg font-semibold text-brand-900">
            Consistencia por semana (%)
          </h2>
          <p className="text-sm text-brand-600 mt-1">
            Desplázate hacia la derecha para ver las semanas anteriores
          </p>
          <div className="mt-4">
            <GraficoLinea
              data={consistencia}
              xKey="semana"
              yKey="porcentaje"
              color={colorPrimario}
              xLabel="Semana"
              yLabel="Consistencia (%)"
              formatear={formatearPorcentaje}
              anchoPunto={ANCHO_PUNTO}
            />
            <ul
              ref={listaConsistenciaRef}
              className="mt-4 h-48 overflow-y-auto border border-brand-100 rounded-lg divide-y divide-brand-50"
            >
              {consistencia.map((w, i) => {
                const esActual = i === consistencia.length - 1;
                return (
                  <li
                    key={i}
                    className={`flex items-center justify-between px-3 h-8 text-sm ${
                      esActual
                        ? "bg-brand-50 font-semibold text-brand-900"
                        : "text-brand-700"
                    }`}
                  >
                    <span className="truncate">{capitalizar(w.semana)}</span>
                    <span className="tabular-nums">
                      {formatearPorcentaje(Number(w.porcentaje))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Matriz día x hábito */}
      <div className="mt-6 tarjeta p-6">
        <h2 className="text-lg font-semibold text-brand-900">
          Matriz Día x Hábito
        </h2>
        <p className="text-sm text-brand-600 mt-1">
          La intensidad del color indica la cantidad de veces realizada
        </p>
        <div className="mt-4">
          <TablaCruzada datos={matriz} colorBase={colorPrimario} />
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPage;
