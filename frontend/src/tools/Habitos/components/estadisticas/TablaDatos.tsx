type Props = {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  tituloX?: string;
  tituloY?: string;
  formatear?: (valor: number) => string;
};

const capitalizar = (texto: string) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export const TablaDatos = ({
  data,
  xKey,
  yKey,
  tituloX,
  tituloY,
  formatear,
}: Props) => {
  const valores = data.map((d) => Number(d[yKey]));
  const max = Math.max(0, ...valores);
  const fmt = formatear ?? ((v: number) => String(Math.round(v)));

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-brand-700 border-b border-brand-200">
            <th className="py-2 pr-2">{tituloX ?? capitalizar(xKey)}</th>
            <th className="py-2 text-right">{tituloY ?? capitalizar(yKey)}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((fila, i) => {
            const valor = Number(fila[yKey]);
            const esMax = valores.length > 0 && valor === max;
            return (
              <tr key={i} className="border-b border-brand-50 text-brand-800">
                <td className="py-2 pr-2">
                  {capitalizar(String(fila[xKey]))}
                </td>
                <td
                  className={`py-2 text-right font-medium tabular-nums ${
                    esMax ? "text-brand-700" : ""
                  }`}
                >
                  {fmt(valor)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
