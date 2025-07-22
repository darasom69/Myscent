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
    <section className="bg-primary flex flex-col items-center my-8">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        {/* Logo marque */}
        <div className="border">
          <img
            src={brand.image_url ?? "/default-brand.png"}
            alt={brand.name}
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Bloc description */}
        <div className="border shadow-md p-4 max-w-xl text-center leading-relaxed ">
          <p className="text-sm md:text-base">{brand.description}</p>
        </div>
      </div>
    </section>
  );
}

export default BrandInfo;
