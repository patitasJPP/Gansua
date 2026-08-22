import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  titulo: string;
  valor: string | number;
  icono?: LucideIcon;
  color?: "brand" | "rose" | "amber";
  medidor?: number;
  delta?: number;
  trend?: boolean;
  sub?: string;
};

const RADIO = 24;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

const COLORES = {
  brand: {
    texto: "text-brand-900",
    icono: "bg-brand-100 text-brand-600",
    acento: "text-brand-600",
    barra: "",
  },
  rose: {
    texto: "text-rose-900",
    icono: "bg-rose-100 text-rose-600",
    acento: "text-rose-600",
    barra: "",
  },
  amber: {
    texto: "text-amber-900",
    icono: "bg-amber-100 text-amber-600",
    acento: "text-amber-600",
    barra: "",
  },
} as const;

export const KpiCard = ({
  titulo,
  valor,
  icono: Icono,
  color = "brand",
  medidor,
  delta,
  trend,
  sub,
}: Props) => {
  const tema = COLORES[color];

  const claseValor = trend
    ? (delta ?? 0) >= 0
      ? "text-green-600"
      : "text-red-600"
    : tema.texto;

  const porcentaje =
    typeof medidor === "number"
      ? Math.min(100, Math.max(0, Math.round(medidor)))
      : 0;
  const avance = (porcentaje / 100) * CIRCUNFERENCIA;

  return (
    <div className="tarjeta p-4 sm:p-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium text-brand-600 uppercase tracking-wider">
          {titulo}
        </p>
        <p className={`mt-2 text-2xl sm:text-3xl font-bold tabular-nums ${claseValor} truncate`}>
          {valor}
        </p>
        {typeof delta === "number" && delta !== 0 && !trend && (
          <p
            className={`mt-1 inline-flex items-center gap-0.5 text-sm font-semibold ${
              delta > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {delta > 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {Math.abs(delta)}%
          </p>
        )}
        {typeof delta === "number" && delta === 0 && !trend && (
          <p className="mt-1 text-sm font-semibold text-brand-500">Sin cambio</p>
        )}
        {typeof medidor === "number" && (
          <p className={`mt-1 text-xs font-semibold ${tema.acento}`}>
            {porcentaje}% de constancia
          </p>
        )}
        {sub && <p className="mt-1 text-xs text-brand-500 truncate">{sub}</p>}
      </div>
      {typeof medidor === "number" ? (
        <div
          className={`relative w-14 h-14 shrink-0 ${
            color === "rose" ? "text-rose-500" : "text-brand-600"
          }`}
        >
          <svg viewBox="0 0 64 64" className="w-14 h-14 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={RADIO}
              fill="none"
              strokeWidth="6"
              className="stroke-brand-100"
            />
            <circle
              cx="32"
              cy="32"
              r={RADIO}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${avance} ${CIRCUNFERENCIA}`}
              className="stroke-current transition-all duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums">
            {porcentaje}
          </span>
        </div>
      ) : (
        Icono && (
          <div
            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${tema.icono}`}
          >
            <Icono className="w-5 h-5" />
          </div>
        )
      )}
    </div>
  );
};
