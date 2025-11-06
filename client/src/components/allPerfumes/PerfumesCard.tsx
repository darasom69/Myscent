import { motion } from "framer-motion";
import type { Perfume } from "../../context/PerfumeContext";

interface PerfumesCardProps {
  perfume: Perfume;
  onClick: () => void;
}

export default function PerfumesCard({ perfume, onClick }: PerfumesCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -6 }}
      className="
        group w-full text-left bg-transparent
        focus:outline-none focus:ring-2 focus:ring-black/10 rounded-2xl
        p-2
      "
      aria-label={`Ouvrir ${perfume.name}`}
    >
      {/* Conteneur image : même taille pour toutes */}
      <div className="relative mx-auto flex items-center justify-center h-64 w-full overflow-hidden">
        <motion.img
          src={perfume.image_url || "/default-perfume.png"}
          alt={perfume.name}
          className="max-h-full max-w-full object-contain"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          loading="lazy"
        />
      </div>

      {/* Texte */}
      <div className="mt-6">
        <h3 className="text-[15px] font-medium text-[#0b0908]">
          {perfume.name}
        </h3>
        {perfume.release_year && (
          <p className="mt-1 text-[12px] leading-none text-black/50">
            {perfume.release_year}
          </p>
        )}
      </div>
    </motion.button>
  );
}
