import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useBrandContext } from "../context/BrandContext";
import { type Perfume, usePerfumeContext } from "../context/PerfumeContext";

export default function Brand() {
  const { id } = useParams();
  const brandId = Number(id);

  const { getBrandById } = useBrandContext();
  const { perfumes, fetchPerfumes } = usePerfumeContext();

  const [loading, setLoading] = useState(true);

  // ----- Marque courante
  const brand = useMemo(() => {
    if (!Number.isFinite(brandId)) return null;
    return getBrandById(brandId) ?? null;
  }, [brandId, getBrandById]);

  // ----- Charger parfums si besoin
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

  // ----- Parfums de la marque
  const brandPerfumes: Perfume[] = useMemo(() => {
    if (!perfumes) return [];
    return perfumes.filter((p) => p.brand_id === brandId);
  }, [perfumes, brandId]);

  // ----- Stats / fallback texte
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
      {/* ==== Bandeau top (titre + sous-titre) ==== */}
      <section className="bg-[#e9dfd6]">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <h1 className="font-display text-3xl md:text-4xl text-[#0b0908]">
            Nos marques d&rsquo;exception
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-black/70">
            Chaque marque raconte une histoire unique. Découvrez les créateurs
            qui transforment les essences en poésie liquide.
          </p>
        </div>
      </section>

      {/* ==== Bloc intro marque : texte à gauche / logo à droite ==== */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
          {/* Texte gauche */}
          <div>
            <h2 className="font-display text-2xl text-[#0b0908]">
              {brand.name}
            </h2>
            <div className="mt-5 text-sm leading-6 text-[#1a1613]">
              {brand.description ? (
                <p className="whitespace-pre-line">{brand.description}</p>
              ) : (
                <>
                  <p>
                    {brand.name} compte <strong>{count}</strong> parfum
                    {count > 1 ? "s" : ""} listé{count > 1 ? "s" : ""} dans
                    notre encyclopédie olfactive.
                  </p>
                  {years.length >= 1 && (
                    <p className="mt-2">
                      La plus ancienne création répertoriée date de{" "}
                      <strong>{minYear}</strong>
                      {minYear && maxYear && minYear !== maxYear ? (
                        <>
                          {" "}
                          et la plus récente de <strong>{maxYear}</strong>
                        </>
                      ) : null}
                      .
                    </p>
                  )}
                  <p className="mt-2 text-black/70">
                    (Ajoute un texte de présentation pour cette marque dans la
                    base afin de remplacer ce paragraphe.)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Logo droite */}
          <div className="flex items-start justify-center md:justify-end">
            <img
              src={brand.image_url ?? "/default-brand.png"}
              alt={brand.name}
              className="h-[84px] w-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* ==== Titre “La collection” ==== */}
      <section className="mx-auto max-w-6xl px-6">
        <h3 className="text-center font-display text-2xl text-[#0b0908]">
          La collection
        </h3>
      </section>

      {/* ==== Grille produits (images homogènes + cartouche nom) ==== */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        {brandPerfumes.length === 0 ? (
          <div className="py-12 text-center text-gray-600">
            Aucun parfum répertorié pour cette marque.
          </div>
        ) : (
          <div
            className="
              grid grid-cols-1 gap-y-14
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {brandPerfumes.map((p) => (
              <Link
                key={p.id}
                to={`/parfum/${p.id}`}
                className="group flex flex-col items-center"
              >
                {/* Boîte visuelle à hauteur fixe pour uniformiser toutes les images */}
                <div className="flex h-64 w-full max-w-[240px] items-center justify-center overflow-hidden rounded border border-black/10 bg-white shadow-sm">
                  <img
                    src={p.image_url ?? "/default-perfume.png"}
                    alt={p.name}
                    className="max-h-[240px] w-auto object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                {/* Cartouche nom sous l’image */}
                <div className="mt-3">
                  <span className="inline-block rounded border border-black/20 bg-white px-3 py-1 text-xs text-[#0b0908] transition-transform duration-300 group-hover:-translate-y-0.5">
                    {p.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Lien retour */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="text-sm underline underline-offset-4 hover:opacity-80"
          >
            ← Retour
          </Link>
        </div>
      </section>
    </div>
  );
}
