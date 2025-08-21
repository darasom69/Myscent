import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { type Brand, useBrandContext } from "../../context/BrandContext";
import { useCollectionContext } from "../../context/CollectionContext";
import { type Perfume, usePerfumeContext } from "../../context/PerfumeContext";

type Note = { type: string; value: string };

function PerfumeDetail() {
  const { id } = useParams();
  const perfumeId = Number(id);

  const { getPerfumeById } = usePerfumeContext();
  const { getBrandById } = useBrandContext();
  const { isAuthenticated } = useAuthContext();
  const {
    ownedIds,
    testedIds,
    wishlistIds,
    addToCollection,
    removeFromCollection,
  } = useCollectionContext();

  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async (perfumeIdLocal: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/perfumes/${perfumeIdLocal}/notes`,
      );
      if (!res.ok) throw new Error("Erreur lors de la récupération des notes");
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const perfumeData = await getPerfumeById(Number(id));
        if (perfumeData) {
          setPerfume(perfumeData);
          const brandData = getBrandById(perfumeData.brand_id);
          setBrand(brandData);
          await fetchNotes(perfumeData.id);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, getPerfumeById, getBrandById, fetchNotes]);

  const handleToggle = async (status: "owned" | "tested" | "wishlist") => {
    if (!isAuthenticated) {
      alert("Veuillez vous connecter");
      return;
    }
    const inStatus =
      (status === "owned" && ownedIds.includes(perfumeId)) ||
      (status === "tested" && testedIds.includes(perfumeId)) ||
      (status === "wishlist" && wishlistIds.includes(perfumeId));

    if (inStatus) await removeFromCollection(perfumeId);
    else await addToCollection(perfumeId, status);
  };

  const groupedNotes = notes.reduce((acc: Record<string, string[]>, note) => {
    if (!acc[note.type]) {
      acc[note.type] = []; // Initialize the array if it doesn't exist
    }
    acc[note.type].push(note.value); // Add the note value to the array
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (!perfume) {
    return <div className="text-center py-12">Parfum non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

      <section className="flex flex-col md:flex-row justify-center items-start gap-6 mb-8">
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

        <div className="flex flex-col w-full md:w-auto">
          <div className="w-full md:w-[200px] h-[40px] border border-black bg-[#fffcfc] flex items-center justify-center">
            <h2 className="text-sm font-medium">{perfume.name}</h2>
          </div>

          <div className="mt-4 w-full md:w-[500px] min-h-[200px] border border-black shadow p-4">
            <p className="mb-4 text-sm">{perfume.description}</p>

            {Object.keys(groupedNotes).length > 0 &&
              Object.entries(groupedNotes).map(([type, values]) => (
                <div key={type} className="text-xs mb-2">
                  <p className="font-semibold">
                    {type === "top"
                      ? "Notes de tête"
                      : type === "heart"
                        ? "Notes de cœur"
                        : type === "base"
                          ? "Notes de fond"
                          : type}
                  </p>
                  <p>{values.join(", ")}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Actions collection */}
      <section className="flex flex-col md:flex-row gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => handleToggle("owned")}
          className={`w-[184px] h-9 border border-black text-xs ${
            ownedIds.includes(perfumeId)
              ? "bg-black text-white"
              : "bg-[#fffcfc] text-black"
          }`}
        >
          {ownedIds.includes(perfumeId) ? "Retirer (possède)" : "Je le possède"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => handleToggle("tested")}
          className={`w-[184px] h-9 border border-black text-xs ${
            testedIds.includes(perfumeId)
              ? "bg-black text-white"
              : "bg-[#fffcfc] text-black"
          }`}
        >
          {testedIds.includes(perfumeId) ? "Retirer (testé)" : "À tester"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => handleToggle("wishlist")}
          className={`w-[184px] h-9 border border-black text-xs ${
            wishlistIds.includes(perfumeId)
              ? "bg-black text-white"
              : "bg-[#fffcfc] text-black"
          }`}
        >
          {wishlistIds.includes(perfumeId)
            ? "Retirer de ta wishlist"
            : "Ajouter à ta wishlist"}
        </motion.button>
      </section>
    </div>
  );
}

export default PerfumeDetail;
