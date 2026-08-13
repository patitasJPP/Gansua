import type { LucideIcon } from "lucide-react";

type Props = {
  titulo: string;
  valor: string | number;
  icono?: LucideIcon;
};

export const KpiCard = ({ titulo, valor, icono: Icono }: Props) => {
  return (
    <div className="tarjeta p-5 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-brand-600 uppercase tracking-wider">
          {titulo}
        </p>
        <p className="mt-2 text-3xl font-bold text-brand-900 tabular-nums">
          {valor}
        </p>
      </div>
      {Icono && (
        <div className="w-10 h-10 shrink-0 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
          <Icono className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
