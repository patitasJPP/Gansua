import { AnimatePresence, motion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./navbar";
import { transicionPagina } from "../animaciones";

export const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      <Navbar />
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={transicionPagina}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
