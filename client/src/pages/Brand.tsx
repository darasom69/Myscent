// client/src/pages/Brand.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useBrandContext } from "../context/BrandContext";
import { type Perfume, usePerfumeContext } from "../context/PerfumeContext";

function Brand() {
  const { id } = useParams();
  const brandId = Number(id);

  const { getBrandById } = useBrandContext();
  const { perfumes, fetchPerfumes } = usePerfumeContext();

  const [loading, setLoading] = useState(true);

  // Marque
  const brand = useMemo(() => {
    if (!Number.isFinite(brandId)) return null;
    return getBrandById(brandId) ?? null;
  }, [brandId, getBrandById]);

  // S’assurer que les parfums sont chargés
  useEffect(() => {
    const ensure = async () => {
      setLoading(true);
      try {
        if (!perfumes || perfumes.length === 0) {
          await fetchPerfumes();
        }
      } finally {
        setLoading(false);
      }
    };
    void ensure();
  }, [perfumes, fetchPerfumes]);

  // Parfums de la marque
  const brandPerfumes: Perfume[] = useMemo(() => {
    if (!perfumes) return [];
    return perfumes.filter((p) => p.brand_id === brandId);
  }, [perfumes, brandId]);

  // Petites stats pour l’encart (si dispo)
  const count = brandPerfumes.length;
  const years = brandPerfumes
    .map((p) => p.release_year)
    .filter((y): y is number => typeof y === "number");
  const minYear = years.length ? Math.min(...years) : null;
  const maxYear = years.length ? Math.max(...years) : null;

  if (!id || Number.isNaN(brandId)) {
    return (
      <div className="min-h-screen bg-[#f4efe9] px-4 py-10">
        <p className="text-center">Marque introuvable.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4efe9] px-4 py-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-[#f4efe9] px-4 py-10">
        <p className="text-center">Marque non trouvée.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efe9]">
      {/* Bandeau haut : logo à gauche, titre centré */}
      <header className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-3 items-center">
          <div className="flex">
            <img
              src={brand.image_url ?? "/default-brand.png"}
              alt={brand.name}
              className="h-[60px] w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl text-center font-semibold">{brand.name}</h1>
          <div /> {/* colonne vide pour équilibrer */}
        </div>
      </header>

      {/* Encart descriptif bordé */}
      <section className="max-w-3xl mx-auto mt-10 px-6">
        <div className="border border-black bg-white/70 shadow px-6 py-6 text-center text-sm leading-6">
          {brand.description ? (
            <p className="whitespace-pre-line">{brand.description}</p>
          ) : (
            <>
              <p>
                {brand.name} compte <strong>{count}</strong> parfum
                {count > 1 ? "s" : ""} listé{count > 1 ? "s" : ""} dans notre
                encyclopédie olfactive.
              </p>
              {years.length >= 1 && (
                <p>
                  Créations de {minYear ?? ""}
                  {minYear && maxYear && minYear !== maxYear
                    ? ` à ${maxYear}`
                    : ""}
                  .
                </p>
              )}
              <p className="text-gray-600 mt-2">
                (Ajoute une description marque dans la base pour remplacer ce
                texte.)
              </p>
            </>
          )}
        </div>
      </section>

      {/* Titre Collection */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <h2 className="text-center text-xl font-semibold">Collection</h2>
      </div>

      {/* Grille 3 colonnes, style Figma (image + nom en petit cartouche) */}
      <section className="max-w-6xl mx-auto px-6 mt-6 pb-16">
        {brandPerfumes.length === 0 ? (
          <div className="py-12 text-center text-gray-600">
            Aucun parfum répertorié pour cette marque.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12">
            {brandPerfumes.map((p) => (
              <Link
                key={p.id}
                to={`/parfum/${p.id}`}
                className="group flex flex-col items-center"
              >
                <div className="h-[220px] w-full max-w-[240px] border border-black bg-white flex items-center justify-center shadow-sm">
                  <img
                    src={p.image_url ?? "/default-perfume.png"}
                    alt={p.name}
                    className="max-h-[200px] object-contain p-3"
                  />
                </div>

                {/* petit cartouche sous l’image */}
                <div className="mt-3">
                  <span className="inline-block text-xs border border-black px-3 py-1 bg-white group-hover:-translate-y-0.5 transition-transform">
                    {p.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Lien retour */}
        <div className="mt-12 text-center">
          <Link to="/" className="text-sm underline hover:opacity-80">
            ← Retour
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Brand;
