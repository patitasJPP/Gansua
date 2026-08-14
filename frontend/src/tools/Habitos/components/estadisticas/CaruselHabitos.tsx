import { useEffect, useRef, useState } from "react";
import { Ban, Check, ChevronLeft, ChevronRight } from "lucide-react";

type ItemCarusel = {
  habito: string;
  total: number;
  esAbstinencia: boolean;
};

type Props = {
  data: ItemCarusel[];
};

const capitalizar = (texto: string) => {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export const CaruselHabitos = ({ data }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [puedeIzq, setPuedeIzq] = useState(false);
  const [puedeDer, setPuedeDer] = useState(false);

  const actualizarFlechas = () => {
    const el = trackRef.current;
    if (!el) return;
    setPuedeIzq(el.scrollLeft > 0);
    setPuedeDer(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    actualizarFlechas();
  }, [data]);

  const desplazar = (direccion: number) => {
    const el = trackRef.current;
    if (!el) return;
    const tarjeta = el.querySelector<HTMLElement>("[data-tarjeta]");
    const paso = tarjeta ? tarjeta.offsetWidth + 16 : 300;
    el.scrollBy({ left: direccion * paso, behavior: "smooth" });
  };

  if (data.length === 0) {
    return (
      <p className="text-sm text-brand-600">Aún no hay hábitos registrados.</p>
    );
  }

  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="relative">
      {puedeIzq && (
        <button
          type="button"
          onClick={() => desplazar(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-brand-100 text-brand-600 hover:bg-brand-50 flex items-center justify-center transition cursor-pointer"
          title="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <div
        ref={trackRef}
        onScroll={actualizarFlechas}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {data.map((d) => (
          <div
            key={d.habito}
            data-tarjeta
            className={`snap-start shrink-0 w-44 rounded-2xl border p-4 ${
              d.esAbstinencia
                ? "border-rose-100 bg-rose-50/60"
                : "border-brand-100 bg-white"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  d.esAbstinencia
                    ? "bg-rose-100 text-rose-600"
                    : "bg-brand-100 text-brand-600"
                }`}
              >
                {d.esAbstinencia ? (
                  <Ban className="w-5 h-5" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
              </div>
              {d.esAbstinencia && (
                <span className="shrink-0 inline-flex items-center text-[10px] uppercase tracking-wide font-bold text-rose-600 bg-rose-100 rounded-full px-2 py-0.5">
                  Evitar
                </span>
              )}
            </div>
            <p
              className={`mt-3 font-semibold truncate ${
                d.esAbstinencia ? "text-rose-900" : "text-brand-900"
              }`}
              title={capitalizar(d.habito)}
            >
              {capitalizar(d.habito)}
            </p>
            <p
              className={`text-2xl font-bold tabular-nums ${
                d.esAbstinencia ? "text-rose-700" : "text-brand-800"
              }`}
            >
              {d.total}
            </p>
            <p className="text-xs text-brand-500">
              veces {d.esAbstinencia ? "evitado" : "hecho"}
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-brand-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  d.esAbstinencia ? "bg-rose-500" : "bg-brand-600"
                }`}
                style={{ width: `${Math.max(4, (d.total / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {puedeDer && (
        <button
          type="button"
          onClick={() => desplazar(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-brand-100 text-brand-600 hover:bg-brand-50 flex items-center justify-center transition cursor-pointer"
          title="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
