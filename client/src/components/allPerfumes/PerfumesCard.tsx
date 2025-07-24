import { motion } from "framer-motion";
import type { Perfume } from "../../context/PerfumeContext";

interface PerfumesCardProps {
  perfume: Perfume;
  onClick: () => void;
}

export default function PerfumesCard({ perfume, onClick }: PerfumesCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      className="cursor-pointer border border-black bg-white shadow-sm hover:shadow-md p-4 rounded-lg flex flex-col items-center"
      onClick={onClick}
    >
      <img
        src={perfume.image_url ?? "/default-perfume.png"}
        alt={perfume.name}
        className="w-32 h-32 object-contain mb-4"
      />
      <h3 className="text-sm font-medium text-center">{perfume.name}</h3>
    </motion.div>
  );
}
