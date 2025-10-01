// src/components/home/PerfumesMoment.tsx
import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";
import { Link } from "react-router";
import { usePerfumeContext } from "../../context/PerfumeContext";

type CtxPerfume = {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  image_url?: string;
  imageUrl?: string;
  cover?: string;
  picture?: string;
  rating?: number;
  updatedAt?: string | number | Date;
  brand?: { name?: string } | string;
  isMoment?: boolean;
  featured?: boolean;
};

export default function PerfumesMoment() {
  const { perfumes, loading, error } = usePerfumeContext() as {
    perfumes: CtxPerfume[] | undefined;
    loading?: boolean;
    error?: string | { message: string };
  };

  // -- mapping helper: harmonise les champs depuis ta DB
  const norm = useCallback((p: CtxPerfume) => {
    const img =
      p.image ?? p.image_url ?? p.imageUrl ?? p.cover ?? p.picture ?? "";
    const brandName =
      typeof p.brand === "string" ? p.brand : (p.brand?.name ?? "");
    return {
      id: p.id,
      name: p.name,
      brand: brandName,
      description: p.description ?? "",
      image: img,
      rating: p.rating ?? 0,
      updatedAt: p.updatedAt ? new Date(p.updatedAt).getTime() : 0,
      isMoment: Boolean(p.isMoment ?? p.featured),
    };
  }, []);

  // -- sélection de 3 "parfums du moment"
  const picks = useMemo(() => {
    const list = (perfumes ?? []).map(norm);
    if (list.length === 0) return [];

    const moments = list.filter((p) => p.isMoment);
    const base =
      moments.length >= 3
        ? moments
        : list
            .slice()
            .sort(
              (a, b) =>
                (b.rating || 0) - (a.rating || 0) || b.updatedAt - a.updatedAt,
            );

    return base.slice(0, 3);
  }, [perfumes, norm]);

  return (
    <section className="bg-[url('/fond.png')]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Titre + sous-titre */}
        <div className="text-center">
          <h2 className="font-display text-2xl md:text-3xl text-[#070605]">
            Nos parfums du moment
          </h2>
          <p className="mt-2 text-sm md:text-base text-neutral-700">
            Une collection soigneusement choisie pour les amateurs de fragrances
            rares
          </p>
        </div>

        {/* États: loading / error */}
        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => ({
              id: `placeholder-${i}`,
            })).map((placeholder) => (
              <div
                key={placeholder.id} // Use a unique static key
                className="animate-pulse rounded-2xl bg-[#f8f3ef] p-6 shadow-sm"
              >
                <div className="mx-auto h-40 w-40 rounded bg-black/10" />
                <div className="mt-6 h-4 w-32 rounded bg-black/10" />
                <div className="mt-2 h-5 w-44 rounded bg-black/10" />
                <div className="mt-3 h-20 w-full rounded bg-black/10" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="mt-8 text-center text-sm text-red-600">
            {typeof error === "string" ? error : "Une erreur est survenue."}
          </p>
        )}

        {!loading && !error && (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {picks.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col justify-between rounded-2xl bg-[#f8f3ef] p-6 shadow-sm transition hover:shadow-md"
              >
                {/* image */}
                <div className="flex justify-center">
                  <img
                    src={p.image || "/perfume-placeholder.jpg"}
                    alt={p.name}
                    className="h-40 w-auto object-contain"
                    loading="lazy"
                  />
                </div>

                {/* texte */}
                <div className="mt-6 flex-1">
                  <h3 className="font-sans text-sm font-semibold text-[#070605]">
                    {p.name}
                  </h3>
                  {p.brand && (
                    <p className="font-display text-lg text-[#070605]">
                      {p.brand}
                    </p>
                  )}
                  {p.description && (
                    <p className="mt-3 text-sm leading-relaxed text-neutral-700 line-clamp-6">
                      {p.description}
                    </p>
                  )}
                </div>

                {/* lien */}
                <Link
                  to={`/parfum/${p.id}`}
                  className="mt-5 inline-flex items-center text-sm font-medium underline underline-offset-4 hover:opacity-80"
                >
                  Découvrir
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
