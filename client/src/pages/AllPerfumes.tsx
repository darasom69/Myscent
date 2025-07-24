import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PerfumeFilters from "../components/allPerfumes/PerfumesFilters";
import PerfumeGrid from "../components/allPerfumes/PerfumesGrid";
import { type Perfume, usePerfumeContext } from "../context/PerfumeContext";

export default function AllPerfumes() {
  const { perfumes, fetchPerfumes } = usePerfumeContext();
  const [search, setSearch] = useState("");
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPerfumes(perfumes);
    } else {
      setFilteredPerfumes(
        perfumes.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, perfumes]);

  // Fonction appelée quand on clique sur une carte
  const handleSelectPerfume = (id: number) => {
    navigate(`/parfum/${id}`);
  };

  return (
    <div className="bg-[#f8f3ef] min-h-screen py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-8">
        Découvrez nos parfums
      </h1>
      <p className="text-center text-sm mb-4">
        Explorez notre selection de parfums pour trouver celui qui vous
        correspond le mieux.
      </p>

      <PerfumeFilters search={search} setSearch={setSearch} />

      <PerfumeGrid perfumes={filteredPerfumes} onSelect={handleSelectPerfume} />
    </div>
  );
}
