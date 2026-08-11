import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

export const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <Navbar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
