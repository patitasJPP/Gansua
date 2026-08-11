import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/mainLayout";
import Index from "../Pages/Habits";
import Habitos from "../tools/Habitos/Pages/HabitosPage";
import { MainLayoutHabitos } from "../tools/Habitos/layouts/MainLayoutHabitos";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Index /> },
      {
        path: "/habitos",
        element: <MainLayoutHabitos />,
        children: [{ index: true, element: <Habitos /> }],
      },
    ],
  },
]);
