import { Outlet } from "react-router-dom";
import { Navbar } from "../layouts/NavbarHabitos";

export const MainLayoutHabitos = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
