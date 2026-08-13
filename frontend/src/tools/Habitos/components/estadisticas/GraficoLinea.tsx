import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useCssColor } from "../../../../theme/ThemeContext";

type Props = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  color: string;
  xLabel?: string;
  yLabel?: string;
  formatear?: (valor: number) => string;
  mostrarEtiquetasX?: boolean;
  anchoPunto?: number;
};

const ALTO = 300;
const MARGEN_TOP = 20;
const MARGEN_BOTTOM = 30;
const MARGEN_LATERAL = 16;
const ANCHO_EJE = 60;
const MARGEN_EJE = ANCHO_EJE + 4;
const MARGEN = {
  top: MARGEN_TOP,
  right: MARGEN_LATERAL,
  bottom: MARGEN_BOTTOM,
  left: 0,
};
const PLOT_ALTO = ALTO - MARGEN_TOP - MARGEN_BOTTOM;

const capitalizar = (texto: string) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export const GraficoLinea = ({
  data,
  xKey,
  yKey,
  color,
  xLabel = "Semana",
  formatear,
  mostrarEtiquetasX = true,
  anchoPunto,
}: Props) => {
  const valores = data.map((d) => Number(d[yKey]));
  const max = Math.max(1, ...valores);
  const n = data.length;
  const fmt = formatear ?? ((v: number) => String(Math.round(v)));
  const conScroll = typeof anchoPunto === "number";

  const colorMalla = useCssColor("--brand-100");
  const colorTexto = useCssColor("--brand-700");
  const colorBordeTooltip = useCssColor("--brand-200");

  const ticksValores = [0, 1, 2, 3, 4].map(
    (_, i) => max - (max / 4) * i,
  );
  const yDe = (v: number) => MARGEN_TOP + (1 - v / max) * PLOT_ALTO;

  const ejeY = (
    <YAxis
      domain={[0, max]}
      width={MARGEN_EJE}
      tickCount={5}
      tickFormatter={(v: number) => fmt(v)}
      tick={{ fontSize: 11, fill: colorTexto }}
      tickLine={false}
      axisLine={false}
    />
  );

  const linea = (
    <Line
      type="monotone"
      dataKey={yKey}
      stroke={color}
      strokeWidth={2}
      dot={{ r: 4, fill: color, strokeWidth: 0 }}
      activeDot={{ r: 5 }}
      isAnimationActive={false}
      label={{
        position: "top",
        fontSize: 11,
        fill: colorTexto,
        formatter: (v) => fmt(Number(v ?? 0)),
      }}
    />
  );

  const tooltip = (
    <Tooltip
      formatter={(value) => [fmt(Number(value)), capitalizar(yKey)]}
      labelFormatter={(v) => capitalizar(String(v))}
      contentStyle={{
        borderRadius: 8,
        borderColor: colorBordeTooltip,
        fontSize: 13,
      }}
    />
  );

  const tituloEjeX = (
    <div className="mt-1 text-center text-xs font-semibold text-brand-500 uppercase tracking-wider">
      {xLabel}
    </div>
  );

  if (!conScroll) {
    return (
      <div>
        <ResponsiveContainer width="100%" height={ALTO}>
          <LineChart data={data} margin={MARGEN}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={colorMalla}
          />
          {ejeY}
          <XAxis
            dataKey={xKey}
            interval={0}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: colorTexto }}
            height={30}
          />
          {tooltip}
          {linea}
        </LineChart>
      </ResponsiveContainer>
      {mostrarEtiquetasX && tituloEjeX}
    </div>
  );
}

  const ancho = n * anchoPunto + MARGEN_EJE;

  return (
    <div className="relative">
      {/* Eje Y fijo, sobrepuesto y siempre visible al hacer scroll */}
      <div
        className="absolute left-0 top-0 z-10 pointer-events-none"
        style={{ width: ANCHO_EJE, height: ALTO }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        {ticksValores.map((t, i) => (
          <span
            key={i}
            className="absolute right-2 bg-white/90 border border-brand-100 rounded px-1 py-0.5 text-[9px] leading-none text-brand-600 font-medium tabular-nums"
            style={{ top: yDe(t) - 7 }}
          >
            {fmt(t)}
          </span>
        ))}
      </div>

      {/* Gráfico con scroll horizontal que ocupa todo el ancho */}
      <div className="overflow-x-auto">
        <div style={{ width: ancho }}>
          <ResponsiveContainer width="100%" height={ALTO}>
            <LineChart data={data} margin={{ ...MARGEN, left: MARGEN_EJE }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={colorMalla}
              />
              <YAxis hide domain={[0, max]} ticks={ticksValores} />
              <XAxis
                dataKey={xKey}
                interval={0}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: colorTexto }}
                height={30}
              />
              {tooltip}
              {linea}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Título del eje X (fijo) */}
      {mostrarEtiquetasX && tituloEjeX}
    </div>
  );
};
