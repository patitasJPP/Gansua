import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/mainLayout";
import Index from "../Pages/Habits";
import Habitos from "../tools/Habitos/Pages/HabitosPage";
import { MainLayoutHabitos } from "../tools/Habitos/layouts/MainLayoutHabitos";

const EstadisticasPage = lazy(
  () => import("../tools/Habitos/Pages/EstadisticasPage"),
);

const estadisticas = (
  <Suspense
    fallback={
      <div className="min-h-screen bg-brand-50 p-8 flex items-center justify-center">
        <p className="text-brand-600 text-lg">Cargando estadísticas...</p>
      </div>
    }
  >
    <EstadisticasPage />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Index /> },
      {
        path: "/habitos",
        element: <MainLayoutHabitos />,
        children: [
          { index: true, element: <Habitos /> },
          { path: "estadisticas", element: estadisticas },
        ],
      },
    ],
  },
]);
