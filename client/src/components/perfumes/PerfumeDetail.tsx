import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { type Brand, useBrandContext } from "../../context/BrandContext";
import { type Perfume, usePerfumeContext } from "../../context/PerfumeContext";

type Note = {
  type: string;
  value: string;
};

function PerfumeDetail() {
  const { id } = useParams();
  const { getPerfumeById } = usePerfumeContext();
  const { getBrandById } = useBrandContext();
  const { isAuthenticated } = useAuthContext();

  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // ---- Fonction pour récupérer les notes ----
  const fetchNotes = useCallback(async (perfumeId: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/perfumes/${perfumeId}/notes`,
      );
      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des notes");
      }
      const data = await res.json();
      // Vérifie si c'est bien un tableau
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        console.warn("Format inattendu pour les notes :", data);
        setNotes([]);
      }
    } catch (error) {
      console.error("Erreur fetch notes :", error);
      setNotes([]);
    }
  }, []); // Pas de dépendances, car `setNotes` est stable

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const perfumeData = await getPerfumeById(Number(id));
        if (perfumeData) {
          setPerfume(perfumeData);

          const brandData = getBrandById(perfumeData.brand_id);
          setBrand(brandData);

          await fetchNotes(perfumeData.id); // Utilisation de la version mémorisée
        }
      } catch (err) {
        console.error("Erreur lors du chargement du parfum:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, getPerfumeById, getBrandById, fetchNotes]); // Ajoutez `fetchNotes` comme dépendance

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert("Veuillez vous connecter pour ajouter aux favoris");
      return;
    }
    setIsFavorite((prev) => !prev);
  };

  // Regrouper les notes par type
  const groupedNotes = notes.reduce((acc: Record<string, string[]>, note) => {
    if (!acc[note.type]) {
      acc[note.type] = [];
    }
    acc[note.type].push(note.value);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black">
          loading...
        </div>
      </div>
    );
  }

  if (!perfume) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Parfum non trouvé</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- Brand Section --- */}
      {brand && (
        <section className="flex flex-col items-center mb-8">
          <img
            className="w-[250px] h-[60px] object-contain mb-4"
            src={brand.image_url ?? "/default-brand.png"}
            alt={brand.name}
          />
          <h1 className="font-bold text-2xl">{brand.name}</h1>
        </section>
      )}

      {/* --- Product Section --- */}
      <section className="flex flex-col md:flex-row justify-center items-start gap-6 mb-8">
        {/* Image produit */}
        <div className="w-full md:w-[260px] h-[280px] border border-black bg-[#fffcfc] flex items-center justify-center relative">
          <img
            className="max-w-[240px] max-h-[260px] object-contain"
            src={perfume.image_url ?? "/default-perfume.png"}
            alt={perfume.name}
          />
          <div className="absolute bottom-2 left-0 w-full text-center text-xs">
            {perfume.gender_id === 1
              ? "Homme"
              : perfume.gender_id === 2
                ? "Femme"
                : "Mixte"}
          </div>
        </div>

        {/* Détails produit */}
        <div className="flex flex-col w-full md:w-auto">
          <div className="w-full md:w-[200px] h-[40px] border border-black bg-[#fffcfc] flex items-center justify-center">
            <h2 className="text-sm font-medium">{perfume.name}</h2>
          </div>

          <div className="mt-4 w-full md:w-[500px] min-h-[200px] border border-black shadow p-4">
            <p className="mb-4 text-sm">{perfume.description}</p>

            {Object.keys(groupedNotes).length > 0 && (
              <div className="space-y-4">
                {Object.entries(groupedNotes).map(([type, values]) => (
                  <div key={type} className="text-xs">
                    {/* Afficher le type traduit si besoin */}
                    <p className="font-semibold mb-1">
                      {type === "top"
                        ? "Notes de tête"
                        : type === "heart"
                          ? "Notes de cœur"
                          : type === "base"
                            ? "Notes de fond"
                            : type}
                    </p>
                    {/* Afficher toutes les valeurs sur une ligne */}
                    <p>{values.join(", ")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- Actions --- */}
      <section className="flex flex-col md:flex-row gap-4 justify-center md:justify-start mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-[184px] h-9 border border-black bg-[#fffcfc] text-xs"
          onClick={() => alert("Je le possède")}
        >
          Je le possède
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="w-[184px] h-9 border border-black bg-[#fffcfc] text-xs"
          onClick={() => alert("À tester")}
        >
          A tester
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFavoriteToggle}
          className={`w-[184px] h-9 border border-black text-xs ${
            isFavorite ? "bg-black text-white" : "bg-[#fffcfc] text-black"
          }`}
        >
          Ajouter à ta wishlist
        </motion.button>
      </section>
    </div>
  );
}

export default PerfumeDetail;
