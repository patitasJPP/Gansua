import { Outlet } from "react-router-dom";
import { Navbar } from "../layouts/NavbarHabitos";

export const MainLayoutHabitos = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
