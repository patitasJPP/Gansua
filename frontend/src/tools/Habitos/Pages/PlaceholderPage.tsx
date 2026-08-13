import { motion } from "motion/react";
import { Construction } from "lucide-react";

type Props = {
  titulo: string;
  descripcion: string;
};

export const PlaceholderPage = ({ titulo, descripcion }: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-50 to-brand-100/60 p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.08 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-600/30"
        >
          <Construction className="w-8 h-8" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold text-brand-900">{titulo}</h1>
          <p className="text-brand-700 mt-1">{descripcion}</p>
        </div>
      </motion.div>
    </div>
  );
};
