import { motion } from "framer-motion";
import { useBrandContext } from "../../context/BrandContext";
import { usePerfumeContext } from "../../context/PerfumeContext";

function BrandInfo() {
  const { perfumeSelected } = usePerfumeContext();
  const { getBrandById } = useBrandContext();

  // Si aucun parfum sélectionné, on affiche rien
  if (!perfumeSelected) return null;

  // Récupération de la marque liée au parfum sélectionné
  const brand = getBrandById(perfumeSelected.brand_id);

  // Si pas de marque trouvée
  if (!brand) return null;

  return (
    <motion.div
      className="w-[475px] h-[200px] relative mx-auto my-8"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <motion.div
        className="w-[357px] h-[146px] top-[54px] left-[118px] shadow-[0px_4px_4px_#00000040] absolute bg-[#fffcfc] border border-solid border-black"
        whileHover={{
          boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.2)",
          y: -5,
        }}
      >
        <section className="p-0">
          <p className="absolute w-[344px] top-[23px] left-[6px] [font-family:'Inter',Helvetica] font-normal text-black text-sm text-center tracking-[0] leading-[normal]">
            {brand.description}
          </p>
        </section>
      </motion.div>

      <div className="absolute w-[107px] h-[72px] top-0 left-7 bg-[#f8f3ef] border border-solid border-black" />

      <motion.img
        className="absolute w-[193px] h-[50px] top-[11px] left-0 object-cover"
        alt="Brand Logo"
        src={brand.image_url}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
    </motion.div>
  );
}

export default BrandInfo;
