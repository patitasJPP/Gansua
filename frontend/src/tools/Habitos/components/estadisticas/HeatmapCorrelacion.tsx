import { useMemo } from "react";
import type { CorrelacionHabito } from "../../types/types";
import { useCssColor } from "../../../../theme/ThemeContext";

type Props = {
  correlacion: CorrelacionHabito[];
};

const capitalizar = (texto: string) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export const HeatmapCorrelacion = ({ correlacion }: Props) => {
  const colorBase = useCssColor("--brand-500");

  const { habitos, matriz } = useMemo(() => {
    const nombres = Array.from(
      new Set(correlacion.flatMap((c) => [c.habitoA, c.habitoB])),
    ).sort();

    const mapa = new Map<string, number>();
    correlacion.forEach((c) => {
      mapa.set(`${c.habitoA}|${c.habitoB}`, c.coOcurrencia);
    });

    return { habitos: nombres, matriz: mapa };
  }, [correlacion]);

  if (habitos.length === 0) {
    return (
      <p className="text-sm text-brand-600">
        Aún no hay suficientes datos para correlacionar hábitos.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Fila de encabezados */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `140px repeat(${habitos.length}, 44px)` }}
        >
          <div />
          {habitos.map((h) => (
            <div
              key={`enc-${h}`}
              className="h-10 flex items-end justify-center text-[11px] font-medium text-brand-700 pb-1 truncate"
              title={capitalizar(h)}
            >
              {capitalizar(h)}
            </div>
          ))}
        </div>

        {habitos.map((a) => (
          <div
            key={`fila-${a}`}
            className="grid gap-1 mt-1"
            style={{
              gridTemplateColumns: `140px repeat(${habitos.length}, 44px)`,
            }}
          >
            <div
              className="h-10 flex items-center text-sm font-medium text-brand-800 truncate pr-2"
              title={capitalizar(a)}
            >
              {capitalizar(a)}
            </div>
            {habitos.map((b) => {
              if (a === b) {
                return (
                  <div
                    key={`cel-${a}-${b}`}
                    className="h-10 w-11 rounded-md bg-brand-50/60 border border-brand-100"
                    title="Mismo hábito"
                  />
                );
              }
              const valor = matriz.get(`${a}|${b}`);
              const pct = valor ?? 0;
              const intensidad = pct / 100;
              return (
                <div
                  key={`cel-${a}-${b}`}
                  className="h-10 w-11 rounded-md border border-brand-100 flex items-center justify-center text-[10px] font-semibold tabular-nums"
                  style={{
                    backgroundColor: pct > 0 ? colorBase : undefined,
                    opacity: pct > 0 ? 0.15 + intensidad * 0.85 : 1,
                    color: pct > 0 ? "#ffffff" : "transparent",
                  }}
                  title={`Cuando haces ${capitalizar(a)}, el ${Math.round(pct)}% de las veces también haces ${capitalizar(b)}`}
                >
                  {pct > 0 ? Math.round(pct) : "·"}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
