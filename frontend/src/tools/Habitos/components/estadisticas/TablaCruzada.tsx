import type { EstadisticaMatriz } from "../../types/types";

type Props = {
  datos: EstadisticaMatriz[];
  colorBase: string;
};

const DIAS_ORDEN = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

const capitalizar = (texto: string) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const aRgba = (hex: string, alfa: number) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alfa})`;
};

export const TablaCruzada = ({ datos, colorBase }: Props) => {
  const habitos = Array.from(new Set(datos.map((d) => d.habito)));
  const maxTotal = Math.max(1, ...datos.map((d) => d.total));

  const totalDe = (dia: string, habito: string) => {
    const fila = datos.find((d) => d.dia === dia && d.habito === habito);
    return fila ? fila.total : 0;
  };

  const alfa = (valor: number) =>
    valor === 0 ? 0.08 : 0.2 + (valor / maxTotal) * 0.8;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left text-brand-700 font-semibold">Día</th>
            {habitos.map((habito) => (
              <th
                key={habito}
                className="p-2 text-center text-brand-700 font-semibold"
              >
                {capitalizar(habito)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DIAS_ORDEN.map((dia) => (
            <tr key={dia}>
              <td className="p-2 font-medium text-brand-800">
                {capitalizar(dia)}
              </td>
              {habitos.map((habito) => {
                const valor = totalDe(dia, habito);
                return (
                  <td key={habito} className="p-1">
                    <div
                      className="h-8 rounded-md flex items-center justify-center text-xs font-semibold text-brand-900"
                      style={{
                        backgroundColor: aRgba(colorBase, alfa(valor)),
                      }}
                    >
                      {valor}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
