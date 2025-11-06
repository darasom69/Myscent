import { Search as SearchIcon } from "lucide-react";
// src/pages/AllPerfumes.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import NewsletterBanner from "../components/allPerfumes/NewletterBanner";
import PerfumeGrid from "../components/allPerfumes/PerfumesGrid";
import { type Perfume, usePerfumeContext } from "../context/PerfumeContext";

export default function AllPerfumes() {
  const { perfumes = [], fetchPerfumes } = usePerfumeContext();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch on mount
  useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);

  // Derived filtered list
  const filteredPerfumes = useMemo<Perfume[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return perfumes;
    return perfumes.filter((p) => p.name.toLowerCase().includes(q));
  }, [search, perfumes]);

  const handleSelectPerfume = (id: number | string) => {
    navigate(`/parfum/${id}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // rien à faire de plus: la liste se met déjà à jour via 'search'
  };

  return (
    <div className="min-h-screen ">
      {" "}
      {/* beige doux du visuel */}
      {/* HERO compact avec titre, sous-titre et search bar */}
      <section className="mx-auto px-6 pt-14 pb-10 text-center bg-[#e9dfd6]">
        <h1 className="font-display text-[34px] leading-tight md:text-[48px] text-[#0b0908]">
          Découvrez l&apos;univers
          <br className="hidden md:block" />
          envoûtant de nos parfums
        </h1>

        <p className="mx-auto mt-3 max-w-3xl text-[13px] md:text-sm text-[#2d261f]/80">
          Plongez dans une expérience olfactive unique et raffinée. Trouvez le
          parfum qui saura révéler votre personnalité.
        </p>

        {/* Search bar */}
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-5 flex w-full max-w-xl items-center gap-2"
        >
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#0b0908]/50" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-[#0b0908]/15 bg-white/70 px-10 py-2 text-sm text-[#0b0908] placeholder:text-[#0b0908]/45 outline-none focus:ring-2 focus:ring-[#c9b3a2]"
              aria-label="Rechercher un parfum"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-[#c9b3a2] px-4 py-2 text-sm font-medium text-[#2b1f18] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#c9b3a2]/60"
          >
            Search
          </button>
        </form>
      </section>
      {/* GRID */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <PerfumeGrid
          perfumes={filteredPerfumes}
          onSelect={handleSelectPerfume}
        />
      </section>
      <section>
        <NewsletterBanner />
      </section>
    </div>
  );
}
