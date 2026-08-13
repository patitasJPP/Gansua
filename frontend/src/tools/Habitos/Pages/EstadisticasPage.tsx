import { useEffect, useRef } from "react";
import {
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CheckCheck,
  Flame,
  ListChecks,
  Star,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useEstadisticas } from "../hook/useEstadisticas";
import { useCssColor } from "../../../theme/ThemeContext";
import { KpiCard } from "../components/estadisticas/KpiCard";
import { GraficoBarras } from "../components/estadisticas/GraficoBarras";
import { GraficoLinea } from "../components/estadisticas/GraficoLinea";
import { TablaCruzada } from "../components/estadisticas/TablaCruzada";
import { TablaDatos } from "../components/estadisticas/TablaDatos";

const ANCHO_PUNTO = 90;

const formatearPorcentaje = (valor: number) => `${Math.round(valor)}%`;

const capitalizar = (texto: string) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const EstadisticasPage = () => {
  const { resumen, porDia, porHabito, porSemana, matriz, consistencia } =
    useEstadisticas();

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
          titulo="Total de marcas"
          valor={resumen.totalMarcas}
          icono={CheckCheck}
        />
        <KpiCard
          titulo="Total de hábitos"
          valor={resumen.totalHabitos}
          icono={ListChecks}
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
          titulo="Racha actual"
          valor={`${resumen.rachaActual} días`}
          icono={Flame}
        />
        <KpiCard
          titulo="Racha máxima"
          valor={`${resumen.rachaMaxima} días`}
          icono={Trophy}
        />
        <KpiCard
          titulo="Mejor día"
          valor={capitalizar(resumen.mejorDia) || "—"}
          icono={CalendarCheck}
        />
        <KpiCard
          titulo="Mejor hábito"
          valor={capitalizar(resumen.mejorHabito) || "—"}
          icono={Star}
        />
      </div>

      {/* Por día + evolución por semana */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <tr key={h.habito} className="border-b border-brand-50 text-brand-900">
                  <td className="py-2 pr-2">{i + 1}</td>
                  <td>{capitalizar(h.habito)}</td>
                  <td className="text-right font-medium tabular-nums">{h.total}</td>
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
