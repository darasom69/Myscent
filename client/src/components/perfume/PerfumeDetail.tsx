import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import { useBrandContext } from "../../context/BrandContext";
import { useCollectionContext } from "../../context/CollectionContext";
import { type Perfume, usePerfumeContext } from "../../context/PerfumeContext";

type Note = { type: "top" | "heart" | "base" | string; value: string };

export default function PerfumeDetail() {
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  // Define gallery images array
  const gallery: string[] = perfume
    ? [perfume.image_url ?? "/default-perfume.png"]
    : ["/default-perfume.png"];

  const fetchNotes = useCallback(async (perfumeIdLocal: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/perfumes/${perfumeIdLocal}/notes`,
      );
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      setNotes([]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      const perfumeData = await getPerfumeById(Number(id));
      if (perfumeData) {
        setPerfume(perfumeData);
        setActiveImg(perfumeData.image_url ?? "/default-perfume.png");
        await fetchNotes(perfumeData.id);
      }
    };
    loadData();
  }, [id, getPerfumeById, fetchNotes]);

  if (!perfume) {
    return <div className="p-12 text-center">Parfum introuvable</div>;
  }

  // Group notes
  const groupedNotes = notes.reduce((acc: Record<string, string[]>, n) => {
    if (!acc[n.type]) acc[n.type] = [];
    acc[n.type].push(n.value);
    return acc;
  }, {});

  const handleToggle = async (status: "owned" | "tested" | "wishlist") => {
    if (!isAuthenticated) {
      alert("Veuillez vous connecter");
      return;
    }
    const already =
      (status === "owned" && ownedIds.includes(perfumeId)) ||
      (status === "tested" && testedIds.includes(perfumeId)) ||
      (status === "wishlist" && wishlistIds.includes(perfumeId));

    if (already) await removeFromCollection(perfumeId);
    else await addToCollection(perfumeId, status);
  };

  return (
    <div className="bg-[#f8f3ef] py-10 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Col gauche */}
        <div>
          {/* Breadcrumb */}
          <div className="text-xs text-gray-600 mb-4 space-x-1">
            <Link to="/parfums" className="hover:underline">
              Parfums
            </Link>{" "}
            &gt; <span className="hover:underline">{perfume.brand_id}</span>{" "}
            &gt; <span className="font-medium">{perfume.name}</span>
          </div>

          <h1 className="text-2xl font-playfair">{perfume.name}</h1>
          <p className="text-lg mt-1">{getBrandById(perfume.brand_id)?.name}</p>

          {/* Note fictive si pas en DB */}
          <p className="text-sm text-gray-500 mb-4">★★★★☆ (4.5) • 15 avis</p>

          <p className="text-sm mb-6">{perfume.description}</p>

          {/* Boutons */}
          <div className="flex flex-col gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => handleToggle("owned")}
              className="h-10 rounded bg-gradient-to-r from-[#988574] to-[#d9c9bc] text-white text-sm"
            >
              {ownedIds.includes(perfumeId)
                ? "Retirer (possède)"
                : "Je le possède"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => handleToggle("tested")}
              className="h-10 rounded border border-gray-400 text-sm"
            >
              {testedIds.includes(perfumeId) ? "Retirer (testé)" : "À tester"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => handleToggle("wishlist")}
              className="h-10 rounded border border-gray-300 text-xs text-gray-700"
            >
              {wishlistIds.includes(perfumeId)
                ? "Retirer de la wishlist"
                : "Ajouter à la wishlist"}
            </motion.button>
          </div>

          {/* Accordéons notes */}
          <div className="divide-y divide-gray-300 text-sm">
            {Object.entries(groupedNotes).map(([type, vals]) => (
              <details key={type} className="py-2">
                <summary className="cursor-pointer font-medium capitalize">
                  {type === "top"
                    ? "Note de tête"
                    : type === "heart"
                      ? "Note de cœur"
                      : type === "base"
                        ? "Note de fond"
                        : type}
                </summary>
                <p className="mt-1 text-gray-600">{vals.join(", ")}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Col droite */}
        <div>
          <div className="aspect-square bg-white flex items-center justify-center border border-gray-300 rounded mb-4">
            <img
              src={activeImg ?? "/default-perfume.png"}
              alt={perfume.name}
              className="max-h-[350px] object-contain"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {gallery.map((src) => (
              <button
                type="button"
                key={src} // Use the image URL as the unique key
                onClick={() => setActiveImg(src)}
                className={`border rounded p-1 ${
                  activeImg === src ? "border-black" : "border-gray-300"
                }`}
              >
                <img src={src} alt="" className="h-16 object-contain mx-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
