import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

const Habits = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-50 to-brand-100/60 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="text-center space-y-5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-xl shadow-brand-600/30"
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-brand-900">Bienvenido</h1>
          <p className="text-brand-700 text-lg">
            Selecciona una herramienta para comenzar
          </p>
        </div>
        <p className="text-sm text-brand-500">
          Usa el menú lateral para ir a tus hábitos
        </p>
      </motion.div>
    </div>
  );
};

export default Habits;
