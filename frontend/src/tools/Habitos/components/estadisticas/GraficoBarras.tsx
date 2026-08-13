import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
};

const capitalizar = (texto: string) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export const GraficoBarras = ({
  data,
  xKey,
  yKey,
  color,
  xLabel = "Semana",
  formatear,
}: Props) => {
  const colorMalla = useCssColor("--brand-100");
  const colorTexto = useCssColor("--brand-700");
  const colorBordeTooltip = useCssColor("--brand-200");
  const fmt = formatear ?? ((v: number) => String(Math.round(v)));
  const muchos = data.length > 10;

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 20, right: 12, bottom: 10, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={colorMalla}
          />
          <XAxis
            dataKey={xKey}
            interval={0}
            tickFormatter={(v: string) => capitalizar(v)}
            tick={{ fontSize: muchos ? 9 : 11, fill: colorTexto }}
            angle={muchos ? -35 : 0}
            textAnchor={muchos ? "end" : "middle"}
            height={muchos ? 60 : 30}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: colorTexto }}
            tickFormatter={(v: number) => fmt(v)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(v) => [fmt(Number(v)), capitalizar(yKey)]}
            labelFormatter={(v) => capitalizar(String(v))}
            contentStyle={{
              borderRadius: 8,
              borderColor: colorBordeTooltip,
              fontSize: 13,
            }}
          />
          <Bar
            dataKey={yKey}
            fill={color}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
            label={{
              position: "top",
              fontSize: 11,
              fill: colorTexto,
              formatter: (v) => fmt(Number(v ?? 0)),
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-1 text-center text-xs font-semibold text-brand-500 uppercase tracking-wider">
        {xLabel}
      </div>
    </div>
  );
};
